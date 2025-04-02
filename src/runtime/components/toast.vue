<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, AToastRootEmits, AToastRootProps } from '@vinicunca/akar';
import type { VariantProps } from 'unocss-variants';
import type { AvatarProps, ButtonProps } from '../types';
import type { StringOrVNode } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import toastTheme from '#build/pohon/toast';
import { uv } from '../utils/uv';

const appConfigToast = appConfig_ as AppConfig & {
  pohon: { toast: Partial<typeof toastTheme> };
};

const toastFn = uv({
  extend: uv(toastTheme),
  ...(appConfigToast.pohon?.toast || {}),
});

type ToastVariants = VariantProps<typeof toastFn>;

export interface ToastProps extends Pick<AToastRootProps, 'defaultOpen' | 'open' | 'type' | 'duration'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'li'
   */
  as?: APrimitiveProps['as'];
  title?: StringOrVNode;
  description?: StringOrVNode;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  /**
   * @defaultValue 'primary'
   */
  color?: ToastVariants['color'];
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: ToastVariants['orientation'];
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: Array<ButtonProps>;
  /**
   * Display a close button to dismiss the toast.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @defaultValue true
   */
  close?: boolean | Partial<ButtonProps>;
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.pohon.icons.close
   * @IconifyIcon
   */
  closeIcon?: string;
  class?: any;
  pohon?: Partial<typeof toastFn.slots>;
}

export interface ToastEmits extends AToastRootEmits {}

export interface ToastSlots {
  leading: (props?: {}) => any;
  title: (props?: {}) => any;
  description: (props?: {}) => any;
  actions: (props?: {}) => any;
  close: (props: { ui: ReturnType<typeof toastFn> }) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  AToastAction,
  AToastClose,
  AToastDescription,
  AToastRoot,
  AToastTitle,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useLocale } from '../composables/use-locale';
import PAvatar from './avatar.vue';
import PButton from './button.vue';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<ToastProps>(),
  {
    close: true,
    orientation: 'vertical',
  },
);
const emits = defineEmits<ToastEmits>();
const slots = defineSlots<ToastSlots>();

const { t } = useLocale();
const appConfig = useAppConfig();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'defaultOpen',
    'open',
    'duration',
    'type',
  ),
  emits,
);

const pohon = computed(() => toastFn({
  color: props.color,
  orientation: props.orientation,
  title: !!props.title || !!slots.title,
}));

const el = ref();
const height = ref(0);

onMounted(() => {
  if (!el.value) {
    return;
  }

  setTimeout(() => {
    height.value = el.value.$el.getBoundingClientRect()?.height;
  }, 0);
});

defineExpose({
  height,
});
</script>

<template>
  <AToastRoot
    ref="el"
    v-slot="{ remaining, duration }"
    v-bind="rootProps"
    :data-orientation="orientation"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :style="{ '--height': height }"
  >
    <slot name="leading">
      <PAvatar
        v-if="avatar"
        :size="(props.pohon?.avatarSize || pohon.avatarSize()) as AvatarProps['size']"
        v-bind="avatar"
        :class="pohon.avatar({ class: props.pohon?.avatar })"
      />
      <PIcon
        v-else-if="icon"
        :name="icon"
        :class="pohon.icon({ class: props.pohon?.icon })"
      />
    </slot>

    <div :class="pohon.wrapper({ class: props.pohon?.wrapper })">
      <AToastTitle
        v-if="title || !!slots.title"
        :class="pohon.title({ class: props.pohon?.title })"
      >
        <slot name="title">
          <component
            :is="title()"
            v-if="typeof title === 'function'"
          />
          <component
            :is="title"
            v-else-if="typeof title === 'object'"
          />
          <template v-else>
            {{ title }}
          </template>
        </slot>
      </AToastTitle>

      <AToastDescription
        v-if="description || !!slots.description"
        :class="pohon.description({ class: props.pohon?.description })"
      >
        <slot name="description">
          <component
            :is="description()"
            v-if="typeof description === 'function'"
          />
          <component
            :is="description"
            v-else-if="typeof description === 'object'"
          />
          <template v-else>
            {{ description }}
          </template>
        </slot>
      </AToastDescription>

      <div
        v-if="orientation === 'vertical' && actions?.length"
        :class="pohon.actions({ class: props.pohon?.actions })"
      >
        <slot name="actions">
          <AToastAction
            v-for="(action, index) in actions"
            :key="index"
            :alt-text="action.label || 'Action'"
            as-child
            @click.stop
          >
            <PButton
              size="xs"
              :color="color"
              v-bind="action"
            />
          </AToastAction>
        </slot>
      </div>
    </div>

    <div
      v-if="(orientation === 'horizontal' && actions?.length) || close"
      :class="pohon.actions({ class: props.pohon?.actions, orientation: 'horizontal' })"
    >
      <template v-if="orientation === 'horizontal' && actions?.length">
        <slot name="actions">
          <AToastAction
            v-for="(action, index) in actions"
            :key="index"
            :alt-text="action.label || 'Action'"
            as-child
            @click.stop
          >
            <PButton
              size="xs"
              :color="color"
              v-bind="action"
            />
          </AToastAction>
        </slot>
      </template>

      <AToastClose
        v-if="close || !!slots.close"
        as-child
      >
        <slot
          name="close"
          :ui="pohon"
        >
          <PButton
            v-if="close"
            :icon="closeIcon || appConfig.pohon.icons.close"
            size="md"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="typeof close === 'object' ? close as Partial<ButtonProps> : {}"
            :class="pohon.close({ class: props.pohon?.close })"
            @click.stop
          />
        </slot>
      </AToastClose>
    </div>

    <div
      v-if="remaining > 0 && duration"
      :class="pohon.progress({ class: props.pohon?.progress })"
      :style="{ width: `${remaining / duration * 100}%` }"
    />
  </AToastRoot>
</template>
