<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ATooltipArrowProps,
  ATooltipContentEmits,
  ATooltipContentProps,
  ATooltipRootEmits,
  ATooltipRootProps,
} from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { KbdProps } from '../types';
import type { EmitsToProps } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import tooltipTheme from '#build/pohon/tooltip';
import { uv } from '../utils/uv';

const appConfigTooltip = appConfig_ as AppConfig & {
  pohon: { tooltip: Partial<typeof tooltipTheme> };
};

const tooltipFn = uv({
  extend: uv(tooltipTheme),
  ...(appConfigTooltip.pohon?.tooltip || {}),
});

export interface TooltipProps extends ATooltipRootProps {
  /** The text content of the tooltip. */
  text?: string;
  /** The keyboard keys to display in the tooltip. */
  kbds?: Array<KbdProps['value']> | Array<KbdProps>;
  /**
   * The content of the tooltip.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<ATooltipContentProps, 'as' | 'asChild'> & Partial<EmitsToProps<ATooltipContentEmits>>;
  /**
   * Display an arrow alongside the tooltip.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ATooltipArrowProps, 'as' | 'asChild'>;
  /**
   * Render the tooltip in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof tooltipFn.slots>;
}

export interface TooltipEmits extends ATooltipRootEmits {}

export interface TooltipSlots {
  default: (props: { open: boolean }) => any;
  content: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import {
  ATooltipArrow,
  ATooltipContent,
  ATooltipPortal,
  ATooltipRoot,
  ATooltipTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { computed, toRef } from 'vue';
import PKbd from './kbd.vue';

const props = withDefaults(defineProps<TooltipProps>(), {
  portal: true,
});
const emits = defineEmits<TooltipEmits>();
const slots = defineSlots<TooltipSlots>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'defaultOpen',
    'open',
    'delayDuration',
    'disableHoverableContent',
    'disableClosingTrigger',
    'disabled',
    'ignoreNonKeyboardFocus',
  ),
  emits,
);
const contentProps = toRef(() => defu(
  props.content,
  { side: 'bottom', sideOffset: 8, collisionPadding: 8 },
) as ATooltipContentProps);
const arrowProps = toRef(() => props.arrow as ATooltipArrowProps);

const pohon = computed(() => tooltipFn({
  side: contentProps.value.side,
}));
</script>

<template>
  <ATooltipRoot
    v-slot="{ open }"
    v-bind="rootProps"
  >
    <ATooltipTrigger
      v-if="!!slots.default"
      v-bind="$attrs"
      as-child
      :class="props.class"
    >
      <slot :open="open" />
    </ATooltipTrigger>

    <ATooltipPortal :disabled="!portal">
      <ATooltipContent
        v-bind="contentProps"
        :class="pohon.content({ class: [!slots.default && props.class, props.pohon?.content] })"
      >
        <slot name="content">
          <span
            v-if="text"
            :class="pohon.text({ class: props.pohon?.text })"
          >{{ text }}</span>

          <span
            v-if="kbds?.length"
            :class="pohon.kbds({ class: props.pohon?.kbds })"
          >
            <PKbd
              v-for="(kbd, index) in kbds"
              :key="index"
              :size="((props.pohon?.kbdsSize || pohon.kbdsSize()) as KbdProps['size'])"
              v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
            />
          </span>
        </slot>

        <ATooltipArrow
          v-if="!!arrow"
          v-bind="arrowProps"
          :class="pohon.arrow({ class: props.pohon?.arrow })"
        />
      </ATooltipContent>
    </ATooltipPortal>
  </ATooltipRoot>
</template>
