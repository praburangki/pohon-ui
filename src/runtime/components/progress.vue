<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, AProgressRootEmits, AProgressRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import progressTheme from '#build/pohon/progress';
import { uv } from '../utils/uv';

const appConfigProgress = appConfig_ as AppConfig & {
  pohon: { progress: Partial<typeof progressTheme> };
};

const progressFn = uv({
  extend: uv(progressTheme),
  ...(appConfigProgress.pohon?.progress || {}),
});

type ProgressVariants = VariantProps<typeof progressFn>;

export interface ProgressProps extends Pick<AProgressRootProps, 'getValueLabel' | 'modelValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /** The maximum progress value. */
  max?: number | Array<any>;
  /** Display the current progress value. */
  status?: boolean;
  /** Whether the progress is visually inverted. */
  inverted?: boolean;
  /**
   * @defaultValue 'md'
   */
  size?: ProgressVariants['size'];
  /**
   * @defaultValue 'primary'
   */
  color?: ProgressVariants['color'];
  /**
   * The orientation of the progress bar.
   * @defaultValue 'horizontal'
   */
  orientation?: ProgressVariants['orientation'];
  /**
   * The animation of the progress bar.
   * @defaultValue 'carousel'
   */
  animation?: ProgressVariants['animation'];
  class?: ClassValue;
  pohon?: Partial<typeof progressFn.slots>;
}

export interface ProgressEmits extends AProgressRootEmits {}

export type ProgressSlots = {
  status: (props: { percent?: number }) => any;
} & {
  [key: string]: (props: { step: number }) => any;
};

</script>

<script setup lang="ts">
import {
  APrimitive,
  AProgressIndicator,
  AProgressRoot,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';

const props = withDefaults(
  defineProps<ProgressProps>(),
  {
    inverted: false,
    modelValue: null,
    orientation: 'horizontal',
  },
);
const emits = defineEmits<ProgressEmits>();
const slots = defineSlots<ProgressSlots>();

const { dir } = useLocale();

const rootProps = useForwardPropsEmits(
  reactivePick(props, 'getValueLabel', 'modelValue'),
  emits,
);

const isIndeterminate = computed(() => rootProps.value.modelValue === null);
const hasSteps = computed(() => Array.isArray(props.max));

const realMax = computed(() => {
  if (isIndeterminate.value || !props.max) {
    return undefined;
  }

  if (Array.isArray(props.max)) {
    return props.max.length - 1;
  }

  return Number(props.max);
});

const percent = computed(() => {
  if (isIndeterminate.value) {
    return undefined;
  }

  switch (true) {
    case rootProps.value.modelValue! < 0: return 0;
    case rootProps.value.modelValue! > (realMax.value ?? 100): return 100;
    default: return Math.round((rootProps.value.modelValue! / (realMax.value ?? 100)) * 100);
  }
});

const indicatorStyle = computed(() => {
  if (percent.value === undefined) {
    return;
  }

  if (props.orientation === 'vertical') {
    return {
      transform: `translateY(${props.inverted ? '' : '-'}${100 - percent.value}%)`,
    };
  } else {
    if (dir.value === 'rtl') {
      return {
        transform: `translateX(${props.inverted ? '-' : ''}${100 - percent.value}%)`,
      };
    } else {
      return {
        transform: `translateX(${props.inverted ? '' : '-'}${100 - percent.value}%)`,
      };
    }
  }
});

const statusStyle = computed(() => {
  return {
    [props.orientation === 'vertical' ? 'height' : 'width']: percent.value ? `${percent.value}%` : 'fit-content',
  };
});

function isActive(index: number) {
  return index === Number(props.modelValue);
}

function isFirst(index: number) {
  return index === 0;
}

function isLast(index: number) {
  return index === realMax.value;
}

function stepVariant(index: number | string) {
  index = Number(index);

  if (isActive(index) && !isFirst(index)) {
    return 'active';
  }

  if (isFirst(index) && isActive(index)) {
    return 'first';
  }

  if (isLast(index) && isActive(index)) {
    return 'last';
  }

  return 'other';
}

const pohon = computed(() => progressFn({
  animation: props.animation,
  size: props.size,
  color: props.color,
  orientation: props.orientation,
  inverted: props.inverted,
}));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div
      v-if="!isIndeterminate && (status || !!slots.status)"
      :class="pohon.status({ class: props.pohon?.status })"
      :style="statusStyle"
    >
      <slot
        name="status"
        :percent="percent"
      >
        {{ percent }}%
      </slot>
    </div>

    <AProgressRoot
      v-bind="rootProps"
      :max="realMax"
      :class="pohon.base({ class: props.pohon?.base })"
      style="transform: translateZ(0)"
    >
      <AProgressIndicator
        :class="pohon.indicator({ class: props.pohon?.indicator })"
        :style="indicatorStyle"
      />
    </AProgressRoot>

    <div
      v-if="hasSteps"
      :class="pohon.steps({ class: props.pohon?.steps })"
    >
      <div
        v-for="(step, index) in max"
        :key="index"
        :class="pohon.step({ class: props.pohon?.step, step: stepVariant(index) })"
      >
        <slot
          :name="`step-${index}`"
          :step="step"
        >
          {{ step }}
        </slot>
      </div>
    </div>
  </APrimitive>
</template>
