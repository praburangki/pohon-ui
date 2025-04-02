<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ADialogContentEmits,
  ADialogContentProps,
  ADialogRootEmits,
  ADialogRootProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { ButtonProps } from '../types';
import type { EmitsToProps } from '../types/type.utils';
import _appConfig from '#build/app.config';
import slideoverTheme from '#build/pohon/slideover';
import { uv } from '../utils/uv';

const appConfigSlideover = _appConfig as AppConfig & {
  pohon: { slideover: Partial<typeof slideoverTheme> };
};

const slideoverFn = uv({
  extend: uv(slideoverTheme),
  ...(appConfigSlideover.pohon?.slideover || {}),
});

type SlideoverVariants = VariantProps<typeof slideoverFn>;

export interface SlideoverProps extends ADialogRootProps {
  title?: string;
  description?: string;
  /** The content of the slideover. */
  content?: Omit<ADialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ADialogContentEmits>>;
  /**
   * Render an overlay behind the slideover.
   * @defaultValue true
   */
  overlay?: boolean;
  /**
   * Animate the slideover when opening or closing.
   * @defaultValue true
   */
  transition?: boolean;
  /**
   * The side of the slideover.
   * @defaultValue 'right'
   */
  side?: SlideoverVariants['side'];
  /**
   * Render the slideover in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * Display a close button to dismiss the slideover.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Partial<ButtonProps>;
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  closeIcon?: string;
  /**
   * When `false`, the slideover will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof slideoverFn.slots>;
}

export interface SlideoverEmits extends ADialogRootEmits {
  'after:leave': [];
}

export interface SlideoverSlots {
  default: (props: { open: boolean }) => any;
  content: (props?: {}) => any;
  header: (props?: {}) => any;
  title: (props?: {}) => any;
  description: (props?: {}) => any;
  close: (props: { pohon: ReturnType<typeof slideoverFn> }) => any;
  body: (props?: {}) => any;
  footer: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  ADialogClose,
  ADialogContent,
  ADialogDescription,
  ADialogOverlay,
  ADialogPortal,
  ADialogRoot,
  ADialogTitle,
  ADialogTrigger,
  AVisuallyHidden,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, toRef } from 'vue';
import { useLocale } from '../composables/use-locale';
import PButton from './button.vue';

const props = withDefaults(defineProps<SlideoverProps>(), {
  close: true,
  portal: true,
  overlay: true,
  transition: true,
  modal: true,
  dismissible: true,
  side: 'right',
});
const emits = defineEmits<SlideoverEmits>();
const slots = defineSlots<SlideoverSlots>();

const { t } = useLocale();
const appConfig = useAppConfig();

const rootProps = useForwardPropsEmits(
  reactivePick(props, 'open', 'defaultOpen', 'modal'),
  emits,
);
const contentProps = toRef(() => props.content);
const contentEvents = computed(() => {
  const events = {
    closeAutoFocus: (e: Event) => e.preventDefault(),
  };

  if (!props.dismissible) {
    return {
      pointerDownOutside: (e: Event) => e.preventDefault(),
      interactOutside: (e: Event) => e.preventDefault(),
      escapeKeyDown: (e: Event) => e.preventDefault(),
      ...events,
    };
  }

  return events;
});

const pohon = computed(() => slideoverFn({
  transition: props.transition,
  side: props.side,
}));
</script>

<template>
  <ADialogRoot
    v-slot="{ open }"
    v-bind="rootProps"
  >
    <ADialogTrigger
      v-if="!!slots.default"
      as-child
      :class="props.class"
    >
      <slot :open="open" />
    </ADialogTrigger>

    <ADialogPortal :disabled="!portal">
      <ADialogOverlay
        v-if="overlay"
        :class="pohon.overlay({ class: props.pohon?.overlay })"
      />

      <ADialogContent
        :data-side="side"
        :class="pohon.content({ class: [!slots.default && props.class, props.pohon?.content] })"
        v-bind="contentProps"
        @after-leave="emits('after:leave')"
        v-on="contentEvents"
      >
        <AVisuallyHidden v-if="!!slots.content && ((title || !!slots.title) || (description || !!slots.description))">
          <ADialogTitle v-if="title || !!slots.title">
            <slot name="title">
              {{ title }}
            </slot>
          </ADialogTitle>

          <ADialogDescription v-if="description || !!slots.description">
            <slot name="description">
              {{ description }}
            </slot>
          </ADialogDescription>
        </AVisuallyHidden>

        <slot name="content">
          <div
            v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (close || !!slots.close)"
            :class="pohon.header({ class: props.pohon?.header })"
          >
            <slot name="header">
              <div :class="pohon.wrapper({ class: props.pohon?.wrapper })">
                <ADialogTitle
                  v-if="title || !!slots.title"
                  :class="pohon.title({ class: props.pohon?.title })"
                >
                  <slot name="title">
                    {{ title }}
                  </slot>
                </ADialogTitle>

                <ADialogDescription
                  v-if="description || !!slots.description"
                  :class="pohon.description({ class: props.pohon?.description })"
                >
                  <slot name="description">
                    {{ description }}
                  </slot>
                </ADialogDescription>
              </div>

              <ADialogClose
                v-if="close || !!slots.close"
                as-child
              >
                <slot
                  name="close"
                  :pohon="pohon"
                >
                  <PButton
                    v-if="close"
                    :icon="closeIcon || appConfig.pohon.icons.close"
                    size="md"
                    color="neutral"
                    variant="ghost"
                    :aria-label="t('slideover.close')"
                    v-bind="(typeof close === 'object' ? close as Partial<ButtonProps> : {})"
                    :class="pohon.close({ class: props.pohon?.close })"
                  />
                </slot>
              </ADialogClose>
            </slot>
          </div>

          <div :class="pohon.body({ class: props.pohon?.body })">
            <slot name="body" />
          </div>

          <div
            v-if="!!slots.footer"
            :class="pohon.footer({ class: props.pohon?.footer })"
          >
            <slot name="footer" />
          </div>
        </slot>
      </ADialogContent>
    </ADialogPortal>
  </ADialogRoot>
</template>
