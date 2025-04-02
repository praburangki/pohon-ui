<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ASliderRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import sliderTheme from '#build/pohon/slider';
import { uv } from '../utils/uv';

const appConfigSlider = appConfig_ as AppConfig & {
  pohon: { slider: Partial<typeof sliderTheme> };
};

const sliderFn = uv({
  extend: uv(sliderTheme),
  ...(appConfigSlider.pohon?.slider || {}),
});

type SliderVariants = VariantProps<typeof sliderFn>;

export interface SliderProps extends Pick<ASliderRootProps, 'name' | 'disabled' | 'inverted' | 'min' | 'max' | 'step' | 'minStepsBetweenThumbs'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * @defaultValue 'md'
   */
  size?: SliderVariants['size'];
  /**
   * @defaultValue 'primary'
   */
  color?: SliderVariants['color'];
  /**
   * The orientation of the slider.
   * @defaultValue 'horizontal'
   */
  orientation?: ASliderRootProps['orientation'];
  /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
  defaultValue?: number | Array<number>;
  class?: ClassValue;
  pohon?: Partial<typeof sliderFn.slots>;
}

export interface SliderEmits {
  (event: 'update:modelValue', payload: number | Array<number>): void;
  (event: 'change', payload: Event): void;
}
</script>

<script setup lang="ts">
import {
  ASliderRange,
  ASliderRoot,
  ASliderThumb,
  ASliderTrack,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { isNumber } from '@vinicunca/perkakas';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { useFormField } from '../composables/use-form-field';

const props = withDefaults(
  defineProps<SliderProps>(),
  {
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
  },
);
const emits = defineEmits<SliderEmits>();

const modelValue = defineModel<number | Array<number>>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'orientation',
    'min',
    'max',
    'step',
    'minStepsBetweenThumbs',
    'inverted',
  ),
  emits,
);

const {
  id,
  emitFormChange,
  emitFormInput,
  size,
  color,
  name,
  disabled,
  ariaAttrs,
} = useFormField<SliderProps>(props);

const defaultSliderValue = computed(() => {
  if (isNumber(props.defaultValue)) {
    return [props.defaultValue];
  }

  return props.defaultValue;
});

const sliderValue = computed({
  get() {
    if (isNumber(modelValue.value)) {
      return [modelValue.value];
    }

    return modelValue.value ?? defaultSliderValue.value;
  },
  set(value) {
    modelValue.value = value?.length !== 1 ? value : value[0];
  },
});

const thumbsCount = computed(() => sliderValue.value?.length ?? 1);

const pohon = computed(() => sliderFn({
  disabled: disabled.value,
  size: size.value,
  color: color.value,
  orientation: props.orientation,
}));

function onChange(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
}
</script>

<template>
  <ASliderRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-model="sliderValue"
    :name="name"
    :disabled="disabled"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :default-value="defaultSliderValue"
    @update:model-value="emitFormInput()"
    @value-commit="onChange"
  >
    <ASliderTrack :class="pohon.track({ class: props.pohon?.track })">
      <ASliderRange :class="pohon.range({ class: props.pohon?.range })" />
    </ASliderTrack>

    <ASliderThumb
      v-for="count in thumbsCount"
      :key="count"
      :class="pohon.thumb({ class: props.pohon?.thumb })"
    />
  </ASliderRoot>
</template>
