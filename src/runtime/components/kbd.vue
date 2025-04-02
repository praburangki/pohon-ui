<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { KbdKey } from '../composables/use-kbd';
import appConfig_ from '#build/app.config';
import kbdTheme from '#build/pohon/kbd';
import { uv } from '../utils/uv';

const appConfigKbd = appConfig_ as AppConfig & {
  pohon: { kbd: Partial<typeof kbdTheme> };
};

const kbdFn = uv({
  extend: uv(kbdTheme),
  ...(appConfigKbd.pohon?.kbd || {}),
});

type KbdVariants = VariantProps<typeof kbdFn>;

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: APrimitiveProps['as'];
  value?: KbdKey | string;
  /**
   * @defaultValue 'outline'
   */
  variant?: KbdVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: KbdVariants['size'];
  class?: ClassValue;
}

export interface KbdSlots {
  default: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import type { APrimitiveProps } from '@vinicunca/akar';
import { APrimitive } from '@vinicunca/akar';
import { useKbd } from '../composables/use-kbd';

const props = withDefaults(
  defineProps<KbdProps>(),
  {
    as: 'kbd',
  },
);
defineSlots<KbdSlots>();

const { getKbdKey } = useKbd();
</script>

<template>
  <APrimitive
    :as="as"
    :class="kbdFn({ variant, size, class: props.class })"
  >
    <slot>
      {{ getKbdKey(value) }}
    </slot>
  </APrimitive>
</template>
