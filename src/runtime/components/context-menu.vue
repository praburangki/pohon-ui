<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  AContextMenuContentEmits,
  AContextMenuContentProps,
  AContextMenuRootEmits,
  AContextMenuRootProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AvatarProps, KbdProps, LinkProps } from '../types';
import type {
  ArrayOrNested,
  DynamicSlots,
  EmitsToProps,
  MergeTypes,
  NestedItem,
  PartialString,
} from '../types/type.utils';
import appConfig_ from '#build/app.config';
import contextMenuTheme from '#build/pohon/context-menu';
import { uv } from '../utils/uv';

const appConfigContextMenu = appConfig_ as AppConfig & {
  pohon: { contextMenu: Partial<typeof contextMenuTheme> };
};

const contextMenuFn = uv({
  extend: uv(contextMenuTheme),
  ...(appConfigContextMenu.pohon?.contextMenu || {}),
});

type ContextMenuVariants = VariantProps<typeof contextMenuFn>;

export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  color?: ContextMenuVariants['color'];
  avatar?: AvatarProps;
  content?: Omit<AContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<AContextMenuContentEmits>>;
  kbds?: Array<KbdProps['value']> | Array<KbdProps>;
  /**
   * The item type.
   * @defaultValue 'link'
   */
  type?: 'label' | 'separator' | 'link' | 'checkbox';
  slot?: string;
  loading?: boolean;
  disabled?: boolean;
  checked?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  children?: ArrayOrNested<ContextMenuItem>;
  onSelect?: (e: Event) => void;
  onUpdateChecked?: (checked: boolean) => void;
  [key: string]: any;
}

export interface ContextMenuProps<T extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>> extends Omit<AContextMenuRootProps, 'dir'> {
  /**
   * @defaultValue 'md'
   */
  size?: ContextMenuVariants['size'];
  items?: T;
  /**
   * The icon displayed when an item is checked.
   * @defaultValue appConfig.pohon.icons.check
   * @IconifyIcon
   */
  checkedIcon?: string;
  /**
   * The icon displayed when an item is loading.
   * @defaultValue appConfig.pohon.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: string;
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.pohon.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | string;
  /** The content of the menu. */
  content?: Omit<AContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<AContextMenuContentEmits>>;
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>;
  disabled?: boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof contextMenuFn.slots>;
}

export interface ContextMenuEmits extends AContextMenuRootEmits {}

type SlotProps<T extends ContextMenuItem> = (props: { item: T; active?: boolean; index: number }) => any;

export type ContextMenuSlots<
  A extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>,
  T extends NestedItem<A> = NestedItem<A>,
> = {
  'default': (props?: {}) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing', { active?: boolean; index: number }>;

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<ContextMenuItem>">
import { AContextMenuRoot, AContextMenuTrigger, useForwardPropsEmits } from '@vinicunca/akar';
import { omit } from '@vinicunca/perkakas';
import { reactivePick } from '@vueuse/core';
import { computed, toRef } from 'vue';
import PContextMenuContent from './context-menu-content.vue';

const props = withDefaults(
  defineProps<ContextMenuProps<T>>(),
  {
    portal: true,
    modal: true,
    externalIcon: true,
    labelKey: 'label',
  },
);
const emits = defineEmits<ContextMenuEmits>();
const slots = defineSlots<ContextMenuSlots<T>>();

const rootProps = useForwardPropsEmits(reactivePick(props, 'modal'), emits);

const contentProps = toRef(() => props.content);
const proxySlots = omit(slots, ['default']);

const pohon = computed(() => contextMenuFn({
  size: props.size,
}));
</script>

<template>
  <AContextMenuRoot v-bind="rootProps">
    <AContextMenuTrigger
      v-if="!!slots.default"
      as-child
      :disabled="disabled"
      :class="props.class"
    >
      <slot />
    </AContextMenuTrigger>

    <PContextMenuContent
      :class="pohon.content({ class: [!slots.default && props.class, props.pohon?.content] })"
      :pohon="pohon"
      :pohon-override="props.pohon"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
      :label-key="(labelKey as keyof NestedItem<T>)"
      :checked-icon="checkedIcon"
      :loading-icon="loadingIcon"
      :external-icon="externalIcon"
    >
      <template
        v-for="(_, name) in proxySlots"
        #[name]="slotData"
      >
        <slot
          :name="(name as keyof ContextMenuSlots<T>)"
          v-bind="slotData"
        />
      </template>
    </PContextMenuContent>
  </AContextMenuRoot>
</template>
