<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps, ATabsRootEmits, ATabsRootProps } from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { AvatarProps } from '../types';
import type { DynamicSlots, PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import tabsTheme from '#build/pohon/tabs';
import { uv } from '../utils/uv';

const appConfigTabs = appConfig_ as AppConfig & {
  pohon: { tabs: Partial<typeof tabsTheme> };
};

const tabsFn = uv({
  extend: uv(tabsTheme),
  ...(appConfigTabs.pohon?.tabs || {}),
});

export interface TabsItem {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  slot?: string;
  content?: string;
  /** A unique value for the tab item. Defaults to the index. */
  value?: string | number;
  disabled?: boolean;
  [key: string]: any;
}

type TabsVariants = VariantProps<typeof tabsFn>;

export interface TabsProps<T extends TabsItem = TabsItem> extends Pick<ATabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  items?: Array<T>;
  /**
   * @defaultValue 'primary'
   */
  color?: TabsVariants['color'];
  /**
   * @defaultValue 'pill'
   */
  variant?: TabsVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: TabsVariants['size'];
  /**
   * The orientation of the tabs.
   * @defaultValue 'horizontal'
   */
  orientation?: ATabsRootProps['orientation'];
  /**
   * The content of the tabs, can be disabled to prevent rendering the content.
   * @defaultValue true
   */
  content?: boolean;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string;
  class?: ClassValue;
  pohon?: PartialString<typeof tabsFn.slots>;
}

export interface TabsEmits extends ATabsRootEmits<string | number> {}

type SlotProps<T extends TabsItem> = (props: { item: T; index: number }) => any;

export type TabsSlots<T extends TabsItem = TabsItem> = {
  leading: SlotProps<T>;
  default: SlotProps<T>;
  trailing: SlotProps<T>;
  content: SlotProps<T>;
} & DynamicSlots<T, undefined, { index: number }>;

</script>

<script setup lang="ts" generic="T extends TabsItem">
import {
  ATabsContent,
  ATabsIndicator,
  ATabsList,
  ATabsRoot,
  ATabsTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { getProp } from '../utils';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<TabsProps<T>>(),
  {
    content: true,
    defaultValue: '0',
    orientation: 'horizontal',
    unmountOnHide: true,
    labelKey: 'label',
  },
);
const emits = defineEmits<TabsEmits>();
const slots = defineSlots<TabsSlots<T>>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'modelValue',
    'defaultValue',
    'orientation',
    'activationMode',
    'unmountOnHide',
  ),
  emits,
);

const pohon = computed(() => tabsFn({
  color: props.color,
  variant: props.variant,
  size: props.size,
  orientation: props.orientation,
}));
</script>

<template>
  <ATabsRoot
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <ATabsList :class="pohon.list({ class: props.pohon?.list })">
      <ATabsIndicator :class="pohon.indicator({ class: props.pohon?.indicator })" />

      <ATabsTrigger
        v-for="(item, index) of items"
        :key="index"
        :value="item.value || String(index)"
        :disabled="item.disabled"
        :class="pohon.trigger({ class: props.pohon?.trigger })"
      >
        <slot
          name="leading"
          :item="item"
          :index="index"
        >
          <PIcon
            v-if="item.icon"
            :name="item.icon"
            :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon })"
          />
          <PAvatar
            v-else-if="item.avatar"
            :size="((props.pohon?.leadingAvatarSize || pohon.leadingAvatarSize()) as AvatarProps['size'])"
            v-bind="item.avatar"
            :class="pohon.leadingAvatar({ class: props.pohon?.leadingAvatar })"
          />
        </slot>

        <span
          v-if="getProp({ object: item, path: props.labelKey as string }) || !!slots.default"
          :class="pohon.label({ class: props.pohon?.label })"
        >
          <slot
            :item="item"
            :index="index"
          >{{ getProp({ object: item, path: props.labelKey as string }) }}</slot>
        </span>

        <slot
          name="trailing"
          :item="item"
          :index="index"
        />
      </ATabsTrigger>
    </ATabsList>

    <template v-if="!!content">
      <ATabsContent
        v-for="(item, index) of items"
        :key="index"
        :value="item.value || String(index)"
        :class="pohon.content({ class: props.pohon?.content })"
      >
        <slot
          :name="((item.slot || 'content') as keyof TabsSlots<T>)"
          :item="(item as Extract<T, { slot: string; }>)"
          :index="index"
        >
          {{ item.content }}
        </slot>
      </ATabsContent>
    </template>
  </ATabsRoot>
</template>
