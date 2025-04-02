<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ARadioGroupRootEmits, ARadioGroupRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AcceptableValue } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import radioGroupTheme from '#build/pohon/radio-group';
import { uv } from '../utils/uv';

const appConfigRadioGroup = appConfig_ as AppConfig & {
  pohon: { radioGroup: Partial<typeof radioGroupTheme> };
};

const radioGroupFn = uv({
  extend: uv(radioGroupTheme),
  ...(appConfigRadioGroup.pohon?.radioGroup || {}),
});

type RadioGroupVariants = VariantProps<typeof radioGroupFn>;

export type RadioGroupValue = AcceptableValue;
export type RadioGroupItem = {
  label?: string;
  description?: string;
  disabled?: boolean;
  value?: string;
  [key: string]: any;
} | RadioGroupValue;

export interface RadioGroupProps<T extends RadioGroupItem = RadioGroupItem> extends Pick<ARadioGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  legend?: string;
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: string;
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: string;
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: string;
  items?: Array<T>;
  /**
   * @defaultValue 'md'
   */
  size?: RadioGroupVariants['size'];
  /**
   * @defaultValue 'list'
   */
  variant?: RadioGroupVariants['variant'];
  /**
   * @defaultValue 'primary'
   */
  color?: RadioGroupVariants['color'];
  /**
   * The orientation the radio buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: ARadioGroupRootProps['orientation'];
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: RadioGroupVariants['indicator'];
  class?: ClassValue;
  pohon?: Partial<typeof radioGroupFn.slots>;
}

export type RadioGroupEmits = ARadioGroupRootEmits & {
  change: [payload: Event];
};

type SlotProps<T extends RadioGroupItem> = (props: { item: T & { id: string }; modelValue?: RadioGroupValue }) => any;

export interface RadioGroupSlots<T extends RadioGroupItem = RadioGroupItem> {
  legend: (props?: {}) => any;
  label: SlotProps<T>;
  description: SlotProps<T>;
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem">
import {
  ALabel,
  ARadioGroupIndicator,
  ARadioGroupItem,
  ARadioGroupRoot,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { isNumber, isString } from '@vinicunca/perkakas';
import { reactivePick } from '@vueuse/core';
import { computed, useId } from 'vue';
import { useFormField } from '../composables/use-form-field';
import { getProp } from '../utils';

const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical',
});
const emits = defineEmits<RadioGroupEmits>();
const slots = defineSlots<RadioGroupSlots<T>>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'modelValue',
    'defaultValue',
    'orientation',
    'loop',
    'required',
  ),
  emits,
);

const {
  emitFormChange,
  emitFormInput,
  color,
  name,
  size,
  id: _id,
  disabled,
  ariaAttrs,
} = useFormField<RadioGroupProps<T>>(props, { bind: false });
const id = _id.value ?? useId();

const pohon = computed(() => radioGroupFn({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator,
}));

function normalizeItem(item: any) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: undefined,
      label: undefined,
    };
  }

  if (isString(item) || isNumber(item)) {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item),
    };
  }

  const value = getProp({ object: item, path: props.valueKey as string });
  const label = getProp({ object: item, path: props.labelKey as string });
  const description = getProp({ object: item, path: props.descriptionKey as string });

  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`,
  };
}

const normalizedItems = computed(() => {
  if (!props.items) {
    return [];
  }

  return props.items.map(normalizeItem);
});

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <ARadioGroupRoot
    :id="id"
    v-slot="{ modelValue }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    @update:model-value="onUpdate"
  >
    <fieldset
      :class="pohon.fieldset({ class: props.pohon?.fieldset })"
      v-bind="ariaAttrs"
    >
      <legend
        v-if="legend || !!slots.legend"
        :class="pohon.legend({ class: props.pohon?.legend })"
      >
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>

      <component
        :is="variant === 'list' ? 'div' : ALabel"
        v-for="item in normalizedItems"
        :key="item.value"
        :class="pohon.item({ class: props.pohon?.item })"
      >
        <div :class="pohon.container({ class: props.pohon?.container })">
          <ARadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled"
            :class="pohon.base({ class: props.pohon?.base, disabled: item.disabled })"
          >
            <ARadioGroupIndicator :class="pohon.indicator({ class: props.pohon?.indicator })" />
          </ARadioGroupItem>
        </div>

        <div :class="pohon.wrapper({ class: props.pohon?.wrapper })">
          <component
            :is="variant === 'list' ? ALabel : 'p'"
            :class="pohon.label({ class: props.pohon?.label })"
            :for="item.id"
          >
            <slot
              name="label"
              :item="item"
              :model-value="(modelValue as RadioGroupValue)"
            >
              {{ item.label }}
            </slot>
          </component>
          <p
            v-if="item.description || !!slots.description"
            :class="pohon.description({ class: props.pohon?.description })"
          >
            <slot
              name="description"
              :item="item"
              :model-value="(modelValue as RadioGroupValue)"
            >
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </ARadioGroupRoot>
</template>
