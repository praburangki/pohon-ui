<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ClassValue } from 'unocss-variants';
import type { DeepReadonly } from 'vue';
import type {
  Form,
  FormError,
  FormErrorEvent,
  FormErrorWithId,
  FormEvent,
  FormInputEvents,
  FormSchema,
  FormSubmitEvent,
} from '../types/type.form';
import appConfig_ from '#build/app.config';
import formTheme from '#build/pohon/form';
import { uv } from '../utils/uv';

const appConfigForm = appConfig_ as AppConfig & {
  pohon: { form: Partial<typeof formTheme> };
};

const formFn = uv({
  extend: uv(formTheme),
  ...(appConfigForm.pohon?.form || {}),
});

export interface FormProps<T extends object> {
  id?: string | number;
  /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
  schema?: FormSchema<T>;
  /** An object representing the current state of the form. */
  state: Partial<T>;
  /**
   * Custom validation function to validate the form state.
   * @param state - The current state of the form.
   * @returns A promise that resolves to an array of FormError objects, or an array of FormError objects directly.
   */
  validate?: (state: Partial<T>) => Promise<Array<FormError>> | Array<FormError>;
  /**
   * The list of input events that trigger the form validation.
   * @defaultValue `['blur', 'change', 'input']`
   */
  validateOn?: Array<FormInputEvents>;
  /** Disable all inputs inside the form. */
  disabled?: boolean;
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number;
  /**
   * If true, schema transformations will be applied to the state on submit.
   * @defaultValue `true`
   */
  transform?: boolean;
  class?: ClassValue;
  onSubmit?: ((event: FormSubmitEvent<T>) => void | Promise<void>) | (() => void | Promise<void>);
}

export interface FormEmits<T extends object> {
  (event: 'submit', payload: FormSubmitEvent<T>): void;
  (event: 'error', payload: FormErrorEvent): void;
}

export interface FormSlots {
  default: (props?: { errors: Array<FormError> }) => any;
}
</script>

<script lang="ts" setup generic="T extends object">
import { useEventBus } from '@vueuse/core';
import { computed, inject, nextTick, onMounted, onUnmounted, provide, readonly, ref, useId } from 'vue';
import { formBusInjectionKey, formInputsInjectionKey, formLoadingInjectionKey, formOptionsInjectionKey } from '../composables/use-form-field';
import { FormValidationException } from '../types/type.form';
import { validateSchema } from '../utils/util.form';

const props = withDefaults(
  defineProps<FormProps<T>>(),
  {
    validateOn() {
      return ['input', 'blur', 'change'] as Array<FormInputEvents>;
    },
    validateOnInputDelay: 300,
    transform: true,
  },
);

const emits = defineEmits<FormEmits<T>>();
defineSlots<FormSlots>();

const formId = props.id ?? useId() as string;

const bus = useEventBus<FormEvent<T>>(`form-${formId}`);
const parentBus = inject(
  formBusInjectionKey,
  undefined,
);

provide(formBusInjectionKey, bus);

const nestedForms = ref<Map<string | number, { validate: typeof validate_ }>>(new Map());

onMounted(async () => {
  bus.on(async (event) => {
    if (event.type === 'attach') {
      nestedForms.value.set(event.formId, { validate: event.validate });
    } else if (event.type === 'detach') {
      nestedForms.value.delete(event.formId);
    } else if (props.validateOn?.includes(event.type) && !loading.value) {
      if (
        event.type !== 'input'
        || event.eager
        || blurredFields.has(event.name)
      ) {
        await validate_({ name: event.name, silent: true, nested: false });
      }
    }

    if (event.type === 'blur') {
      blurredFields.add(event.name);
    }

    if (event.type === 'change' || event.type === 'input' || event.type === 'blur' || event.type === 'focus') {
      touchedFields.add(event.name);
    }

    if (event.type === 'change' || event.type === 'input') {
      dirtyFields.add(event.name);
    }
  });
});

onUnmounted(() => {
  bus.reset();
});

onMounted(async () => {
  if (parentBus) {
    await nextTick();
    parentBus.emit({
      type: 'attach',
      validate: validate_ as Form<any>['validate'],
      formId,
    });
  }
});

onUnmounted(() => {
  if (parentBus) {
    parentBus.emit({ type: 'detach', formId });
  }
});

const errors = ref<Array<FormErrorWithId>>([]);
provide('form-errors', errors);

const inputs = ref<{ [P in keyof T]?: { id?: string; pattern?: RegExp } }>({});
provide(formInputsInjectionKey, inputs as any);

const dirtyFields = new Set<keyof T>();
const touchedFields = new Set<keyof T>();
const blurredFields = new Set<keyof T>();

function resolveErrorIds(errs: Array<FormError>): Array<FormErrorWithId> {
  return errs.map((err) => ({
    ...err,
    id: err?.name ? inputs.value[err.name]?.id : undefined,
  }));
}

const transformedState = ref<T | null>(null);

async function getErrors(): Promise<Array<FormErrorWithId>> {
  let errs = props.validate ? (await props.validate(props.state)) ?? [] : [];

  if (props.schema) {
    const { errors, result } = await validateSchema(props.state, props.schema as FormSchema<typeof props.state>);
    if (errors) {
      errs = errs.concat(errors);
    } else {
      transformedState.value = result;
    }
  }

  return resolveErrorIds(errs);
}

async function validate_(
  opts: {
    name?: keyof T | Array<keyof T>;
    silent?: boolean;
    nested?: boolean;
    transform?: boolean;
  } = { silent: false, nested: true, transform: false },
): Promise<T | false> {
  const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name as Array<keyof T>;

  const nestedValidatePromises = !names && opts.nested
    ? Array.from(nestedForms.value.values()).map(
        ({ validate }) => validate(opts).then(() => undefined).catch((error: Error) => {
          if (!(error instanceof FormValidationException)) {
            throw error;
          }
          return error;
        }),
      )
    : [];

  if (names) {
    const otherErrors = errors.value.filter((error) => !names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern;
      return name === error.name || (pattern && error.name?.match(pattern));
    }));

    const pathErrors = (await getErrors()).filter((error) => names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern;
      return name === error.name || (pattern && error.name?.match(pattern));
    }));

    errors.value = otherErrors.concat(pathErrors);
  } else {
    errors.value = await getErrors();
  }

  const childErrors = (await Promise.all(nestedValidatePromises)).filter((val) => val !== undefined);

  if (errors.value.length + childErrors.length > 0) {
    if (opts.silent) {
      return false;
    }
    throw new FormValidationException(formId, errors.value, childErrors);
  }

  if (opts.transform) {
    Object.assign(props.state, transformedState.value);
  }

  return props.state as T;
}

const loading = ref(false);
provide(formLoadingInjectionKey, readonly(loading));

async function onSubmitWrapper(payload: Event) {
  loading.value = true;

  const event = payload as FormSubmitEvent<any>;

  try {
    event.data = await validate_({ nested: true, transform: props.transform });
    await props.onSubmit?.(event);
    dirtyFields.clear();
  } catch (error) {
    if (!(error instanceof FormValidationException)) {
      throw error;
    }

    const errorEvent: FormErrorEvent = {
      ...event,
      errors: error.errors,
      children: error.children,
    };
    emits('error', errorEvent);
  } finally {
    loading.value = false;
  }
}

const disabled = computed(() => props.disabled || loading.value);

provide(
  formOptionsInjectionKey,
  computed(() => ({
    disabled: disabled.value,
    validateOnInputDelay: props.validateOnInputDelay,
  })),
);

defineExpose<Form<T>>({
  validate: validate_,
  errors,

  setErrors(errs: Array<FormError>, name?: keyof T) {
    if (name) {
      errors.value = errors.value
        .filter((error) => error.name !== name)
        .concat(resolveErrorIds(errs));
    } else {
      errors.value = resolveErrorIds(errs);
    }
  },

  async submit() {
    await onSubmitWrapper(new Event('submit'));
  },

  getErrors(name?: keyof T) {
    if (name) {
      return errors.value.filter((err) => err.name === name);
    }
    return errors.value;
  },

  clear(name?: string) {
    if (name) {
      errors.value = errors.value.filter((err) => err.name !== name);
    } else {
      errors.value = [];
    }
  },

  disabled,
  dirty: computed(() => !!dirtyFields.size),

  dirtyFields: readonly(dirtyFields) as DeepReadonly<Set<keyof T>>,
  blurredFields: readonly(blurredFields) as DeepReadonly<Set<keyof T>>,
  touchedFields: readonly(touchedFields) as DeepReadonly<Set<keyof T>>,
});
</script>

<template>
  <component
    :is="parentBus ? 'div' : 'form'"
    :id="formId"
    :class="formFn({ class: props.class })"
    @submit.prevent="onSubmitWrapper"
  >
    <slot :errors="errors" />
  </component>
</template>
