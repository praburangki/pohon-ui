<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { AListboxRootEmits, AListboxRootProps, APrimitiveProps } from '@vinicunca/akar';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import type { FuseResult } from 'fuse.js';
import type { ClassValue } from 'unocss-variants';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps, ButtonProps, ChipProps, InputProps, KbdProps, LinkProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import commandPaletteTheme from '#build/pohon/command-palette';
import { uv } from '../utils/uv';

const appConfigCommandPalette = appConfig_ as AppConfig & {
  pohon: { commandPalette: Partial<typeof commandPaletteTheme> };
};

const commandPaletteFn = uv({
  extend: uv(commandPaletteTheme),
  ...(appConfigCommandPalette.pohon?.commandPalette || {}),
});

export interface CommandPaletteItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  prefix?: string;
  label?: string;
  suffix?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  chip?: ChipProps;
  kbds?: Array<KbdProps['value']> | Array<KbdProps>;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
  slot?: string;
  onSelect?: (e?: Event) => void;
  [key: string]: any;
}

export interface CommandPaletteGroup<T> {
  id: string;
  label?: string;
  slot?: string;
  items?: Array<T>;
  /**
   * Whether to filter group items with [useFuse](https://vueuse.org/integrations/useFuse).
   * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean;
  /** Filter group items after the search happened. */
  postFilter?: (searchTerm: string, items: Array<T>) => Array<T>;
  /**
   * The icon displayed when an item is highlighted.
   * @IconifyIcon
   */
  highlightedIcon?: string;
}

export interface CommandPaletteProps<G, T> extends Pick<AListboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'highlightOnHover'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * The icon displayed in the input.
   * @defaultValue appConfig.pohon.icons.search
   * @IconifyIcon
   */
  icon?: string;
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.pohon.icons.check
   * @IconifyIcon
   */
  selectedIcon?: string;
  /**
   * The placeholder text for the input.
   * @defaultValue t('commandPalette.placeholder')
   */
  placeholder?: InputProps['placeholder'];
  /**
   * Automatically focus the input when component is mounted.
   * @defaultValue true
   */
  autofocus?: boolean;
  /**
   * Display a close button in the input (useful when inside a dialog for example).
   * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
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
  groups?: Array<G>;
  /**
   * Options for [useFuse](https://vueuse.org/integrations/useFuse).
   * @defaultValue {
      fuseOptions: {
        ignoreLocation: true,
        threshold: 0.1,
        keys: ['label', 'suffix']
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true
    }
   */
  fuse?: UseFuseOptions<T>;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string;
  class?: ClassValue;
  pohon?: PartialString<typeof commandPaletteFn.slots>;
}

export type CommandPaletteEmits<T> = AListboxRootEmits<T> & {
  'update:open': [value: boolean];
};

type SlotProps<T> = (props: { item: T; index: number }) => any;

export type CommandPaletteSlots<G extends { slot?: string }, T extends { slot?: string }> = {
  'empty': (props: { searchTerm?: string }) => any;
  'close': (props: { pohon: ReturnType<typeof commandPaletteFn> }) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
} & Record<string, SlotProps<G>> & Record<string, SlotProps<T>>;
</script>

<script setup lang="ts" generic="G extends CommandPaletteGroup<T>, T extends CommandPaletteItem">
import { useAppConfig } from '#imports';
import {
  AListboxContent,
  AListboxFilter,
  AListboxGroup,
  AListboxGroupLabel,
  AListboxItem,
  AListboxItemIndicator,
  AListboxRoot,
  useForwardProps,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { isFunction, isString, omit } from '@vinicunca/perkakas';
import { reactivePick } from '@vueuse/core';
import { useFuse } from '@vueuse/integrations/useFuse';
import { defu } from 'defu';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import { getProp } from '../utils';
import { highlight } from '../utils/util.fuse';
import { pickLinkProps } from '../utils/util.link';
import PAvatar from './avatar.vue';
import PButton from './button.vue';
import PChip from './chip.vue';
import PIcon from './icon.vue';
import PInput from './input.vue';
import PKbd from './kbd.vue';
import PLinkBase from './link-base.vue';
import PLink from './link.vue';

const props = withDefaults(
  defineProps<CommandPaletteProps<G, T>>(),
  {
    modelValue: '',
    labelKey: 'label',
    autofocus: true,
  },
);
const emits = defineEmits<CommandPaletteEmits<T>>();
const slots = defineSlots<CommandPaletteSlots<G, T>>();

const searchTerm = defineModel<string>('searchTerm', { default: '' });

const { t } = useLocale();
const appConfig = useAppConfig();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'disabled',
    'multiple',
    'modelValue',
    'defaultValue',
    'highlightOnHover',
  ),
  emits,
);
const inputProps = useForwardProps(
  reactivePick(props, 'loading', 'loadingIcon'),
);

const pohon = commandPaletteFn();

const fuse = computed(() =>
  defu(
    {},
    props.fuse,
    {
      fuseOptions: {
        ignoreLocation: true,
        threshold: 0.1,
        keys: [props.labelKey, 'suffix'],
      },
      resultLimit: 12,
      matchAllWhenSearchEmpty: true,
    },
  ),
);

const items = computed(
  () => props.groups?.filter((group) => {
    if (!group.id) {
      console.warn('[@vinicuna/akar] CommandPalette group is missing an `id` property');
      return false;
    }

    return !group.ignoreFilter;
  }).flatMap(
    (group) => group.items?.map(
      (item) => ({ ...item, group: group.id }),
    ) || [],
  ) || [],
);

const { results: fuseResults } = useFuse<typeof items.value[number]>(searchTerm, items, fuse);

function getGroupWithItems(group: G, items: Array<T & { matches?: FuseResult<T>['matches'] }>) {
  if (group?.postFilter && isFunction(group.postFilter)) {
    items = group.postFilter(searchTerm.value, items);
  }

  return {
    ...group,
    items: items.slice(0, fuse.value.resultLimit).map((item) => {
      return {
        ...item,
        labelHtml: highlight<T>({ item, searchTerm: searchTerm.value, forceKey: props.labelKey }),
        suffixHtml: highlight<T>({ item, searchTerm: searchTerm.value, forceKey: undefined, omitKeys: [props.labelKey] }),
      };
    }),
  };
}

const groups = computed(() => {
  const groupsById = fuseResults.value.reduce((acc, result) => {
    const { item, matches } = result;
    if (!item.group) {
      return acc;
    }

    acc[item.group] ||= [];
    acc[item.group]?.push({ ...item, matches });

    return acc;
  }, {} as Record<string, Array<T & { matches?: FuseResult<T>['matches'] }>>);

  const fuseGroups = Object.entries(groupsById).map(([id, items]) => {
    const group = props.groups?.find((group) => group.id === id);
    if (!group) {
      return undefined;
    }

    return getGroupWithItems(group, items);
  }).filter((group) => !!group);

  const nonFuseGroups = props.groups
    ?.map((group, index) => ({ ...group, index }))
    ?.filter((group) => group.ignoreFilter && group.items?.length)
    ?.map((group) => ({ ...getGroupWithItems(group, group.items || []), index: group.index })) || [];

  return nonFuseGroups.reduce((acc, group) => {
    acc.splice(group.index, 0, group);
    return acc;
  }, [...fuseGroups]);
});
</script>

<template>
  <AListboxRoot
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <AListboxFilter
      v-model="searchTerm"
      as-child
    >
      <PInput
        :placeholder="placeholder || t('commandPalette.placeholder')"
        variant="none"
        :autofocus="autofocus"
        size="lg"
        v-bind="inputProps"
        :icon="icon || appConfig.pohon.icons.search"
        :class="pohon.input({ class: props.pohon?.input })"
      >
        <template
          v-if="close || !!slots.close"
          #trailing
        >
          <slot
            name="close"
            :pohon="pohon"
          >
            <PButton
              v-if="close"
              :icon="closeIcon || appConfig.pohon.icons.close"
              size="md"
              color="neutral"
              variant="ghost"
              :aria-label="t('commandPalette.close')"
              v-bind="typeof close === 'object' ? close as Partial<ButtonProps> : {}"
              :class="pohon.close({ class: props.pohon?.close })"
              @click="emits('update:open', false)"
            />
          </slot>
        </template>
      </PInput>
    </AListboxFilter>

    <AListboxContent :class="pohon.content({ class: props.pohon?.content })">
      <div
        v-if="groups?.length"
        :class="pohon.viewport({ class: props.pohon?.viewport })"
      >
        <AListboxGroup
          v-for="group in groups"
          :key="`group-${group.id}`"
          :class="pohon.group({ class: props.pohon?.group })"
        >
          <AListboxGroupLabel
            v-if="getProp({ object: group, path: props.labelKey as string })"
            :class="pohon.label({ class: props.pohon?.label })"
          >
            {{ getProp({ object: group, path: props.labelKey as string }) }}
          </AListboxGroupLabel>

          <AListboxItem
            v-for="(item, index) in group.items"
            :key="`group-${group.id}-${index}`"
            :value="omit(item, ['matches', 'group', 'onSelect', 'labelHtml', 'suffixHtml'])"
            :disabled="item.disabled"
            as-child
            @select="item.onSelect"
          >
            <PLink
              v-slot="{ active, ...slotProps }"
              v-bind="pickLinkProps(item)"
              custom
            >
              <PLinkBase
                v-bind="slotProps"
                :class="pohon.item({ class: props.pohon?.item, active: active || item.active })"
              >
                <slot
                  :name="((item.slot || group.slot || 'item') as keyof CommandPaletteSlots<G, T>)"
                  :item="(item as any)"
                  :index="index"
                >
                  <slot
                    :name="((item.slot ? `${item.slot}-leading` : group.slot ? `${group.slot}-leading` : `item-leading`) as keyof CommandPaletteSlots<G, T>)"
                    :item="(item as any)"
                    :index="index"
                  >
                    <PIcon
                      v-if="item.loading"
                      :name="loadingIcon || appConfig.pohon.icons.loading"
                      :class="pohon.itemLeadingIcon({ class: props.pohon?.itemLeadingIcon, loading: true })"
                    />
                    <PIcon
                      v-else-if="item.icon"
                      :name="item.icon"
                      :class="pohon.itemLeadingIcon({ class: props.pohon?.itemLeadingIcon, active: active || item.active })"
                    />
                    <PAvatar
                      v-else-if="item.avatar"
                      :size="((props.pohon?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size'])"
                      v-bind="item.avatar"
                      :class="pohon.itemLeadingAvatar({ class: props.pohon?.itemLeadingAvatar, active: active || item.active })"
                    />
                    <PChip
                      v-else-if="item.chip"
                      :size="((props.pohon?.itemLeadingChipSize || pohon.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="pohon.itemLeadingChip({ class: props.pohon?.itemLeadingChip, active: active || item.active })"
                    />
                  </slot>

                  <span
                    v-if="item.labelHtml || getProp({ object: item, path: props.labelKey as string }) || !!slots[(item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>]"
                    :class="pohon.itemLabel({ class: props.pohon?.itemLabel, active: active || item.active })"
                  >
                    <slot
                      :name="((item.slot ? `${item.slot}-label` : group.slot ? `${group.slot}-label` : `item-label`) as keyof CommandPaletteSlots<G, T>)"
                      :item="(item as any)"
                      :index="index"
                    >
                      <span
                        v-if="item.prefix"
                        :class="pohon.itemLabelPrefix({ class: props.pohon?.itemLabelPrefix })"
                      >{{ item.prefix }}</span>

                      <span
                        :class="pohon.itemLabelBase({ class: props.pohon?.itemLabelBase, active: active || item.active })"
                        v-html="item.labelHtml || getProp({ object: item, path: props.labelKey as string })"
                      />

                      <span
                        :class="pohon.itemLabelSuffix({ class: props.pohon?.itemLabelSuffix, active: active || item.active })"
                        v-html="item.suffixHtml || item.suffix"
                      />
                    </slot>
                  </span>

                  <span :class="pohon.itemTrailing({ class: props.pohon?.itemTrailing })">
                    <slot
                      :name="((item.slot ? `${item.slot}-trailing` : group.slot ? `${group.slot}-trailing` : `item-trailing`) as keyof CommandPaletteSlots<G, T>)"
                      :item="(item as any)"
                      :index="index"
                    >
                      <span
                        v-if="item.kbds?.length"
                        :class="pohon.itemTrailingKbds({ class: props.pohon?.itemTrailingKbds })"
                      >
                        <PKbd
                          v-for="(kbd, kbdIndex) in item.kbds"
                          :key="kbdIndex"
                          :size="((props.pohon?.itemTrailingKbdsSize || pohon.itemTrailingKbdsSize()) as KbdProps['size'])"
                          v-bind="isString(kbd) ? { value: kbd } : kbd"
                        />
                      </span>
                      <PIcon
                        v-else-if="group.highlightedIcon"
                        :name="group.highlightedIcon"
                        :class="pohon.itemTrailingHighlightedIcon({ class: props.pohon?.itemTrailingHighlightedIcon })"
                      />
                    </slot>

                    <AListboxItemIndicator as-child>
                      <PIcon
                        :name="selectedIcon || appConfig.pohon.icons.check"
                        :class="pohon.itemTrailingIcon({ class: props.pohon?.itemTrailingIcon })"
                      />
                    </AListboxItemIndicator>
                  </span>
                </slot>
              </PLinkBase>
            </PLink>
          </AListboxItem>
        </AListboxGroup>
      </div>

      <div
        v-else
        :class="pohon.empty({ class: props.pohon?.empty })"
      >
        <slot
          name="empty"
          :search-term="searchTerm"
        >
          {{ searchTerm ? t('commandPalette.noMatch', { searchTerm }) : t('commandPalette.noData') }}
        </slot>
      </div>
    </AListboxContent>
  </AListboxRoot>
</template>
