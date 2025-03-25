<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import cardTheme from '#build/pohon/card';
import { uv } from '../utils/uv';

const appConfigCard = appConfig_ as AppConfig & {
  pohon: { card: Partial<typeof cardTheme> };
};

const cardFn = uv({
  extend: uv(cardTheme),
  ...(appConfigCard.pohon?.card || {}),
});

type CardVariants = VariantProps<typeof cardFn>;

export interface CardProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * @defaultValue 'outline'
   */
  variant?: CardVariants['variant'];
  class?: ClassValue;
  pohon?: Partial<typeof cardFn.slots>;
}

export interface CardSlots {
  header: (props?: object) => any;
  default: (props?: object) => any;
  footer: (props?: object) => any;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';
import { computed } from 'vue';

const props = defineProps<CardProps>();
const slots = defineSlots<CardSlots>();

const pohon = computed(() => cardFn({ variant: props.variant }));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <div
      v-if="!!slots.header"
      :class="pohon.header({ class: props.pohon?.header })"
    >
      <slot name="header" />
    </div>

    <div
      v-if="!!slots.default"
      :class="pohon.body({ class: props.pohon?.body })"
    >
      <slot />
    </div>

    <div
      v-if="!!slots.footer"
      :class="pohon.footer({ class: props.pohon?.footer })"
    >
      <slot name="footer" />
    </div>
  </APrimitive>
</template>
