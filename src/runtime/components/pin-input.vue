<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APinInputRootEmits, APinInputRootProps, APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import pinInputTheme from '#build/pohon/pin-input';
import { uv } from '../utils/uv';

const appConfigPinInput = appConfig_ as AppConfig & {
  pohon: { pinInput: Partial<typeof pinInputTheme> };
};

const pinInputFn = uv({
  extend: uv(pinInputTheme),
  ...(appConfigPinInput.pohon?.pinInput || {}),
});

type PinInputVariants = VariantProps<typeof pinInputFn>;

export interface PinInputProps extends Pick<APinInputRootProps, 'defaultValue' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * @defaultValue 'primary'
   */
  color?: PinInputVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: PinInputVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: PinInputVariants['size'];
  /**
   * The number of input fields.
   * @defaultValue 5
   */
  length?: number | string;
  autofocus?: boolean;
  autofocusDelay?: number;
  highlight?: boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof pinInputFn.slots>;
}

export type PinInputEmits = APinInputRootEmits & {
  change: [payload: Event];
  blur: [payload: Event];
};

</script>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { APinInputInput, APinInputRoot, useForwardPropsEmits } from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useFormField } from '../composables/use-form-field';
import { looseToNumber } from '../utils';

const props = withDefaults(
  defineProps<PinInputProps>(),
  {
    type: 'text',
    length: 5,
    autofocusDelay: 0,
  },
);
const emits = defineEmits<PinInputEmits>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'defaultValue',
    'disabled',
    'id',
    'mask',
    'modelValue',
    'name',
    'otp',
    'placeholder',
    'required',
    'type',
  ),
  emits,
);
const {
  emitFormInput,
  emitFormFocus,
  emitFormChange,
  emitFormBlur,
  size,
  color,
  id,
  name,
  highlight,
  disabled,
  ariaAttrs,
} = useFormField<PinInputProps>(props);

const pohon = computed(() => pinInputFn({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value,
}));

const inputsRef = ref<Array<ComponentPublicInstance>>([]);

const completed = ref(false);
function onComplete(value: Array<string>) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
}

function onBlur(event: FocusEvent) {
  if (!event.relatedTarget || completed.value) {
    emits('blur', event);
    emitFormBlur();
  }
}

function autoFocus() {
  if (props.autofocus) {
    inputsRef.value[0]?.$el?.focus();
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});

defineExpose({
  inputsRef,
});
</script>

<template>
  <APinInputRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    :name="name"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    @update:model-value="emitFormInput()"
    @complete="onComplete"
  >
    <APinInputInput
      v-for="(ids, index) in looseToNumber(props.length)"
      :key="ids"
      :ref="el => (inputsRef[index] = el as ComponentPublicInstance)"
      :index="index"
      :class="pohon.base({ class: props.pohon?.base })"
      :disabled="disabled"
      @blur="onBlur"
      @focus="emitFormFocus"
    />
  </APinInputRoot>
</template>
