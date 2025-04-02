<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import skeletonTheme from '#build/pohon/skeleton';
import { uv } from '../utils/uv';

const appConfigSkeleton = appConfig_ as AppConfig & {
  pohon: { skeleton: Partial<typeof skeletonTheme> };
};

const skeletonFn = uv({
  extend: uv(skeletonTheme),
  ...(appConfigSkeleton.pohon?.skeleton || {}),
});

export interface SkeletonProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  class?: ClassValue;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';

const props = defineProps<SkeletonProps>();
</script>

<template>
  <APrimitive
    :as="as"
    :class="skeletonFn({ class: props.class })"
  >
    <slot />
  </APrimitive>
</template>
