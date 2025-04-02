<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ADialogContentEmits,
  ADialogContentProps,
  ADialogRootEmits,
  ADialogRootProps,
} from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { ButtonProps } from '../types';
import type { EmitsToProps } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import dialogTheme from '#build/pohon/dialog';
import { uv } from '../utils/uv';

const appConfigDialog = appConfig_ as AppConfig & {
  pohon: { dialog: Partial<typeof dialogTheme> };
};

const dialogFn = uv({
  extend: uv(dialogTheme),
  ...(appConfigDialog.pohon?.dialog || {}),
});

export interface DialogProps extends ADialogRootProps {
  title?: string;
  description?: string;
  /** The content of the modal. */
  content?: Omit<ADialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ADialogContentEmits>>;
  /**
   * Render an overlay behind the modal.
   * @defaultValue true
   */
  overlay?: boolean;
  /**
   * Animate the modal when opening or closing.
   * @defaultValue true
   */
  transition?: boolean;
  /**
   * When `true`, the modal will take up the full screen.
   * @defaultValue false
   */
  fullscreen?: boolean;
  /**
   * Render the modal in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * Display a close button to dismiss the modal.
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Partial<ButtonProps>;
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.pohon.icons.close
   * @IconifyIcon
   */
  closeIcon?: string;
  /**
   * When `false`, the modal will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof dialogFn.slots>;
}

export interface DialogEmits extends ADialogRootEmits {
  'after:leave': [];
}

export interface DialogSlots {
  default: (props: { open: boolean }) => any;
  content: (props?: {}) => any;
  header: (props?: {}) => any;
  title: (props?: {}) => any;
  description: (props?: {}) => any;
  close: (props: { pohon: ReturnType<typeof dialogFn> }) => any;
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

const props = withDefaults(defineProps<DialogProps>(), {
  close: true,
  portal: true,
  overlay: true,
  transition: true,
  modal: true,
  dismissible: true,
});
const emits = defineEmits<DialogEmits>();
const slots = defineSlots<DialogSlots>();

const { t } = useLocale();
const appConfig = useAppConfig();

const rootProps = useForwardPropsEmits(reactivePick(props, 'open', 'defaultOpen', 'modal'), emits);
const contentProps = toRef(() => props.content);
const contentEvents = computed(() => {
  const events = {
    closeAutoFocus: (event: Event) => event.preventDefault(),
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

const pohon = computed(() => dialogFn({
  transition: props.transition,
  fullscreen: props.fullscreen,
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
                    :aria-label="t('modal.close')"
                    v-bind="typeof close === 'object' ? close as Partial<ButtonProps> : {}"
                    :class="pohon.close({ class: props.pohon?.close })"
                  />
                </slot>
              </ADialogClose>
            </slot>
          </div>

          <div
            v-if="!!slots.body"
            :class="pohon.body({ class: props.pohon?.body })"
          >
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
