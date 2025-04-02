<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ADialogContentEmits,
  ADialogContentProps,
  ADrawerRootEmits,
  ADrawerRootProps,
  APrimitiveProps,
} from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { EmitsToProps } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import drawerTheme from '#build/pohon/drawer';
import { uv } from '../utils/uv';

const appConfigDrawer = appConfig_ as AppConfig & {
  pohon: { drawer: Partial<typeof drawerTheme> };
};

const drawerFn = uv({
  extend: uv(drawerTheme),
  ...(appConfigDrawer.pohon?.drawer || {}),
});

export interface DrawerProps extends Pick<ADrawerRootProps, 'activeSnapPoint' | 'closeThreshold' | 'shouldScaleBackground' | 'setBackgroundColorOnScale' | 'scrollLockTimeout' | 'fixed' | 'dismissible' | 'modal' | 'open' | 'defaultOpen' | 'nested' | 'direction' | 'noBodyStyles' | 'handleOnly' | 'preventScrollRestoration' | 'snapPoints'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  title?: string;
  description?: string;
  /**
   * Whether to inset the drawer from the edges.
   * @defaultValue false
   */
  inset?: boolean;
  /** The content of the drawer. */
  content?: Omit<ADialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ADialogContentEmits>>;
  /**
   * Render an overlay behind the drawer.
   * @defaultValue true
   */
  overlay?: boolean;
  /**
   * Render a handle on the drawer.
   * @defaultValue true
   */
  handle?: boolean;
  /**
   * Render the drawer in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  class?: ClassValue;
  pohon?: Partial<typeof drawerFn.slots>;
}

export interface DrawerEmits extends ADrawerRootEmits {}

export interface DrawerSlots {
  default: (props?: {}) => any;
  content: (props?: {}) => any;
  header: (props?: {}) => any;
  title: (props?: {}) => any;
  description: (props?: {}) => any;
  body: (props?: {}) => any;
  footer: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import {
  ADrawerContent,
  ADrawerDescription,
  ADrawerHandle,
  ADrawerOverlay,
  ADrawerPortal,
  ADrawerRoot,
  ADrawerTitle,
  ADrawerTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, toRef } from 'vue';

const props = withDefaults(
  defineProps<DrawerProps>(),
  {
    direction: 'bottom',
    portal: true,
    overlay: true,
    handle: true,
    modal: true,
    dismissible: true,
  },
);
const emits = defineEmits<DrawerEmits>();
const slots = defineSlots<DrawerSlots>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'activeSnapPoint',
    'closeThreshold',
    'shouldScaleBackground',
    'setBackgroundColorOnScale',
    'scrollLockTimeout',
    'fixed',
    'dismissible',
    'modal',
    'open',
    'defaultOpen',
    'nested',
    'direction',
    'noBodyStyles',
    'handleOnly',
    'preventScrollRestoration',
    'snapPoints',
  ),
  emits,
);
const contentProps = toRef(() => props.content);
const contentEvents = {
  closeAutoFocus: (e: Event) => e.preventDefault(),
};

const pohon = computed(() => drawerFn({
  direction: props.direction,
  inset: props.inset,
}));
</script>

<template>
  <ADrawerRoot v-bind="rootProps">
    <ADrawerTrigger
      v-if="!!slots.default"
      as-child
      :class="props.class"
    >
      <slot />
    </ADrawerTrigger>

    <ADrawerPortal :disabled="!portal">
      <ADrawerOverlay
        v-if="overlay"
        :class="pohon.overlay({ class: props.pohon?.overlay })"
      />

      <ADrawerContent
        :class="pohon.content({ class: [!slots.default && props.class, props.pohon?.content] })"
        v-bind="contentProps"
        v-on="contentEvents"
      >
        <ADrawerHandle
          v-if="handle"
          :class="pohon.handle({ class: props.pohon?.handle })"
        />

        <slot name="content">
          <div :class="pohon.container({ class: props.pohon?.container })">
            <div
              v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)"
              :class="pohon.header({ class: props.pohon?.header })"
            >
              <slot name="header">
                <ADrawerTitle
                  v-if="title || !!slots.title"
                  :class="pohon.title({ class: props.pohon?.title })"
                >
                  <slot name="title">
                    {{ title }}
                  </slot>
                </ADrawerTitle>

                <ADrawerDescription
                  v-if="description || !!slots.description"
                  :class="pohon.description({ class: props.pohon?.description })"
                >
                  <slot name="description">
                    {{ description }}
                  </slot>
                </ADrawerDescription>
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
          </div>
        </slot>
      </ADrawerContent>
    </ADrawerPortal>
  </ADrawerRoot>
</template>
