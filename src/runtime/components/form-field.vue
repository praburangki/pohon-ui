<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import formFieldTheme from '#build/pohon/form-field';
import { uv } from '../utils/uv';

const appConfigFormField = appConfig_ as AppConfig & {
  pohon: { formField: Partial<typeof formFieldTheme> };
};

const formFieldFn = uv({
  extend: uv(formFieldTheme),
  ...(appConfigFormField.pohon?.formField || {}),
});

type FormFieldVariants = VariantProps<typeof formFieldFn>;

export interface FormFieldProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /** The name of the FormField. Also used to match form errors. */
  name?: string;
  /** A regular expression to match form error names. */
  errorPattern?: RegExp;
  label?: string;
  description?: string;
  help?: string;
  error?: string | boolean;
  hint?: string;
  /**
   * @defaultValue 'md'
   */
  size?: FormFieldVariants['size'];
  required?: boolean;
  /** If true, validation on input will be active immediately instead of waiting for a blur event. */
  eagerValidation?: boolean;
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number;
  class?: ClassValue;
  pohon?: Partial<typeof formFieldFn.slots>;
}

export interface FormFieldSlots {
  label: (props: { label?: string }) => any;
  hint: (props: { hint?: string }) => any;
  description: (props: { description?: string }) => any;
  help: (props: { help?: string }) => any;
  error: (props: { error?: string | boolean }) => any;
  default: (props: { error?: string | boolean }) => any;
}
</script>

<script setup lang="ts">
import type { Ref } from 'vue';
import type { FormError, FormFieldInjectedOptions } from '../types/type.form';
import { ALabel, APrimitive } from '@vinicunca/akar';
import { isString } from '@vinicunca/perkakas';
import { computed, inject, provide, ref, useId } from 'vue';
import { formFieldInjectionKey, inputIdInjectionKey } from '../composables/use-form-field';

const props = defineProps<FormFieldProps>();
const slots = defineSlots<FormFieldSlots>();

const pohon = computed(() => formFieldFn({
  size: props.size,
  required: props.required,
}));

const formErrors = inject<Ref<Array<FormError>> | null>('form-errors', null);

const error = computed(() =>
  props.error || formErrors?.value?.find(
    (error) => error.name
      && (
        error.name === props.name
        || (props.errorPattern && error.name.match(props.errorPattern))
      ),
  )?.message,
);

const id = ref(useId());
// Copies id's initial value to bind aria-attributes such as aria-describedby.
// This is required for the RadioGroup component which unsets the id value.
const ariaId = id.value;

provide(inputIdInjectionKey, id);

provide(formFieldInjectionKey, computed(() => ({
  error: error.value,
  name: props.name,
  size: props.size,
  eagerValidation: props.eagerValidation,
  validateOnInputDelay: props.validateOnInputDelay,
  errorPattern: props.errorPattern,
  hint: props.hint,
  description: props.description,
  help: props.help,
  ariaId,
}) as FormFieldInjectedOptions<FormFieldProps>));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div :class="pohon.wrapper({ class: props.pohon?.wrapper })">
      <div
        v-if="label || !!slots.label"
        :class="pohon.labelWrapper({ class: props.pohon?.labelWrapper })"
      >
        <ALabel
          :for="id"
          :class="pohon.label({ class: props.pohon?.label })"
        >
          <slot
            name="label"
            :label="label"
          >
            {{ label }}
          </slot>
        </ALabel>
        <span
          v-if="hint || !!slots.hint"
          :id="`${ariaId}-hint`"
          :class="pohon.hint({ class: props.pohon?.hint })"
        >
          <slot
            name="hint"
            :hint="hint"
          >
            {{ hint }}
          </slot>
        </span>
      </div>

      <p
        v-if="description || !!slots.description"
        :id="`${ariaId}-description`"
        :class="pohon.description({ class: props.pohon?.description })"
      >
        <slot
          name="description"
          :description="description"
        >
          {{ description }}
        </slot>
      </p>
    </div>

    <div :class="[(label || !!slots.label || description || !!slots.description) && pohon.container({ class: props.pohon?.container })]">
      <slot :error="error" />

      <p
        v-if="(isString(error) && error) || !!slots.error"
        :id="`${ariaId}-error`"
        :class="pohon.error({ class: props.pohon?.error })"
      >
        <slot
          name="error"
          :error="error"
        >
          {{ error }}
        </slot>
      </p>
      <p
        v-else-if="help || !!slots.help"
        :class="pohon.help({ class: props.pohon?.help })"
      >
        <slot
          name="help"
          :help="help"
        >
          {{ help }}
        </slot>
      </p>
    </div>
  </APrimitive>
</template>
