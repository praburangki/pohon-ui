<script lang="ts">
import type {
  ADropdownMenuContentEmits as AkarDropdownMenuContentEmits,
  ADropdownMenuContentProps as AkarDropdownMenuContentProps,
} from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { AvatarProps, DropdownMenuItem, DropdownMenuSlots, KbdProps } from '../types';
import type { ArrayOrNested, NestedItem } from '../types/type.utils';
import dropdownMenuTheme from '#build/pohon/dropdown-menu';
import { uv } from '../utils/uv';

const _dropdownMenu = uv(dropdownMenuTheme)();

interface DropdownMenuContentProps<T extends ArrayOrNested<DropdownMenuItem>> extends Omit<AkarDropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
  items?: T;
  portal?: boolean;
  sub?: boolean;
  labelKey: keyof NestedItem<T>;
  /**
   * @IconifyIcon
   */
  checkedIcon?: string;
  /**
   * @IconifyIcon
   */
  loadingIcon?: string;
  /**
   * @IconifyIcon
   */
  externalIcon?: boolean | string;
  class?: ClassValue;
  pohon: typeof _dropdownMenu;
  pohonOverride?: any;
}

interface DropdownMenuContentEmits extends AkarDropdownMenuContentEmits {}

type DropdownMenuContentSlots<T extends ArrayOrNested<DropdownMenuItem>> = Omit<DropdownMenuSlots<T>, 'default'> & {
  default: (props?: {}) => any;
};
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<DropdownMenuItem>">
import { useAppConfig } from '#imports';
import { useForwardPropsEmits } from '@vinicunca/akar';
import { ADropdownMenu } from '@vinicunca/akar/namespaced';
import { isString, omit } from '@vinicunca/perkakas';
import { createReusableTemplate, reactiveOmit } from '@vueuse/core';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import { getProp, isArrayOfArray } from '../utils';
import { pickLinkProps } from '../utils/util.link';
import PAvatar from './avatar.vue';

// eslint-disable-next-line import/no-self-import
import PDropdownMenuContent from './dropdown-menu-content.vue';
import PIcon from './icon.vue';
import PKbd from './kbd.vue';
import PLinkBase from './link-base.vue';
import PLink from './link.vue';

const props = defineProps<DropdownMenuContentProps<T>>();
const emits = defineEmits<DropdownMenuContentEmits>();
const slots = defineSlots<DropdownMenuContentSlots<T>>();

const appConfig = useAppConfig();
const { dir } = useLocale();
const contentProps = useForwardPropsEmits(
  reactiveOmit(
    props,
    'sub',
    'items',
    'portal',
    'labelKey',
    'checkedIcon',
    'loadingIcon',
    'externalIcon',
    'class',
    'pohon',
    'pohonOverride',
  ),
  emits,
);
const proxySlots = omit(slots, ['default']);

const [
  DefineItemTemplate,
  ReuseItemTemplate,
] = createReusableTemplate<{ item: DropdownMenuItem; active?: boolean; index: number }>();

const childrenIcon = computed(() =>
  dir.value === 'rtl'
    ? appConfig.pohon.icons.chevronLeft
    : appConfig.pohon.icons.chevronRight,
);
const groups = computed<Array<Array<DropdownMenuItem>>>(() => {
  if (props.items?.length) {
    return isArrayOfArray(props.items)
      ? props.items
      : [props.items];
  }

  return [];
});
</script>

<template>
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot
      :name="((item.slot || 'item') as keyof DropdownMenuContentSlots<T>)"
      :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
      :index="index"
    >
      <slot
        :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof DropdownMenuContentSlots<T>)"
        :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
        :active="active"
        :index="index"
      >
        <PIcon
          v-if="item.loading"
          :name="loadingIcon || appConfig.pohon.icons.loading"
          :class="pohon.itemLeadingIcon({ class: pohonOverride?.itemLeadingIcon, color: item?.color, loading: true })"
        />
        <PIcon
          v-else-if="item.icon"
          :name="item.icon"
          :class="pohon.itemLeadingIcon({ class: pohonOverride?.itemLeadingIcon, color: item?.color, active })"
        />
        <PAvatar
          v-else-if="item.avatar"
          :size="((props.pohonOverride?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size'])"
          v-bind="item.avatar"
          :class="pohon.itemLeadingAvatar({ class: pohonOverride?.itemLeadingAvatar, active })"
        />
      </slot>

      <span
        v-if="getProp({ object: item, path: props.labelKey as string }) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof DropdownMenuContentSlots<T>]"
        :class="pohon.itemLabel({ class: pohonOverride?.itemLabel, active })"
      >
        <slot
          :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof DropdownMenuContentSlots<T>)"
          :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
          :active="active"
          :index="index"
        >
          {{ getProp({ object: item, path: props.labelKey as string }) }}
        </slot>

        <PIcon
          v-if="item.target === '_blank' && externalIcon !== false"
          :name="isString(externalIcon) ? externalIcon : appConfig.pohon.icons.external"
          :class="pohon.itemLabelExternalIcon({ class: pohonOverride?.itemLabelExternalIcon, color: item?.color, active })"
        />
      </span>

      <span :class="pohon.itemTrailing({ class: pohonOverride?.itemTrailing })">
        <slot
          :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof DropdownMenuContentSlots<T>)"
          :item="(item as Extract<NestedItem<T>, { slot: string; }>)"
          :active="active"
          :index="index"
        >
          <PIcon
            v-if="item.children?.length"
            :name="childrenIcon"
            :class="pohon.itemTrailingIcon({ class: pohonOverride?.itemTrailingIcon, color: item?.color, active })"
          />
          <span
            v-else-if="item.kbds?.length"
            :class="pohon.itemTrailingKbds({ class: pohonOverride?.itemTrailingKbds })"
          >
            <PKbd
              v-for="(kbd, kbdIndex) in item.kbds"
              :key="kbdIndex"
              :size="((props.pohonOverride?.itemTrailingKbdsSize || pohon.itemTrailingKbdsSize()) as KbdProps['size'])"
              v-bind="isString(kbd) ? { value: kbd } : kbd"
            />
          </span>
        </slot>

        <ADropdownMenu.ItemIndicator as-child>
          <PIcon
            :name="checkedIcon || appConfig.pohon.icons.check"
            :class="pohon.itemTrailingIcon({ class: pohonOverride?.itemTrailingIcon, color: item?.color })"
          />
        </ADropdownMenu.ItemIndicator>
      </span>
    </slot>
  </DefineItemTemplate>

  <ADropdownMenu.Portal :disabled="!portal">
    <component
      :is="sub ? ADropdownMenu.SubContent : ADropdownMenu.Content"
      :class="props.class"
      v-bind="contentProps"
    >
      <ADropdownMenu.Group
        v-for="(group, groupIndex) in groups"
        :key="`group-${groupIndex}`"
        :class="pohon.group({ class: pohonOverride?.group })"
      >
        <template
          v-for="(item, index) in group"
          :key="`group-${groupIndex}-${index}`"
        >
          <ADropdownMenu.Label
            v-if="item.type === 'label'"
            :class="pohon.label({ class: pohonOverride?.label })"
          >
            <ReuseItemTemplate
              :item="item"
              :index="index"
            />
          </ADropdownMenu.Label>
          <ADropdownMenu.Separator
            v-else-if="item.type === 'separator'"
            :class="pohon.separator({ class: pohonOverride?.separator })"
          />
          <ADropdownMenu.Sub
            v-else-if="item?.children?.length"
            :open="item.open"
            :default-open="item.defaultOpen"
          >
            <ADropdownMenu.SubTrigger
              as="button"
              type="button"
              :disabled="item.disabled"
              :text-value="getProp({ object: item, path: props.labelKey as string })"
              :class="pohon.item({ class: pohonOverride?.item, color: item?.color })"
            >
              <ReuseItemTemplate
                :item="item"
                :index="index"
              />
            </ADropdownMenu.SubTrigger>

            <PDropdownMenuContent
              sub
              :class="props.class"
              :pohon="pohon"
              :pohon-override="pohonOverride"
              :portal="portal"
              :items="(item.children as T)"
              align="start"
              :align-offset="-4"
              :side-offset="3"
              :label-key="labelKey"
              :checked-icon="checkedIcon"
              :loading-icon="loadingIcon"
              :external-icon="externalIcon"
              v-bind="item.content"
            >
              <template
                v-for="(_, name) in proxySlots"
                #[name]="slotData"
              >
                <slot
                  :name="(name as keyof DropdownMenuContentSlots<T>)"
                  v-bind="slotData"
                />
              </template>
            </PDropdownMenuContent>
          </ADropdownMenu.Sub>
          <ADropdownMenu.CheckboxItem
            v-else-if="item.type === 'checkbox'"
            :model-value="item.checked"
            :disabled="item.disabled"
            :text-value="getProp({ object: item, path: props.labelKey as string })"
            :class="pohon.item({ class: [pohonOverride?.item, item.class], color: item?.color })"
            @update:model-value="item.onUpdateChecked"
            @select="item.onSelect"
          >
            <ReuseItemTemplate
              :item="item"
              :index="index"
            />
          </ADropdownMenu.CheckboxItem>
          <ADropdownMenu.Item
            v-else
            as-child
            :disabled="item.disabled"
            :text-value="getProp({ object: item, path: props.labelKey as string })"
            @select="item.onSelect"
          >
            <PLink
              v-slot="{ active, ...slotProps }"
              v-bind="pickLinkProps(item as Omit<DropdownMenuItem, 'type'>)"
              custom
            >
              <PLinkBase
                v-bind="slotProps"
                :class="pohon.item({ class: [pohonOverride?.item, item.class], color: item?.color, active })"
              >
                <ReuseItemTemplate
                  :item="item"
                  :active="active"
                  :index="index"
                />
              </PLinkBase>
            </PLink>
          </ADropdownMenu.Item>
        </template>
      </ADropdownMenu.Group>

      <slot />
    </component>
  </ADropdownMenu.Portal>
</template>
