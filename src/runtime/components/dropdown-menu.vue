<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ADropdownMenuArrowProps,
  ADropdownMenuContentEmits,
  ADropdownMenuContentProps,
  ADropdownMenuRootEmits,
  ADropdownMenuRootProps,
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
import dropdownMenuTheme from '#build/pohon/dropdown-menu';
import { omit } from '@vinicunca/perkakas';
import { uv } from '../utils/uv';

const appConfigDropdownMenu = appConfig_ as AppConfig & {
  pohon: { dropdownMenu: Partial<typeof dropdownMenuTheme> };
};

const dropdownMenuFn = uv({
  extend: uv(dropdownMenuTheme),
  ...(appConfigDropdownMenu.pohon?.dropdownMenu || {}),
});

type DropdownMenuVariants = VariantProps<typeof dropdownMenuFn>;

export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  color?: DropdownMenuVariants['color'];
  avatar?: AvatarProps;
  content?: Omit<ADropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ADropdownMenuContentEmits>>;
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
  children?: ArrayOrNested<DropdownMenuItem>;
  onSelect?: (e: Event) => void;
  onUpdateChecked?: (checked: boolean) => void;
  [key: string]: any;
}

export interface DropdownMenuProps<T extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>> extends Omit<ADropdownMenuRootProps, 'dir'> {
  /**
   * @defaultValue 'md'
   */
  size?: DropdownMenuVariants['size'];
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
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
   */
  content?: Omit<ADropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ADropdownMenuContentEmits>>;
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ADropdownMenuArrowProps, 'as' | 'asChild'>;
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
  pohon?: PartialString<typeof dropdownMenuFn.slots>;
}

export interface DropdownMenuEmits extends ADropdownMenuRootEmits {}

type SlotProps<T extends DropdownMenuItem> = (props: { item: T; active?: boolean; index: number }) => any;

export type DropdownMenuSlots<
  A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>,
  T extends NestedItem<A> = NestedItem<A>,
> = {
  'default': (props: { open: boolean }) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing', { active?: boolean; index: number }>;

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<DropdownMenuItem>">
import {
  ADropdownMenuArrow,
  ADropdownMenuRoot,
  ADropdownMenuTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { computed, toRef } from 'vue';
import PDropdownMenuContent from './dropdown-menu-content.vue';

const props = withDefaults(
  defineProps<DropdownMenuProps<T>>(),
  {
    portal: true,
    modal: true,
    externalIcon: true,
    labelKey: 'label',
  },
);
const emits = defineEmits<DropdownMenuEmits>();
const slots = defineSlots<DropdownMenuSlots<T>>();

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits);
const contentProps = toRef(() =>
  defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8 }) as ADropdownMenuContentProps,
);
const arrowProps = toRef(() =>
  props.arrow as ADropdownMenuArrowProps,
);
const proxySlots = omit(slots, ['default']);

const pohon = computed(() => dropdownMenuFn({
  size: props.size,
}));
</script>

<template>
  <ADropdownMenuRoot
    v-slot="{ open }"
    v-bind="rootProps"
  >
    <ADropdownMenuTrigger
      v-if="!!slots.default"
      as-child
      :class="props.class"
      :disabled="disabled"
    >
      <slot :open="open" />
    </ADropdownMenuTrigger>

    <PDropdownMenuContent
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
          :name="(name as keyof DropdownMenuSlots<T>)"
          v-bind="slotData"
        />
      </template>

      <ADropdownMenuArrow
        v-if="!!arrow"
        v-bind="arrowProps"
        :class="pohon.arrow({ class: props.pohon?.arrow })"
      />
    </PDropdownMenuContent>
  </ADropdownMenuRoot>
</template>
