<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ASeparatorProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AvatarProps } from '../types';
import appConfig_ from '#build/app.config';
import separatorTheme from '#build/pohon/separator';
import { uv } from '../utils/uv';

const appConfigSeparator = appConfig_ as AppConfig & {
  pohon: { separator: Partial<typeof separatorTheme> };
};

const separatorFn = uv({
  extend: uv(separatorTheme),
  ...(appConfigSeparator.pohon?.separator || {}),
});

type SeparatorVariants = VariantProps<typeof separatorFn>;

export interface SeparatorProps extends Pick<ASeparatorProps, 'decorative'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /** Display a label in the middle. */
  label?: string;
  /**
   * Display an icon in the middle.
   * @IconifyIcon
   */
  icon?: string;
  /** Display an avatar in the middle. */
  avatar?: AvatarProps;
  /**
   * @defaultValue 'neutral'
   */
  color?: SeparatorVariants['color'];
  /**
   * @defaultValue 'xs'
   */
  size?: SeparatorVariants['size'];
  /**
   * @defaultValue 'solid'
   */
  type?: SeparatorVariants['type'];
  /**
   * The orientation of the separator.
   * @defaultValue 'horizontal'
   */
  orientation?: ASeparatorProps['orientation'];
  class?: ClassValue;
  pohon?: Partial<typeof separatorFn.slots>;
}

export interface SeparatorSlots {
  default: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { ASeparator, useForwardProps } from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
});
const slots = defineSlots<SeparatorSlots>();

const rootProps = useForwardProps(reactivePick(props, 'as', 'decorative', 'orientation'));

const pohon = computed(() => separatorFn({
  color: props.color,
  orientation: props.orientation,
  size: props.size,
  type: props.type,
}));
</script>

<template>
  <ASeparator
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div :class="pohon.border({ class: props.pohon?.border })" />

    <template v-if="label || icon || avatar || !!slots.default">
      <div :class="pohon.container({ class: props.pohon?.container })">
        <slot>
          <span
            v-if="label"
            :class="pohon.label({ class: props.pohon?.label })"
          >{{ label }}</span>
          <PIcon
            v-else-if="icon"
            :name="icon"
            :class="pohon.icon({ class: props.pohon?.icon })"
          />
          <PAvatar
            v-else-if="avatar"
            :size="((props.pohon?.avatarSize || pohon.avatarSize()) as AvatarProps['size'])"
            v-bind="avatar"
            :class="pohon.avatar({ class: props.pohon?.avatar })"
          />
        </slot>
      </div>

      <div :class="pohon.border({ class: props.pohon?.border })" />
    </template>
  </ASeparator>
</template>
