<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { AvatarProps, LinkProps } from '../types';
import type { DynamicSlots, PartialString } from '../types/type.utils';
import _appConfig from '#build/app.config';
import breadcrumbTheme from '#build/pohon/breadcrumb';
import { uv } from '../utils/uv';

const appConfigBreadcrumb = _appConfig as AppConfig & {
  pohon: { breadcrumb: Partial<typeof breadcrumbTheme> };
};

const breadcrumb = uv({
  extend: uv(breadcrumbTheme),
  ...(appConfigBreadcrumb.pohon?.breadcrumb || {}),
});

export interface BreadcrumbItem extends Omit<LinkProps, 'raw' | 'custom'> {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  slot?: string;
  [key: string]: any;
}

export interface BreadcrumbProps<T extends BreadcrumbItem = BreadcrumbItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: APrimitiveProps['as'];
  items?: Array<T>;
  /**
   * The icon to use as a separator.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  separatorIcon?: string;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string;
  class?: ClassValue;
  pohon?: PartialString<typeof breadcrumb.slots>;
}

type SlotProps<T extends BreadcrumbItem> = (props: { item: T; index: number; active?: boolean }) => any;

export type BreadcrumbSlots<T extends BreadcrumbItem = BreadcrumbItem> = {
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
  'separator': any;
} & DynamicSlots<T, 'leading' | 'label' | 'trailing', { index: number; active?: boolean }>;
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
import { useAppConfig } from '#imports';
import { APrimitive } from '@vinicunca/akar';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import { getProp } from '../utils';
import { pickLinkProps } from '../utils/util.link';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';
import PLinkBase from './link-base.vue';
import PLink from './link.vue';

const props = withDefaults(
  defineProps<BreadcrumbProps<T>>(),
  {
    as: 'nav',
    labelKey: 'label',
  },
);

const slots = defineSlots<BreadcrumbSlots<T>>();
const { dir } = useLocale();
const appConfig = useAppConfig();

const separatorIcon = computed(() =>
  props.separatorIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronLeft
      : appConfig.pohon.icons.chevronRight
  ),
);

const pohon = breadcrumb();
</script>

<template>
  <APrimitive
    :as="as"
    aria-label="breadcrumb"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <ol :class="pohon.list({ class: props.pohon?.list })">
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <li :class="pohon.item({ class: props.pohon?.item })">
          <PLink
            v-slot="{ active, ...slotProps }"
            v-bind="pickLinkProps(item)"
            custom
          >
            <PLinkBase
              v-bind="slotProps"
              as="span"
              :aria-current="active && (index === items!.length - 1) ? 'page' : undefined"
              :class="pohon.link({ class: [props.pohon?.link, item.class], active: index === items!.length - 1, disabled: !!item.disabled, to: !!item.to })"
            >
              <slot
                :name="(item.slot || 'item') as keyof BreadcrumbSlots<T>"
                :item="item"
                :index="index"
              >
                <slot
                  :name="(item.slot ? `${item.slot}-leading` : 'item-leading') as keyof BreadcrumbSlots<T>"
                  :item="item"
                  :active="index === items!.length - 1"
                  :index="index"
                >
                  <PIcon
                    v-if="item.icon"
                    :name="item.icon"
                    :class="pohon.linkLeadingIcon({ class: props.pohon?.linkLeadingIcon, active: index === items!.length - 1 })"
                  />
                  <PAvatar
                    v-else-if="item.avatar"
                    :size="(props.pohon?.linkLeadingAvatarSize || pohon.linkLeadingAvatarSize()) as AvatarProps['size']"
                    v-bind="item.avatar"
                    :class="pohon.linkLeadingAvatar({ class: props.pohon?.linkLeadingAvatar, active: index === items!.length - 1 })"
                  />
                </slot>

                <span
                  v-if="getProp({ object: item, path: props.labelKey as string }) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof BreadcrumbSlots<T>]"
                  :class="pohon.linkLabel({ class: props.pohon?.linkLabel })"
                >
                  <slot
                    :name="(item.slot ? `${item.slot}-label` : 'item-label') as keyof BreadcrumbSlots<T>"
                    :item="item"
                    :active="index === items!.length - 1"
                    :index="index"
                  >
                    {{ getProp({ object: item, path: props.labelKey as string }) }}
                  </slot>
                </span>

                <slot
                  :name="(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof BreadcrumbSlots<T>"
                  :item="item"
                  :active="index === items!.length - 1"
                  :index="index"
                />
              </slot>
            </PLinkBase>
          </PLink>
        </li>

        <li
          v-if="index < items!.length - 1"
          role="presentation"
          aria-hidden="true"
          :class="pohon.separator({ class: props.pohon?.separator })"
        >
          <slot name="separator">
            <PIcon
              :name="separatorIcon"
              :class="pohon.separatorIcon({ class: props.pohon?.separatorIcon })"
            />
          </slot>
        </li>
      </template>
    </ol>
  </APrimitive>
</template>
