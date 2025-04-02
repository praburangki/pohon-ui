<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  AHoverCardRootProps,
  APopoverArrowProps,
  APopoverContentEmits,
  APopoverContentProps,
  APopoverRootEmits,
  APopoverRootProps,
} from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { EmitsToProps } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import popoverTheme from '#build/pohon/popover';
import { uv } from '../utils/uv';

const appConfigPopover = appConfig_ as AppConfig & {
  pohon: { popover: Partial<typeof popoverTheme> };
};

const popoverFn = uv({
  extend: uv(popoverTheme),
  ...(appConfigPopover.pohon?.popover || {}),
});

export interface PopoverProps extends APopoverRootProps, Pick<AHoverCardRootProps, 'openDelay' | 'closeDelay'> {
  /**
   * The display mode of the popover.
   * @defaultValue 'click'
   */
  mode?: 'click' | 'hover';
  /**
   * The content of the popover.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<APopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<APopoverContentEmits>>;
  /**
   * Display an arrow alongside the popover.
   * @defaultValue false
   */
  arrow?: boolean | Omit<APopoverArrowProps, 'as' | 'asChild'>;
  /**
   * Render the popover in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * When `false`, the popover will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof popoverFn.slots>;
}

export interface PopoverEmits extends APopoverRootEmits {}

export interface PopoverSlots {
  default: (props: { open: boolean }) => any;
  content: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { useForwardPropsEmits } from '@vinicunca/akar';
import { AHoverCard, APopover } from '@vinicunca/akar/namespaced';
import { reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { computed, toRef } from 'vue';

const props = withDefaults(
  defineProps<PopoverProps>(),
  {
    portal: true,
    mode: 'click',
    openDelay: 0,
    closeDelay: 0,
    dismissible: true,
  },
);
const emits = defineEmits<PopoverEmits>();
const slots = defineSlots<PopoverSlots>();

const pick = props.mode === 'hover'
  ? reactivePick(
      props,
      'defaultOpen',
      'open',
      'openDelay',
      'closeDelay',
    )
  : reactivePick(props, 'defaultOpen', 'open', 'modal');
const rootProps = useForwardPropsEmits(pick, emits);
const contentProps = toRef(() =>
  defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as APopoverContentProps,
);
const contentEvents = computed(() => {
  if (!props.dismissible) {
    return {
      pointerDownOutside: (e: Event) => e.preventDefault(),
      interactOutside: (e: Event) => e.preventDefault(),
      escapeKeyDown: (e: Event) => e.preventDefault(),
    };
  }

  return {};
});
const arrowProps = toRef(() => props.arrow as APopoverArrowProps);

const pohon = computed(() => popoverFn({
  side: contentProps.value.side,
}));

const Component = computed(() => props.mode === 'hover' ? AHoverCard : APopover);
</script>

<template>
  <Component.Root
    v-slot="{ open }"
    v-bind="rootProps"
  >
    <Component.Trigger
      v-if="!!slots.default"
      as-child
      :class="props.class"
    >
      <slot :open="open" />
    </Component.Trigger>

    <Component.Portal :disabled="!portal">
      <Component.Content
        v-bind="contentProps"
        :class="pohon.content({ class: [!slots.default && props.class, props.pohon?.content] })"
        v-on="contentEvents"
      >
        <slot name="content" />

        <Component.Arrow
          v-if="!!arrow"
          v-bind="arrowProps"
          :class="pohon.arrow({ class: props.pohon?.arrow })"
        />
      </Component.Content>
    </Component.Portal>
  </Component.Root>
</template>
