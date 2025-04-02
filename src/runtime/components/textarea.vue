<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import textareaTheme from '#build/pohon/textarea';
import { uv } from '../utils/uv';

const appConfigTextarea = appConfig_ as AppConfig & {
  pohon: { textarea: Partial<typeof textareaTheme> };
};

const textareaFn = uv({
  extend: uv(textareaTheme),
  ...(appConfigTextarea.pohon?.textarea || {}),
});

type TextareaVariants = VariantProps<typeof textareaFn>;

export interface TextareaProps extends UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  id?: string;
  name?: string;
  /** The placeholder text when the textarea is empty. */
  placeholder?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: TextareaVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: TextareaVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: TextareaVariants['size'];
  required?: boolean;
  autofocus?: boolean;
  autofocusDelay?: number;
  autoresize?: boolean;
  autoresizeDelay?: number;
  disabled?: boolean;
  class?: ClassValue;
  rows?: number;
  maxrows?: number;
  /** Highlight the ring color like a focus state. */
  highlight?: boolean;
  pohon?: PartialString<typeof textareaFn.slots>;
}

export interface TextareaEmits {
  (event: 'update:modelValue', payload: string | number): void;
  (event: 'blur', payload: FocusEvent): void;
  (event: 'change', payload: Event): void;
}

export interface TextareaSlots {
  leading: (props?: {}) => any;
  default: (props?: {}) => any;
  trailing: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useComponentIcons } from '../composables/use-component-icons';
import { useFormField } from '../composables/use-form-field';
import { looseToNumber } from '../utils';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<TextareaProps>(),
  {
    rows: 3,
    maxrows: 0,
    autofocusDelay: 0,
    autoresizeDelay: 0,
  },
);
const emits = defineEmits<TextareaEmits>();
const slots = defineSlots<TextareaSlots>();
const [modelValue, modelModifiers] = defineModel<string | number | null>();

const {
  emitFormFocus,
  emitFormBlur,
  emitFormInput,
  emitFormChange,
  size,
  color,
  id,
  name,
  highlight,
  disabled,
  ariaAttrs,
} = useFormField<TextareaProps>(props, { deferInputValidation: true });
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props);

const pohon = computed(() => textareaFn({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  loading: props.loading,
  highlight: highlight.value,
  autoresize: props.autoresize,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
}));

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Custom function to handle the v-model properties
function updateInput(value: string | null) {
  if (modelModifiers.trim) {
    value = value?.trim() ?? null;
  }

  if (modelModifiers.number) {
    value = looseToNumber(value);
  }

  if (modelModifiers.nullify) {
    value ||= null;
  }

  modelValue.value = value;
  emitFormInput();
}

function onInput(event: Event) {
  autoResize();

  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value);
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value;

  if (modelModifiers.lazy) {
    updateInput(value);
  }

  // Update trimmed textarea so that it has same behavior as native textarea https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
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
    textareaRef.value?.focus();
  }
}

function autoResize() {
  if (props.autoresize && textareaRef.value) {
    textareaRef.value.rows = props.rows;
    const overflow = textareaRef.value.style.overflow;
    textareaRef.value.style.overflow = 'hidden';

    const styles = window.getComputedStyle(textareaRef.value);
    const paddingTop = Number.parseInt(styles.paddingTop);
    const paddingBottom = Number.parseInt(styles.paddingBottom);
    const padding = paddingTop + paddingBottom;
    const lineHeight = Number.parseInt(styles.lineHeight);
    const { scrollHeight } = textareaRef.value;
    const newRows = (scrollHeight - padding) / lineHeight;

    if (newRows > props.rows) {
      textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows;
    }

    textareaRef.value.style.overflow = overflow;
  }
}

watch(modelValue, () => {
  nextTick(autoResize);
});

onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);

  setTimeout(() => {
    autoResize();
  }, props.autoresizeDelay);
});

defineExpose({
  textareaRef,
});
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :class="pohon.base({ class: props.pohon?.base })"
      :disabled="disabled"
      :required="required"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    />

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
