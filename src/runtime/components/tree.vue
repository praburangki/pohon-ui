s<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ATreeRootEmits, ATreeRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type {
  DynamicSlots,
  GetItemKeys,
  GetModelValue,
  GetModelValueEmits,
  NestedItem,
  PartialString,
} from '../types/type.utils';
import appConfig_ from '#build/app.config';
import treeTheme from '#build/pohon/tree';
import { uv } from '../utils/uv';

const appConfig = appConfig_ as AppConfig & {
  pohon: { tree: Partial<typeof treeTheme> };
};

const treeFn = uv({
  extend: uv(treeTheme),
  ...(appConfig.pohon?.tree || {}),
});

type TreeVariants = VariantProps<typeof treeFn>;

export interface TreeItem {
  /**
   * @IconifyIcon
   */
  icon?: string;
  label?: string;
  /**
   * @IconifyIcon
   */
  trailingIcon?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  value?: string;
  slot?: string;
  children?: Array<TreeItem>;
  onToggle?: (e: Event) => void;
  onSelect?: (e?: Event) => void;
  [key: string]: any;
}

export interface TreeProps<T extends Array<TreeItem> = Array<TreeItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Pick<ATreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'ul'
   */
  as?: APrimitiveProps['as'];
  /**
   * @defaultValue 'primary'
   */
  color?: TreeVariants['color'];
  /**
   * @defaultValue 'md'
   */
  size?: TreeVariants['size'];
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: VK;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>;
  /**
   * The icon displayed on the right side of a parent node.
   * @defaultValue appConfig.pohon.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * The icon displayed when a parent node is expanded.
   * @defaultValue appConfig.pohon.icons.folderOpen
   * @IconifyIcon
   */
  expandedIcon?: string;
  /**
   * The icon displayed when a parent node is collapsed.
   * @defaultValue appConfig.pohon.icons.folder
   * @IconifyIcon
   */
  collapsedIcon?: string;
  items?: T;
  /** The controlled value of the Tree. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>;
  /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
  defaultValue?: GetModelValue<T, VK, M>;
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof treeFn.slots>;
}

export type TreeEmits<A extends Array<TreeItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<ATreeRootEmits, 'update:modelValue'> & GetModelValueEmits<A, VK, M>;

type SlotProps<T extends TreeItem> = (props: { item: T; index: number; level: number; expanded: boolean; selected: boolean }) => any;

export type TreeSlots<
  A extends Array<TreeItem> = Array<TreeItem>,
  T extends NestedItem<A> = NestedItem<A>,
> = {
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
} & DynamicSlots<T, undefined, { index: number; level: number; expanded: boolean; selected: boolean }>;

</script>

<script setup lang="ts" generic="T extends TreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import type { PropType } from 'vue';
import { ATreeItem, ATreeRoot, useForwardPropsEmits } from '@vinicunca/akar';
import { createReusableTemplate, reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { getProp } from '../utils';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<TreeProps<T, VK, M>>(),
  {
    labelKey: 'label' as never,
    valueKey: 'value' as never,
  },
);
const emits = defineEmits<TreeEmits<T, VK, M>>();
const slots = defineSlots<TreeSlots<T>>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'modelValue',
    'defaultValue',
    'items',
    'multiple',
    'expanded',
    'disabled',
    'propagateSelect',
  ),
  emits,
);

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<
  { items?: Array<NestedItem<T>>; level: number },
  TreeSlots<T>
>({
  props: {
    items: Array as PropType<Array<NestedItem<T>>>,
    level: Number,
  },
});

const pohon = computed(() => treeFn({
  color: props.color,
  size: props.size,
}));

function getItemLabel(item: NestedItem<T>): string {
  return getProp({ object: item, path: props.labelKey as string });
}

function getItemValue(item: NestedItem<T>): string {
  return getProp({ object: item, path: props.valueKey as string }) ?? getProp({ object: item, path: props.labelKey as string });
}

function getDefaultOpenedItems(item: NestedItem<T>): Array<string> {
  const currentItem = item.defaultExpanded ? getItemValue(item) : null;
  const childItems = item.children?.flatMap((child: TreeItem) => getDefaultOpenedItems(child as NestedItem<T>)) ?? [];

  return [currentItem, ...childItems].filter(Boolean) as Array<string>;
}

const defaultExpanded = computed(() =>
  props.defaultExpanded ?? props.items?.flatMap((item) => getDefaultOpenedItems(item as NestedItem<T>)),
);
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineTreeTemplate v-slot="{ items, level }">
    <li
      v-for="(item, index) in items"
      :key="`${level}-${index}`"
      :class="level > 0 ? pohon.itemWithChildren({ class: props.pohon?.itemWithChildren }) : pohon.item({ class: props.pohon?.item })"
    >
      <ATreeItem
        v-slot="{ isExpanded, isSelected }"
        as-child
        :level="level"
        :value="item"
        @toggle="item.onToggle"
        @select="item.onSelect"
      >
        <button
          :disabled="item.disabled || disabled"
          :class="pohon.link({ class: props.pohon?.link, selected: isSelected, disabled: item.disabled || disabled })"
        >
          <slot
            :name="((item.slot || 'item') as keyof TreeSlots<T>)"
            v-bind="{ index, level, expanded: isExpanded, selected: isSelected }"
            :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
          >
            <slot
              :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof TreeSlots<T>)"
              v-bind="{ index, level, expanded: isExpanded, selected: isSelected }"
              :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
            >
              <PIcon
                v-if="item.icon"
                :name="item.icon"
                :class="pohon.linkLeadingIcon({ class: props.pohon?.linkLeadingIcon })"
              />
              <PIcon
                v-else-if="item.children?.length"
                :name="isExpanded ? (expandedIcon ?? appConfig.pohon.icons.folderOpen) : (collapsedIcon ?? appConfig.pohon.icons.folder)"
                :class="pohon.linkLeadingIcon({ class: props.pohon?.linkLeadingIcon })"
              />
            </slot>

            <span
              v-if="getItemLabel(item) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof TreeSlots<T>]"
              :class="pohon.linkLabel({ class: props.pohon?.linkLabel })"
            >
              <slot
                :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof TreeSlots<T>)"
                v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }"
                :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
              >
                {{ getItemLabel(item) }}
              </slot>
            </span>

            <span
              v-if="item.trailingIcon || item.children?.length || !!slots[(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof TreeSlots<T>]"
              :class="pohon.linkTrailing({ class: props.pohon?.linkTrailing })"
            >
              <slot
                :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof TreeSlots<T>)"
                v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }"
                :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
              >
                <PIcon
                  v-if="item.trailingIcon"
                  :name="item.trailingIcon"
                  :class="pohon.linkTrailingIcon({ class: props.pohon?.linkTrailingIcon })"
                />
                <PIcon
                  v-else-if="item.children?.length"
                  :name="trailingIcon ?? appConfig.pohon.icons.chevronDown"
                  :class="pohon.linkTrailingIcon({ class: props.pohon?.linkTrailingIcon })"
                />
              </slot>
            </span>
          </slot>
        </button>

        <ul
          v-if="item.children?.length && isExpanded"
          :class="pohon.listWithChildren({ class: props.pohon?.listWithChildren })"
        >
          <ReuseTreeTemplate
            :items="(item.children as NestedItem<T>[])"
            :level="level + 1"
          />
        </ul>
      </ATreeItem>
    </li>
  </DefineTreeTemplate>

  <ATreeRoot
    v-bind="(rootProps as unknown as ATreeRootProps<NestedItem<T>>)"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :get-key="getItemValue"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <ReuseTreeTemplate
      :items="(items as NestedItem<T>[] | undefined)"
      :level="0"
    />
  </ATreeRoot>
</template>
