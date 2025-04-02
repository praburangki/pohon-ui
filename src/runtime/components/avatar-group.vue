<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import avatarGroupTheme from '#build/pohon/avatar-group';
import { uv } from '../utils/uv';

const appConfigAvatarGroup = appConfig_ as AppConfig & {
  pohon: { avatarGroup: Partial<typeof avatarGroupTheme> };
};

const avatarGroupFn = uv({
  extend: uv(avatarGroupTheme),
  ...(appConfigAvatarGroup.pohon?.avatarGroup || {}),
});

type AvatarGroupVariants = VariantProps<typeof avatarGroupFn>;

export interface AvatarGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  size?: AvatarGroupVariants['size'];
  /**
   * The maximum number of avatars to display.
   */
  max?: number | string;
  class?: ClassValue;
  pohon?: Partial<typeof avatarGroupFn.slots>;
}

export interface AvatarGroupSlots {
  default: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';
import { isString } from '@vinicunca/perkakas';
import { computed, provide } from 'vue';
import { avatarGroupInjectionKey } from '../composables/use-avatar-group';
import PAvatar from './avatar.vue';

const props = defineProps<AvatarGroupProps>();
const slots = defineSlots<AvatarGroupSlots>();

const pohon = computed(() => avatarGroupFn({
  size: props.size,
}));

const max = computed(() => isString(props.max) ? Number.parseInt(props.max, 10) : props.max);

const children = computed(() => {
  let children = slots.default?.();
  if (children?.length) {
    children = children.flatMap((child: any) => {
      if (typeof child.type === 'symbol') {
        // `v-if="false"` or commented node
        if (isString(child.children)) {
          return undefined;
        }

        return child.children;
      }

      return child;
    }).filter(Boolean);
  }

  return children || [];
});

const visibleAvatars = computed(() => {
  if (!children.value.length) {
    return [];
  }

  if (!max.value || max.value <= 0) {
    return [...children.value].reverse();
  }

  return [...children.value].slice(0, max.value).reverse();
});

const hiddenCount = computed(() => {
  if (!children.value.length) {
    return 0;
  }

  return children.value.length - visibleAvatars.value.length;
});

provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size,
})));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <PAvatar
      v-if="hiddenCount > 0"
      :text="`+${hiddenCount}`"
      :class="pohon.base({ class: props.pohon?.base })"
    />

    <component
      :is="avatar"
      v-for="(avatar, count) in visibleAvatars"
      :key="count"
      :class="pohon.base({ class: props.pohon?.base })"
    />
  </APrimitive>
</template>
