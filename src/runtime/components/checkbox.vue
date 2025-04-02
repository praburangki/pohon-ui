<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { CheckboxRootProps } from 'reka-ui';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import checkboxTheme from '#build/pohon/checkbox';
import { uv } from '../utils/uv';

const appConfigCheckbox = appConfig_ as AppConfig & {
  pohon: { checkbox: Partial<typeof checkboxTheme> };
};

const checkboxFn = uv({
  extend: uv(checkboxTheme),
  ...(appConfigCheckbox.pohon?.checkbox || {}),
});

type CheckboxVariants = VariantProps<typeof checkboxFn>;

export interface CheckboxProps extends Pick<CheckboxRootProps, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  label?: string;
  description?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: CheckboxVariants['color'];
  /**
   * @defaultValue 'md'
   */
  size?: CheckboxVariants['size'];
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.pohon.icons.check
   * @IconifyIcon
   */
  icon?: string;
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.pohon.icons.minus
   * @IconifyIcon
   */
  indeterminateIcon?: string;
  class?: ClassValue;
  pohon?: Partial<typeof checkboxFn.slots>;
}

export interface CheckboxEmits {
  change: [payload: Event];
}

export interface CheckboxSlots {
  label: (props: { label?: string }) => any;
  description: (props: { description?: string }) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  ACheckboxIndicator,
  ACheckboxRoot,
  ALabel,
  APrimitive,
  useForwardProps,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, useId } from 'vue';
import { useFormField } from '../composables/use-form-field';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<CheckboxProps>();
const emits = defineEmits<CheckboxEmits>();
const slots = defineSlots<CheckboxSlots>();
const modelValue = defineModel<boolean | 'indeterminate'>({ default: undefined });

const rootProps = useForwardProps(
  reactivePick(props, 'required', 'value', 'defaultValue'),
);

const appConfig = useAppConfig();
const {
  id: _id,
  emitFormChange,
  emitFormInput,
  size,
  color,
  name,
  disabled,
  ariaAttrs,
} = useFormField<CheckboxProps>(props);
const id = _id.value ?? useId();

const pohon = computed(() => checkboxFn({
  size: size.value,
  color: color.value,
  required: props.required,
  disabled: disabled.value,
  checked: Boolean(modelValue.value ?? props.defaultValue),
}));

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
  emitFormInput();
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div :class="pohon.container({ class: props.pohon?.container })">
      <ACheckboxRoot
        :id="id"
        v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
        v-model="modelValue"
        :name="name"
        :disabled="disabled"
        :class="pohon.base({ class: props.pohon?.base })"
        @update:model-value="onUpdate"
      >
        <template #default="{ modelValue }">
          <ACheckboxIndicator as-child>
            <PIcon
              v-if="modelValue === 'indeterminate'"
              :name="indeterminateIcon || appConfig.pohon.icons.minus"
              :class="pohon.icon({ class: props.pohon?.icon })"
            />
            <PIcon
              v-else
              :name="icon || appConfig.pohon.icons.check"
              :class="pohon.icon({ class: props.pohon?.icon })"
            />
          </ACheckboxIndicator>
        </template>
      </ACheckboxRoot>
    </div>

    <div
      v-if="(label || !!slots.label) || (description || !!slots.description)"
      :class="pohon.wrapper({ class: props.pohon?.wrapper })"
    >
      <ALabel
        v-if="label || !!slots.label"
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
      <p
        v-if="description || !!slots.description"
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
  </APrimitive>
</template>
