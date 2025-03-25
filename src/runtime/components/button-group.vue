<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import buttonGroupTheme from '#build/pohon/button-group';
import { uv } from '../utils/uv';

const appConfigButtonGroup = appConfig_ as AppConfig & {
  pohon: { buttonGroup: Partial<typeof buttonGroupTheme> };
};

const buttonGroupFn = uv({
  extend: uv(buttonGroupTheme),
  ...(appConfigButtonGroup.pohon?.buttonGroup),
});

type ButtonGroupVariants = VariantProps<typeof buttonGroupFn>;

export interface ButtonGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any;
  /**
   * @defaultValue 'md'
   */
  size?: ButtonGroupVariants['size'];
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: ButtonGroupVariants['orientation'];
  class?: any;
}

export interface ButtonGroupSlots {
  default: (props?: object) => any;
}
</script>

<script lang="ts" setup>
import { APrimitive } from '@vinicunca/akar';
import { computed, provide } from 'vue';
import { buttonGroupInjectionKey } from '../composables/use-button-group';

const props = withDefaults(
  defineProps<ButtonGroupProps>(),
  {
    orientation: 'horizontal',
  },
);

provide(
  buttonGroupInjectionKey,
  computed(() => ({
    size: props.size,
    orientation: props.orientation,
  })),
);
</script>

<template>
  <APrimitive
    :as="as"
    :class="buttonGroupFn({ orientation, class: props.class })"
  >
    <slot />
  </APrimitive>
</template>
