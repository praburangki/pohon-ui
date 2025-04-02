<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ASwitchRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import switchTheme from '#build/pohon/switch';
import { uv } from '../utils/uv';

const appConfigSwitch = appConfig_ as AppConfig & {
  pohon: { switch: Partial<typeof switchTheme> };
};

const switchFn = uv({
  extend: uv(switchTheme),
  ...(appConfigSwitch.pohon?.switch || {}),
});

type SwitchVariants = VariantProps<typeof switchFn>;

export interface SwitchProps extends Pick<ASwitchRootProps, 'disabled' | 'id' | 'name' | 'required' | 'value' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * @defaultValue 'primary'
   */
  color?: SwitchVariants['color'];
  /**
   * @defaultValue 'md'
   */
  size?: SwitchVariants['size'];
  /** When `true`, the loading icon will be displayed. */
  loading?: boolean;
  /**
   * The icon when the `loading` prop is `true`.
   * @defaultValue appConfig.pohon.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: string;
  /**
   * Display an icon when the switch is checked.
   * @IconifyIcon
   */
  checkedIcon?: string;
  /**
   * Display an icon when the switch is unchecked.
   * @IconifyIcon
   */
  uncheckedIcon?: string;
  label?: string;
  description?: string;
  class?: ClassValue;
  pohon?: PartialString<typeof switchFn.slots>;
}

export interface SwitchEmits {
  change: [payload: Event];
}

export interface SwitchSlots {
  label: (props: { label?: string }) => any;
  description: (props: { description?: string }) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  ALabel,
  APrimitive,
  ASwitchRoot,
  ASwitchThumb,
  useForwardProps,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, useId } from 'vue';
import { useFormField } from '../composables/use-form-field';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<SwitchProps>();
const emits = defineEmits<SwitchEmits>();
const slots = defineSlots<SwitchSlots>();
const modelValue = defineModel<boolean>({ default: undefined });

const appConfig = useAppConfig();
const rootProps = useForwardProps(
  reactivePick(props, 'required', 'value', 'defaultValue'),
);

const {
  id: _id,
  emitFormChange,
  emitFormInput,
  size,
  color,
  name,
  disabled,
  ariaAttrs,
} = useFormField<SwitchProps>(props);
const id = _id.value ?? useId();

const pohon = computed(() => switchFn({
  size: size.value,
  color: color.value,
  required: props.required,
  loading: props.loading,
  disabled: disabled.value || props.loading,
}));

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
  emitFormInput();
}
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div :class="pohon.container({ class: props.pohon?.container })">
      <ASwitchRoot
        :id="id"
        v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
        v-model="modelValue"
        :name="name"
        :disabled="disabled || loading"
        :class="pohon.base({ class: props.pohon?.base })"
        @update:model-value="onUpdate"
      >
        <ASwitchThumb :class="pohon.thumb({ class: props.pohon?.thumb })">
          <PIcon
            v-if="loading"
            :name="loadingIcon || appConfig.pohon.icons.loading"
            :class="pohon.icon({ class: props.pohon?.icon, checked: true, unchecked: true })"
          />
          <template v-else>
            <PIcon
              v-if="checkedIcon"
              :name="checkedIcon"
              :class="pohon.icon({ class: props.pohon?.icon, checked: true })"
            />
            <PIcon
              v-if="uncheckedIcon"
              :name="uncheckedIcon"
              :class="pohon.icon({ class: props.pohon?.icon, unchecked: true })"
            />
          </template>
        </ASwitchThumb>
      </ASwitchRoot>
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
