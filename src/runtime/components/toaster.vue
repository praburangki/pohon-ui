<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { AToastProviderProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import toasterTheme from '#build/pohon/toaster';
import { uv } from '../utils/uv';

const appConfigToaster = appConfig_ as AppConfig & {
  pohon: { toaster: Partial<typeof toasterTheme> };
};

const toasterFn = uv({
  extend: uv(toasterTheme),
  ...(appConfigToaster.pohon?.toaster || {}),
});

type ToasterVariants = VariantProps<typeof toasterFn>;

export interface ToasterProps extends Omit<AToastProviderProps, 'swipeDirection'> {
  /**
   * The position on the screen to display the toasts.
   * @defaultValue 'bottom-right'
   */
  position?: ToasterVariants['position'];
  /**
   * Expand the toasts to show multiple toasts at once.
   * @defaultValue true
   */
  expand?: boolean;
  /**
   * Render the toaster in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof toasterFn.slots>;
}

export interface ToasterSlots {
  default: (props?: {}) => any;
}

export default {
  name: 'Toaster',
};
</script>

<script setup lang="ts">
import {
  AToastPortal,
  AToastProvider,
  AToastViewport,
  useForwardProps,
} from '@vinicunca/akar';
import { omit } from '@vinicunca/perkakas';
import { reactivePick } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useToast } from '../composables/use-toast';
import PToast from './toast.vue';

const props = withDefaults(
  defineProps<ToasterProps>(),
  {
    expand: true,
    portal: true,
    duration: 5000,
  },
);
defineSlots<ToasterSlots>();

const providerProps = useForwardProps(
  reactivePick(props, 'duration', 'label', 'swipeThreshold'),
);

const { toasts, remove } = useToast();

const swipeDirection = computed(() => {
  switch (props.position) {
    case 'top-center':
      return 'up';
    case 'top-right':
    case 'bottom-right':
      return 'right';
    case 'bottom-center':
      return 'down';
    case 'top-left':
    case 'bottom-left':
      return 'left';
  }
  return 'right';
});

const pohon = computed(() => toasterFn({
  position: props.position,
  swipeDirection: swipeDirection.value,
}));

function onUpdateOpen(value: boolean, id: string | number) {
  if (value) {
    return;
  }

  remove(id);
}

const hovered = ref(false);
const expanded = computed(() => props.expand || hovered.value);

const refs = ref<Array<{ height: number }>>([]);

const height = computed(() => refs.value.reduce((acc, { height }) => acc + height + 16, 0));
const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);

function getOffset(index: number) {
  return refs.value.slice(index + 1).reduce((acc, { height }) => acc + height + 16, 0);
}
</script>

<template>
  <AToastProvider
    :swipe-direction="swipeDirection"
    v-bind="providerProps"
  >
    <slot />

    <PToast
      v-for="(toast, index) of toasts"
      :key="toast.id"
      ref="refs"
      v-bind="omit(toast, ['id', 'close'])"
      :close="toast.close as boolean"
      :data-expanded="expanded"
      :data-front="!expanded && index === toasts.length - 1"
      :style="{
        '--index': (index - toasts.length) + toasts.length,
        '--before': toasts.length - 1 - index,
        '--offset': getOffset(index),
        '--scale': expanded ? '1' : 'calc(1 - var(--before) * var(--scale-factor))',
        '--translate': expanded ? 'calc(var(--offset) * var(--translate-factor))' : 'calc(var(--before) * var(--gap))',
        '--transform': 'translateY(var(--translate)) scale(var(--scale))',
      }"
      :class="[
        pohon.base(),
        {
          'cursor-pointer': !!toast.onClick,
        },
      ]"
      @update:open="onUpdateOpen($event, toast.id)"
      @click="toast.onClick && toast.onClick(toast)"
    />

    <AToastPortal :disabled="!portal">
      <AToastViewport
        :data-expanded="expanded"
        :class="pohon.viewport({ class: [props.class, props.pohon?.viewport] })"
        :style="{
          '--scale-factor': '0.05',
          '--translate-factor': position?.startsWith('top') ? '1px' : '-1px',
          '--gap': position?.startsWith('top') ? '16px' : '-16px',
          '--front-height': `${frontHeight}px`,
          '--height': `${height}px`,
        }"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      />
    </AToastPortal>
  </AToastProvider>
</template>
