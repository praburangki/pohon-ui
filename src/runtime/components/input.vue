<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { InputHTMLAttributes } from 'vue';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import inputTheme from '#build/pohon/input';
import { uv } from '../utils/uv';

const appConfigInput = appConfig_ as AppConfig & {
  pohon: { input: Partial<typeof inputTheme> };
};

const inputFn = uv({
  extend: uv(inputTheme),
  ...(appConfigInput.pohon?.input || {}),
});

type InputVariants = VariantProps<typeof inputFn>;

export interface InputProps extends UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  id?: string;
  name?: string;
  type?: InputHTMLAttributes['type'];
  /** The placeholder text when the input is empty. */
  placeholder?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: InputVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: InputVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: InputVariants['size'];
  required?: boolean;
  autocomplete?: InputHTMLAttributes['autocomplete'];
  autofocus?: boolean;
  autofocusDelay?: number;
  disabled?: boolean;
  /** Highlight the ring color like a focus state. */
  highlight?: boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof inputFn.slots>;
}

export interface InputEmits {
  (event: 'update:modelValue', payload: string | number): void;
  (event: 'blur', payload: FocusEvent): void;
  (event: 'change', payload: Event): void;
}

export interface InputSlots {
  leading: (props?: {}) => any;
  default: (props?: {}) => any;
  trailing: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';
import { isNumber } from '@vinicunca/perkakas';
import { computed, onMounted, ref } from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import { useFormField } from '../composables/use-form-field';
import { looseToNumber } from '../utils';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<InputProps>(),
  {
    type: 'text',
    autocomplete: 'off',
    autofocusDelay: 0,
  },
);
const emits = defineEmits<InputEmits>();
const slots = defineSlots<InputSlots>();

const [modelValue, modelModifiers] = defineModel<string | number | null>();

const {
  emitFormBlur,
  emitFormInput,
  emitFormChange,
  size: formGroupSize,
  color,
  id,
  name,
  highlight,
  disabled,
  emitFormFocus,
  ariaAttrs,
} = useFormField<InputProps>(props, { deferInputValidation: true });
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props);
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value);

const pohon = computed(() => inputFn({
  type: props.type as InputVariants['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value,
}));

const inputRef = ref<HTMLInputElement | null>(null);

// Custom function to handle the v-model properties
function updateInput(value: string | null) {
  if (modelModifiers.trim) {
    value = value?.trim() ?? null;
  }

  if (modelModifiers.number || isNumber(props.type)) {
    value = looseToNumber(value);
  }

  if (modelModifiers.nullify) {
    value ||= null;
  }

  modelValue.value = value;
  emitFormInput();
}

function onInput(event: Event) {
  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value);
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  if (modelModifiers.lazy) {
    updateInput(value);
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.trim) {
    (event.target as HTMLInputElement).value = value.trim();
  }

  emitFormChange();
  emits('change', event);
}

function onBlur(event: FocusEvent) {
  emitFormBlur();
  emits('blur', event);
}

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.focus();
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
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <input
      :id="id"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="pohon.base({ class: props.pohon?.base })"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    >

    <slot />

    <span
      v-if="isLeading || !!avatar || !!slots.leading"
      :class="pohon.leading({ class: props.pohon?.leading })"
    >
      <slot name="leading">
        <PIcon
          v-if="isLeading && leadingIconName"
          :name="leadingIconName"
          :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon })"
        />
        <PAvatar
          v-else-if="!!avatar"
          :size="((props.pohon?.leadingAvatarSize || pohon.leadingAvatarSize()) as AvatarProps['size'])"
          v-bind="avatar"
          :class="pohon.leadingAvatar({ class: props.pohon?.leadingAvatar })"
        />
      </slot>
    </span>

    <span
      v-if="isTrailing || !!slots.trailing"
      :class="pohon.trailing({ class: props.pohon?.trailing })"
    >
      <slot name="trailing">
        <PIcon
          v-if="trailingIconName"
          :name="trailingIconName"
          :class="pohon.trailingIcon({ class: props.pohon?.trailingIcon })"
        />
      </slot>
    </span>
  </APrimitive>
</template>
