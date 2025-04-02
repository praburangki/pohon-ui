<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ANumberFieldInput,
  ANumberFieldRootProps,
  APrimitiveProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { ButtonProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import inputNumberTheme from '#build/pohon/input-number';
import { uv } from '../utils/uv';

const appConfigInputNumber = appConfig_ as AppConfig & {
  pohon: { inputNumber: Partial<typeof inputNumberTheme> };
};

const inputNumberFn = uv({
  extend: uv(inputNumberTheme),
  ...(appConfigInputNumber.pohon?.inputNumber || {}),
});

type InputNumberVariants = VariantProps<typeof inputNumberFn>;

export interface InputNumberProps extends Pick<ANumberFieldRootProps, 'modelValue' | 'defaultValue' | 'min' | 'max' | 'step' | 'stepSnapping' | 'disabled' | 'required' | 'id' | 'name' | 'formatOptions' | 'disableWheelChange'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /** The placeholder text when the input is empty. */
  placeholder?: string;
  color?: InputNumberVariants['color'];
  variant?: InputNumberVariants['variant'];
  size?: InputNumberVariants['size'];
  /** Highlight the ring color like a focus state. */
  highlight?: boolean;
  /**
   * The orientation of the input menu.
   * @defaultValue 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal';
  /**
   * Configure the increment button. The `color` and `size` are inherited.
   * @defaultValue { variant: 'link' }
   */
  increment?: ButtonProps;
  /**
   * The icon displayed to increment the value.
   * @defaultValue appConfig.pohon.icons.plus
   * @IconifyIcon
   */
  incrementIcon?: string;
  /**
   * Configure the decrement button. The `color` and `size` are inherited.
   * @defaultValue { variant: 'link' }
   */
  decrement?: ButtonProps;
  /**
   * The icon displayed to decrement the value.
   * @defaultValue appConfig.pohon.icons.minus
   * @IconifyIcon
   */
  decrementIcon?: string;
  autofocus?: boolean;
  autofocusDelay?: number;
  /**
   * The locale to use for formatting and parsing numbers.
   * @defaultValue UApp.locale.code
   */
  locale?: string;
  class?: ClassValue;
  pohon?: PartialString<typeof inputNumberFn.slots>;
}

export interface InputNumberEmits {
  (event: 'update:modelValue', payload: number): void;
  (event: 'blur', payload: FocusEvent): void;
  (event: 'change', payload: Event): void;
}

export interface InputNumberSlots {
  increment: (props?: {}) => any;
  decrement: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  ANumberFieldDecrement,
  ANumberFieldIncrement,
  ANumberFieldRoot,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useFormField } from '../composables/use-form-field';
import { useLocale } from '../composables/use-locale';
import PButton from './button.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<InputNumberProps>(),
  {
    orientation: 'horizontal',
  },
);
const emits = defineEmits<InputNumberEmits>();
defineSlots<InputNumberSlots>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'modelValue',
    'defaultValue',
    'min',
    'max',
    'step',
    'stepSnapping',
    'formatOptions',
    'disableWheelChange',
  ),
  emits,
);

const appConfig = useAppConfig();
const {
  emitFormBlur,
  emitFormFocus,
  emitFormChange,
  emitFormInput,
  id,
  color,
  size,
  name,
  highlight,
  disabled,
  ariaAttrs,
} = useFormField<InputNumberProps>(props);

const { t, code: codeLocale } = useLocale();
const locale = computed(() => props.locale || codeLocale.value);

const pohon = computed(() => inputNumberFn({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value,
  orientation: props.orientation,
}));

const incrementIcon = computed(() =>
  props.incrementIcon
  || (props.orientation === 'horizontal'
    ? appConfig.pohon.icons.plus
    : appConfig.pohon.icons.chevronUp),
);
const decrementIcon = computed(() =>
  props.decrementIcon
  || (props.orientation === 'horizontal'
    ? appConfig.pohon.icons.minus
    : appConfig.pohon.icons.chevronDown),
);

const inputRef = ref<InstanceType<typeof ANumberFieldInput> | null>(null);

function onUpdate(value: number) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);

  emitFormChange();
  emitFormInput();
}

function onBlur(event: FocusEvent) {
  emitFormBlur();
  emits('blur', event);
}

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus();
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});

defineExpose({
  inputRef,
});
</script>

<template>
  <ANumberFieldRoot
    v-bind="rootProps"
    :id="id"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :name="name"
    :disabled="disabled"
    :locale="locale"
    @update:model-value="onUpdate"
  >
    <ANumberFieldInput
      v-bind="{ ...$attrs, ...ariaAttrs }"
      ref="inputRef"
      :placeholder="placeholder"
      :required="required"
      :class="pohon.base({ class: props.pohon?.base })"
      @blur="onBlur"
      @focus="emitFormFocus"
    />

    <div :class="pohon.increment({ class: props.pohon?.increment })">
      <ANumberFieldIncrement
        as-child
        :disabled="disabled"
      >
        <slot name="increment">
          <PButton
            :icon="incrementIcon"
            :color="color"
            :size="size"
            variant="link"
            :aria-label="t('inputNumber.increment')"
            v-bind="typeof increment === 'object' ? increment : undefined"
          />
        </slot>
      </ANumberFieldIncrement>
    </div>

    <div :class="pohon.decrement({ class: props.pohon?.decrement })">
      <ANumberFieldDecrement
        as-child
        :disabled="disabled"
      >
        <slot name="decrement">
          <PButton
            :icon="decrementIcon"
            :color="color"
            :size="size"
            variant="link"
            :aria-label="t('inputNumber.decrement')"
            v-bind="typeof decrement === 'object' ? decrement : undefined"
          />
        </slot>
      </ANumberFieldDecrement>
    </div>
  </ANumberFieldRoot>
</template>
