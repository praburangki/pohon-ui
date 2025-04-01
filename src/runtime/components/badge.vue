<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import appConfig_ from '#build/app.config';
import badgeTheme from '#build/pohon/badge';
import { uv } from '../utils/uv';

const appConfigBadge = appConfig_ as AppConfig & {
  pohon: { badge: Partial<typeof badgeTheme> };
};

const badgeFn = uv({
  extend: uv(badgeTheme),
  ...(appConfigBadge.pohon?.badge || {}),
});

type BadgeVariants = VariantProps<typeof badgeFn>;

export interface BadgeProps extends Omit<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: APrimitiveProps['as'];
  label?: string | number;
  /**
   * @defaultValue 'primary'
   */
  color?: BadgeVariants['color'];
  /**
   * @defaultValue 'solid'
   */
  variant?: BadgeVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: BadgeVariants['size'];
  class?: ClassValue;
  pohon?: Partial<typeof badgeFn.slots>;
}

export interface BadgeSlots {
  default: (props?: object) => any;
  leading?: (props?: object) => any;
  trailing?: (props?: object) => any;
}
</script>

<script lang="ts" setup>
import type { AvatarProps } from '../types';
import { APrimitive } from '@vinicunca/akar';
import { computed } from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<BadgeProps>(),
  { as: 'span' },
);

defineSlots<BadgeSlots>();

const { orientation, size: buttonGroupSize } = useButtonGroup<BadgeProps>(props);
const {
  isLeading,
  isTrailing,
  leadingIconName,
  trailingIconName,
} = useComponentIcons(props);

const pohon = computed(() => badgeFn({
  color: props.color,
  variant: props.variant,
  size: buttonGroupSize.value || props.size,
  buttonGroup: orientation.value,
}));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.base({ class: [props.class, props.pohon?.base] })"
  >
    <slot name="leading">
      <PIcon
        v-if="isLeading && leadingIconName"
        :name="leadingIconName"
        :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon })"
      />

      <PAvatar
        v-else-if="!!avatar"
        v-bind="avatar"
        :class="pohon.leadingAvatar({ class: props.pohon?.leadingAvatar })"
        :size="(props.pohon?.leadingAvatarSize || pohon.leadingAvatarSize()) as AvatarProps['size']"
      />
    </slot>

    <slot>
      <span
        v-if="label"
        :class="pohon.label({ class: props.pohon?.label })"
      >
        {{ label }}
      </span>
    </slot>

    <slot name="trailing">
      <PIcon
        v-if="isTrailing && trailingIconName"
        :name="trailingIconName"
        :class="pohon.trailingIcon({ class: props.pohon?.trailingIcon })"
      />
    </slot>
  </APrimitive>
</template>
