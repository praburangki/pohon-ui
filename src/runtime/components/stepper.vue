<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, AStepperRootEmits, AStepperRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { DynamicSlots } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import stepperTheme from '#build/pohon/stepper';
import { uv } from '../utils/uv';

const appConfigStepper = appConfig_ as AppConfig & {
  pohon: { stepper: Partial<typeof stepperTheme> };
};

const stepperFn = uv({
  extend: uv(stepperTheme),
  ...(appConfigStepper.pohon?.stepper || {}),
});

type StepperVariants = VariantProps<typeof stepperFn>;

export interface StepperItem {
  slot?: string;
  value?: string | number;
  title?: string;
  description?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  content?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface StepperProps<T extends StepperItem = StepperItem> extends Pick<AStepperRootProps, 'linear'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  items: Array<T>;
  /**
   * @defaultValue 'md'
   */
  size?: StepperVariants['size'];
  /**
   * @defaultValue 'primary'
   */
  color?: StepperVariants['color'];
  /**
   * The orientation of the stepper.
   * @defaultValue 'horizontal'
   */
  orientation?: StepperVariants['orientation'];
  /**
   * The value of the step that should be active when initially rendered. Use when you do not need to control the state of the steps.
   */
  defaultValue?: string | number;
  disabled?: boolean;
  pohon?: Partial<typeof stepperFn.slots>;
  class?: ClassValue;
}

export type StepperEmits<T extends StepperItem = StepperItem> = Omit<AStepperRootEmits, 'update:modelValue'> & {
  next: [payload: T];
  prev: [payload: T];
};

type SlotProps<T extends StepperItem> = (props: { item: T }) => any;

export type StepperSlots<T extends StepperItem = StepperItem> = {
  indicator: SlotProps<T>;
  title: SlotProps<T>;
  description: SlotProps<T>;
  content: SlotProps<T>;
} & DynamicSlots<T>;

</script>

<script setup lang="ts" generic="T extends StepperItem">
import {
  AStepperDescription,
  AStepperIndicator,
  AStepperItem,
  AStepperRoot,
  AStepperSeparator,
  AStepperTitle,
  AStepperTrigger,
  useForwardProps,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<StepperProps<T>>(),
  {
    orientation: 'horizontal',
    linear: true,
  },
);
const emits = defineEmits<StepperEmits<T>>();
const slots = defineSlots<StepperSlots<T>>();

const modelValue = defineModel<string | number>();

const rootProps = useForwardProps(reactivePick(props, 'as', 'orientation', 'linear'));

const pohon = computed(() => stepperFn({
  orientation: props.orientation,
  size: props.size,
  color: props.color,
}));

const currentStepIndex = computed({
  get() {
    const value = modelValue.value ?? props.defaultValue;

    return ((typeof value === 'string')
      ? props.items.findIndex((item) => item.value === value)
      : value) ?? 0;
  },
  set(value: number) {
    modelValue.value = props.items?.[value]?.value ?? value;
  },
});

const currentStep = computed(() => props.items?.[currentStepIndex.value]);
const hasNext = computed(() => currentStepIndex.value < props.items?.length - 1);
const hasPrev = computed(() => currentStepIndex.value > 0);

defineExpose({
  next() {
    if (hasNext.value) {
      currentStepIndex.value += 1;
      emits('next', currentStep.value as T);
    }
  },
  prev() {
    if (hasPrev.value) {
      currentStepIndex.value -= 1;
      emits('prev', currentStep.value as T);
    }
  },
  hasNext,
  hasPrev,
});
</script>

<template>
  <AStepperRoot
    v-bind="rootProps"
    v-model="currentStepIndex"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div :class="pohon.header({ class: props.pohon?.header })">
      <AStepperItem
        v-for="(item, count) in items"
        :key="item.value ?? count"
        :step="count"
        :disabled="item.disabled || props.disabled"
        :class="pohon.item({ class: props.pohon?.item })"
      >
        <div :class="pohon.container({ class: props.pohon?.container })">
          <AStepperTrigger :class="pohon.trigger({ class: props.pohon?.trigger })">
            <AStepperIndicator :class="pohon.indicator({ class: props.pohon?.indicator })">
              <slot
                name="indicator"
                :item="item"
              >
                <PIcon
                  v-if="item.icon"
                  :name="item.icon"
                  :class="pohon.icon({ class: props.pohon?.indicator })"
                />
                <template v-else>
                  {{ count + 1 }}
                </template>
              </slot>
            </AStepperIndicator>
          </AStepperTrigger>

          <AStepperSeparator
            v-if="count < items.length - 1"
            :class="pohon.separator({ class: props.pohon?.separator })"
          />
        </div>

        <div :class="pohon.wrapper({ class: props.pohon?.wrapper })">
          <AStepperTitle :class="pohon.title({ class: props.pohon?.title })">
            <slot
              name="title"
              :item="item"
            >
              {{ item.title }}
            </slot>
          </AStepperTitle>
          <AStepperDescription :class="pohon.description({ class: props.pohon?.description })">
            <slot
              name="description"
              :item="item"
            >
              {{ item.description }}
            </slot>
          </AStepperDescription>
        </div>
      </AStepperItem>
    </div>

    <div
      v-if="currentStep?.content || !!slots.content || currentStep?.slot"
      :class="pohon.content({ class: props.pohon?.description })"
    >
      <slot
        :name="((currentStep?.slot || 'content') as keyof StepperSlots<T>)"
        :item="(currentStep as Extract<T, { slot: string }>)"
      >
        {{ currentStep?.content }}
      </slot>
    </div>
  </AStepperRoot>
</template>
