<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import chipTheme from '#build/pohon/chip';
import { uv } from '../utils/uv';

const appConfigChip = appConfig_ as AppConfig & {
  pohon: { chip: Partial<typeof chipTheme> };
};

const chipFn = uv({
  extend: uv(chipTheme),
  ...(appConfigChip.pohon?.chip || {}),
});

type ChipVariants = VariantProps<typeof chipFn>;

export interface ChipProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /** Display some text inside the chip. */
  text?: string | number;
  /**
   * @defaultValue 'primary'
   */
  color?: ChipVariants['color'];
  /**
   * @defaultValue 'md'
   */
  size?: ChipVariants['size'];
  /**
   * The position of the chip.
   * @defaultValue 'top-right'
   */
  position?: ChipVariants['position'];
  /** When `true`, keep the chip inside the component for rounded elements. */
  inset?: boolean;
  /** When `true`, render the chip relatively to the parent. */
  standalone?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof chipFn.slots>;
}

export interface ChipEmits {
  (e: 'update:show', payload: boolean): void;
}

export interface ChipSlots {
  default: (props?: {}) => any;
  content: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { APrimitive, APrimitiveSlot } from '@vinicunca/akar';
import { computed } from 'vue';
import { useAvatarGroup } from '../composables/use-avatar-group';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<ChipProps>(),
  {
    inset: false,
    standalone: false,
  },
);

defineSlots<ChipSlots>();

const show = defineModel<boolean>('show', { default: true });

const { size } = useAvatarGroup(props);

const pohon = computed(() => chipFn({
  color: props.color,
  size: size.value,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone,
}));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <APrimitiveSlot v-bind="$attrs">
      <slot />
    </APrimitiveSlot>

    <span
      v-if="show"
      :class="pohon.base({ class: props.pohon?.base })"
    >
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </APrimitive>
</template>
