<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AvatarProps, ButtonProps } from '../types';
import appConfig_ from '#build/app.config';
import alertTheme from '#build/pohon/alert';
import { uv } from '../utils/uv';

const appConfigAlert = appConfig_ as AppConfig & { pohon: { alert: Partial<typeof alertTheme> } };

const alertFn = uv({
  extend: uv(alertTheme),
  ...(appConfigAlert.pohon?.alert || {}),
});

type AlertVariants = VariantProps<typeof alertFn>;

export interface AlertProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  title?: string;
  description?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  /**
   * @defaultValue 'primary'
   */
  color?: AlertVariants['color'];
  /**
   * @defaultValue 'solid'
   */
  variant?: AlertVariants['variant'];
  /**
   * The orientation between the content and the actions.
   * @defaultValue 'vertical'
   */
  orientation?: AlertVariants['orientation'];
  /**
   * Display a list of actions:
   * - under the title and description when orientation is `vertical`
   * - next to the close button when orientation is `horizontal`
   * `{ size: 'xs' }`{lang="ts-type"}
   */
  actions?: Array<ButtonProps>;
  /**
   * Display a close button to dismiss the alert.
   * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
   * @emits 'update:open'
   * @defaultValue false
   */
  close?: boolean | Partial<ButtonProps>;
  /**
   * The icon displayed in the close button.
   * @defaultValue appConfig.pohon.icons.close
   * @IconifyIcon
   */
  closeIcon?: string;
  class?: ClassValue;
  pohon?: Partial<typeof alertFn.slots>;
}

export interface AlertEmits {
  (event: 'update:open', value: boolean): void;
}

export interface AlertSlots {
  leading: (props?: {}) => any;
  title: (props?: {}) => any;
  description: (props?: {}) => any;
  actions: (props?: {}) => any;
  close: (props: { pohon: ReturnType<typeof alertFn> }) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { APrimitive } from '@vinicunca/akar';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import PAvatar from './avatar.vue';
import PButton from './button.vue';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<AlertProps>(),
  {
    orientation: 'vertical',
  },
);

const emits = defineEmits<AlertEmits>();
const slots = defineSlots<AlertSlots>();

const { t } = useLocale();
const appConfig = useAppConfig();

const pohon = computed(() => alertFn({
  color: props.color,
  variant: props.variant,
  orientation: props.orientation,
  title: !!props.title || !!slots.title,
}));
</script>

<template>
  <APrimitive
    :as="as"
    :data-orientation="orientation"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <slot name="leading">
      <PAvatar
        v-if="avatar"
        :size="((props.pohon?.avatarSize || pohon.avatarSize()) as AvatarProps['size'])"
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
      <div
        v-if="title || !!slots.title"
        :class="pohon.title({ class: props.pohon?.title })"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <div
        v-if="description || !!slots.description"
        :class="pohon.description({ class: props.pohon?.description })"
      >
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <div
        v-if="orientation === 'vertical' && actions?.length"
        :class="pohon.actions({ class: props.pohon?.actions })"
      >
        <slot name="actions">
          <PButton
            v-for="(action, index) in actions"
            :key="index"
            size="xs"
            v-bind="action"
          />
        </slot>
      </div>
    </div>

    <div
      v-if="(orientation === 'horizontal' && actions?.length) || close"
      :class="pohon.actions({ class: props.pohon?.actions, orientation: 'horizontal' })"
    >
      <template v-if="orientation === 'horizontal' && actions?.length">
        <slot name="actions">
          <PButton
            v-for="(action, index) in actions"
            :key="index"
            size="xs"
            v-bind="action"
          />
        </slot>
      </template>

      <slot
        name="close"
        :pohon="pohon"
      >
        <PButton
          v-if="close"
          :icon="closeIcon || appConfig.pohon.icons.close"
          size="md"
          color="neutral"
          variant="link"
          :aria-label="t('alert.close')"
          v-bind="typeof close === 'object' ? close as Partial<ButtonProps> : {}"
          :class="pohon.close({ class: props.pohon?.close })"
          @click="emits('update:open', false)"
        />
      </slot>
    </div>
  </APrimitive>
</template>
