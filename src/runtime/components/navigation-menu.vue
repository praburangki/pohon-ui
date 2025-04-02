<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ACollapsibleRootProps,
  ANavigationMenuContentEmits,
  ANavigationMenuContentProps,
  ANavigationMenuRootEmits,
  ANavigationMenuRootProps,
  APrimitiveProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AvatarProps, BadgeProps, LinkProps } from '../types';
import type {
  ArrayOrNested,
  DynamicSlots,
  EmitsToProps,
  MergeTypes,
  NestedItem,
  PartialString,
} from '../types/type.utils';
import appConfig_ from '#build/app.config';
import navigationMenuTheme from '#build/pohon/navigation-menu';
import { uv } from '../utils/uv';

const appConfigNavigationMenu = appConfig_ as AppConfig & {
  pohon: { navigationMenu: Partial<typeof navigationMenuTheme> };
};

const navigationMenuFn = uv({
  extend: uv(navigationMenuTheme),
  ...(appConfigNavigationMenu.pohon?.navigationMenu || {}),
});

export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'type'> {
  /** Description is only used when `orientation` is `horizontal`. */
  description?: string;
  [key: string]: any;
}

export interface NavigationMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'>, Pick<ACollapsibleRootProps, 'defaultOpen' | 'open'> {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | BadgeProps;
  /**
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * The type of the item.
   * The `label` type only works on `vertical` orientation.
   * @defaultValue 'link'
   */
  type?: 'label' | 'link';
  slot?: string;
  value?: string;
  children?: Array<NavigationMenuChildItem>;
  onSelect?: (event: Event) => void;
  [key: string]: any;
}

type NavigationMenuVariants = VariantProps<typeof navigationMenuFn>;

export interface NavigationMenuProps<T extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>> extends Pick<ANavigationMenuRootProps, 'modelValue' | 'defaultValue' | 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.pohon.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.pohon.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | string;
  items?: T;
  /**
   * @defaultValue 'primary'
   */
  color?: NavigationMenuVariants['color'];
  /**
   * @defaultValue 'pill'
   */
  variant?: NavigationMenuVariants['variant'];
  /**
   * The orientation of the menu.
   * @defaultValue 'horizontal'
   */
  orientation?: ANavigationMenuRootProps['orientation'];
  /**
   * Collapse the navigation menu to only show icons.
   * Only works when `orientation` is `vertical`.
   * @defaultValue false
   */
  collapsed?: boolean;
  /** Display a line next to the active item. */
  highlight?: boolean;
  /**
   * @defaultValue 'primary'
   */
  highlightColor?: NavigationMenuVariants['highlightColor'];
  /** The content of the menu. */
  content?: Omit<ANavigationMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ANavigationMenuContentEmits>>;
  /**
   * The orientation of the content.
   * Only works when `orientation` is `horizontal`.
   * @defaultValue 'horizontal'
   */
  contentOrientation?: NavigationMenuVariants['contentOrientation'];
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>;
  class?: ClassValue;
  pohon?: PartialString<typeof navigationMenuFn.slots>;
}

export interface NavigationMenuEmits extends ANavigationMenuRootEmits {}

type SlotProps<T extends NavigationMenuItem> = (props: { item: T; index: number; active?: boolean }) => any;

export type NavigationMenuSlots<
  A extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>,
  T extends NestedItem<A> = NestedItem<A>,
> = {
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
  'item-content': SlotProps<T>;
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing' | 'content', { index: number; active?: boolean }>;
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<NavigationMenuItem>">
import { useAppConfig } from '#imports';
import {
  ANavigationMenuContent,
  ANavigationMenuIndicator,
  ANavigationMenuItem,
  ANavigationMenuLink,
  ANavigationMenuList,
  ANavigationMenuRoot,
  ANavigationMenuTrigger,
  ANavigationMenuViewport,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { isNumber, isString } from '@vinicunca/perkakas';
import { createReusableTemplate } from '@vueuse/core';
import { computed, toRef } from 'vue';
import { getProp, isArrayOfArray } from '../utils';
import { pickLinkProps } from '../utils/util.link';
import PAvatar from './avatar.vue';
import PBadge from './badge.vue';
import PCollapsible from './collapsible.vue';
import PIcon from './icon.vue';
import PLinkBase from './link-base.vue';
import PLink from './link.vue';

const props = withDefaults(
  defineProps<NavigationMenuProps<T>>(),
  {
    orientation: 'horizontal',
    contentOrientation: 'horizontal',
    externalIcon: true,
    delayDuration: 0,
    unmountOnHide: true,
    labelKey: 'label',
  },
);
const emits = defineEmits<NavigationMenuEmits>();
const slots = defineSlots<NavigationMenuSlots<T>>();

const rootProps = useForwardPropsEmits(
  computed(() => ({
    as: props.as,
    modelValue: props.modelValue,
    defaultValue: props.defaultValue,
    delayDuration: props.delayDuration,
    skipDelayDuration: props.skipDelayDuration,
    orientation: props.orientation,
    disableClickTrigger: props.disableClickTrigger,
    disableHoverTrigger: props.disableHoverTrigger,
    disablePointerLeaveClose: props.disablePointerLeaveClose,
    unmountOnHide: props.unmountOnHide,
  })),
  emits,
);

const contentProps = toRef(() => props.content);

const appConfig = useAppConfig();
const [
  DefineLinkTemplate,
  ReuseLinkTemplate,
] = createReusableTemplate<
  { item: NavigationMenuItem; index: number; active?: boolean },
  NavigationMenuSlots<T>
>();
const [
  DefineItemTemplate,
  ReuseItemTemplate,
] = createReusableTemplate<
  { item: NavigationMenuItem; index: number; level?: number },
  NavigationMenuSlots<T>
>({
  props: {
    item: Object,
    index: Number,
    level: Number,
  },
});

const pohon = computed(() => navigationMenuFn({
  orientation: props.orientation,
  contentOrientation: props.contentOrientation,
  collapsed: props.collapsed,
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color,
}));

const lists = computed<Array<Array<NavigationMenuItem>>>(() => {
  if (props.items?.length) {
    return isArrayOfArray(props.items)
      ? props.items
      : [props.items];
  }

  return [];
});
</script>

<template>
  <DefineLinkTemplate v-slot="{ item, active, index }">
    <slot
      :name="((item.slot || 'item') as keyof NavigationMenuSlots<T>)"
      :item="item"
      :index="index"
    >
      <slot
        :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof NavigationMenuSlots<T>)"
        :item="item"
        :active="active"
        :index="index"
      >
        <PAvatar
          v-if="item.avatar"
          :size="((props.pohon?.linkLeadingAvatarSize || pohon.linkLeadingAvatarSize()) as AvatarProps['size'])"
          v-bind="item.avatar"
          :class="pohon.linkLeadingAvatar({ class: props.pohon?.linkLeadingAvatar, active, disabled: !!item.disabled })"
        />
        <PIcon
          v-else-if="item.icon"
          :name="item.icon"
          :class="pohon.linkLeadingIcon({ class: props.pohon?.linkLeadingIcon, active, disabled: !!item.disabled })"
        />
      </slot>

      <span
        v-if="(!collapsed || orientation !== 'vertical') && (getProp({ object: item, path: props.labelKey as string }) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>])"
        :class="pohon.linkLabel({ class: props.pohon?.linkLabel })"
      >
        <slot
          :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>)"
          :item="item"
          :active="active"
          :index="index"
        >
          {{ getProp({ object: item, path: props.labelKey as string }) }}
        </slot>

        <PIcon
          v-if="item.target === '_blank' && externalIcon !== false"
          :name="isString(externalIcon) ? externalIcon : appConfig.pohon.icons.external"
          :class="pohon.linkLabelExternalIcon({ class: props.pohon?.linkLabelExternalIcon, active })"
        />
      </span>

      <span
        v-if="(!collapsed || orientation !== 'vertical') && (item.badge || (orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (orientation === 'vertical' && item.children?.length) || item.trailingIcon || !!slots[(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>])"
        :class="pohon.linkTrailing({ class: props.pohon?.linkTrailing })"
      >
        <slot
          :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>)"
          :item="item"
          :active="active"
          :index="index"
        >
          <PBadge
            v-if="item.badge"
            color="neutral"
            variant="outline"
            :size="((props.pohon?.linkTrailingBadgeSize || pohon.linkTrailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(isString(item.badge) || isNumber(item.badge)) ? { label: item.badge } : item.badge"
            :class="pohon.linkTrailingBadge({ class: props.pohon?.linkTrailingBadge })"
          />

          <PIcon
            v-if="(orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (orientation === 'vertical' && item.children?.length)"
            :name="item.trailingIcon || trailingIcon || appConfig.pohon.icons.chevronDown"
            :class="pohon.linkTrailingIcon({ class: props.pohon?.linkTrailingIcon, active })"
          />
          <PIcon
            v-else-if="item.trailingIcon"
            :name="item.trailingIcon"
            :class="pohon.linkTrailingIcon({ class: props.pohon?.linkTrailingIcon, active })"
          />
        </slot>
      </span>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index, level = 0 }">
    <component
      :is="(orientation === 'vertical' && item.children?.length && !collapsed) ? PCollapsible : ANavigationMenuItem"
      as="li"
      :value="item.value || String(index)"
      :default-open="item.defaultOpen"
      :unmount-on-hide="(orientation === 'vertical' && item.children?.length && !collapsed) ? unmountOnHide : undefined"
      :open="item.open"
    >
      <div
        v-if="orientation === 'vertical' && item.type === 'label'"
        :class="pohon.label({ class: props.pohon?.label })"
      >
        <ReuseLinkTemplate
          :item="item"
          :index="index"
        />
      </div>
      <PLink
        v-else-if="item.type !== 'label'"
        v-slot="{ active, ...slotProps }"
        v-bind="(orientation === 'vertical' && item.children?.length && !collapsed) ? {} : pickLinkProps(item as Omit<NavigationMenuItem, 'type'>)"
        custom
      >
        <component
          :is="(orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) ? ANavigationMenuTrigger : ANavigationMenuLink"
          as-child
          :active="active || item.active"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <PLinkBase
            v-bind="slotProps"
            :class="pohon.link({
              class: [props.pohon?.link, item.class],
              active: active || item.active,
              disabled: !!item.disabled,
              level: orientation === 'horizontal' || level > 0,
            })"
          >
            <ReuseLinkTemplate
              :item="item"
              :active="active || item.active"
              :index="index"
            />
          </PLinkBase>
        </component>

        <ANavigationMenuContent
          v-if="orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])"
          v-bind="contentProps"
          :class="pohon.content({ class: props.pohon?.content })"
        >
          <slot
            :name="((item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>)"
            :item="item"
            :active="active"
            :index="index"
          >
            <ul :class="pohon.childList({ class: props.pohon?.childList })">
              <li
                v-for="(childItem, childIndex) in item.children"
                :key="childIndex"
                :class="pohon.childItem({ class: props.pohon?.childItem })"
              >
                <PLink
                  v-slot="{ active: childActive, ...childSlotProps }"
                  v-bind="pickLinkProps(childItem)"
                  custom
                >
                  <ANavigationMenuLink
                    as-child
                    :active="childActive"
                    @select="childItem.onSelect"
                  >
                    <PLinkBase
                      v-bind="childSlotProps"
                      :class="pohon.childLink({
                        class: [props.pohon?.childLink, childItem.class],
                        active: childActive,
                      })"
                    >
                      <PIcon
                        v-if="childItem.icon"
                        :name="childItem.icon"
                        :class="pohon.childLinkIcon({
                          class: props.pohon?.childLinkIcon,
                          active: childActive,
                        })"
                      />

                      <div :class="pohon.childLinkWrapper({ class: props.pohon?.childLinkWrapper })">
                        <p :class="pohon.childLinkLabel({ class: props.pohon?.childLinkLabel, active: childActive })">
                          {{ getProp({ object: childItem, path: props.labelKey as string }) }}

                          <PIcon
                            v-if="childItem.target === '_blank' && externalIcon !== false"
                            :name="isString(externalIcon) ? externalIcon : appConfig.pohon.icons.external"
                            :class="pohon.childLinkLabelExternalIcon({
                              class: props.pohon?.childLinkLabelExternalIcon,
                              active: childActive,
                            })"
                          />
                        </p>
                        <p
                          v-if="childItem.description"
                          :class="pohon.childLinkDescription({
                            class: props.pohon?.childLinkDescription,
                            active: childActive,
                          })"
                        >
                          {{ childItem.description }}
                        </p>
                      </div>
                    </PLinkBase>
                  </ANavigationMenuLink>
                </PLink>
              </li>
            </ul>
          </slot>
        </ANavigationMenuContent>
      </PLink>

      <template
        v-if="orientation === 'vertical' && item.children?.length && !collapsed"
        #content
      >
        <ul :class="pohon.childList({ class: props.pohon?.childList })">
          <ReuseItemTemplate
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            :item="childItem"
            :index="childIndex"
            :level="level + 1"
            :class="pohon.childItem({ class: props.pohon?.childItem })"
          />
        </ul>
      </template>
    </component>
  </DefineItemTemplate>

  <ANavigationMenuRoot
    v-bind="rootProps"
    :data-collapsed="collapsed"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <template
      v-for="(list, listIndex) in lists"
      :key="`list-${listIndex}`"
    >
      <ANavigationMenuList :class="pohon.list({ class: props.pohon?.list })">
        <ReuseItemTemplate
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :class="pohon.item({ class: props.pohon?.item })"
        />
      </ANavigationMenuList>

      <div
        v-if="orientation === 'vertical' && listIndex < lists.length - 1"
        :class="pohon.separator({ class: props.pohon?.separator })"
      />
    </template>

    <div
      v-if="orientation === 'horizontal'"
      :class="pohon.viewportWrapper({ class: props.pohon?.viewportWrapper })"
    >
      <ANavigationMenuIndicator
        v-if="arrow"
        :class="pohon.indicator({ class: props.pohon?.indicator })"
      >
        <div :class="pohon.arrow({ class: props.pohon?.arrow })" />
      </ANavigationMenuIndicator>

      <ANavigationMenuViewport :class="pohon.viewport({ class: props.pohon?.viewport })" />
    </div>
  </ANavigationMenuRoot>
</template>
