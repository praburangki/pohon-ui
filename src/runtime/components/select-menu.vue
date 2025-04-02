<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  AComboboxArrowProps,
  AComboboxContentEmits,
  AComboboxContentProps,
  AComboboxRootEmits,
  AComboboxRootProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps, ChipProps, InputProps } from '../types';
import type {
  AcceptableValue,
  ArrayOrNested,
  EmitsToProps,
  GetItemKeys,
  GetItemValue,
  GetModelValue,
  GetModelValueEmits,
  NestedItem,
  PartialString,
} from '../types/type.utils';
import appConfig_ from '#build/app.config';
import selectMenuTheme from '#build/pohon/select-menu';
import { uv } from '../utils/uv';

const appConfigSelectMenu = appConfig_ as AppConfig & { pohon: { selectMenu: Partial<typeof selectMenuTheme> } };

const selectMenuFn = uv({
  extend: uv(selectMenuTheme),
  ...(appConfigSelectMenu.pohon?.selectMenu || {}),
});

interface SelectMenuItemInternal {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  avatar?: AvatarProps;
  chip?: ChipProps;
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item';
  value?: string | number;
  disabled?: boolean;
  onSelect?: (e?: Event) => void;
  [key: string]: any;
}
export type SelectMenuItem = SelectMenuItemInternal | AcceptableValue | boolean;

type SelectMenuVariants = VariantProps<typeof selectMenuFn>;

export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<AComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'highlightOnHover'>, UseComponentIconsProps {
  id?: string;
  /** The placeholder text when the select is empty. */
  placeholder?: string;
  /**
   * Whether to display the search input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * @defaultValue true
   */
  searchInput?: boolean | InputProps;
  /**
   * @defaultValue 'primary'
   */
  color?: SelectMenuVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: SelectMenuVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: SelectMenuVariants['size'];
  required?: boolean;
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.pohon.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.pohon.icons.check
   * @IconifyIcon
   */
  selectedIcon?: string;
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<AComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<AComboboxContentEmits>>;
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   * @IconifyIcon
   */
  arrow?: boolean | Omit<AComboboxArrowProps, 'as' | 'asChild'>;
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK;
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>;
  items?: T;
  /** The value of the SelectMenu when initially rendered. Use when you do not need to control the state of the SelectMenu. */
  defaultValue?: GetModelValue<T, VK, M>;
  /** The controlled value of the SelectMenu. Can be binded-with with `v-model`. */
  modelValue?: GetModelValue<T, VK, M>;
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean;
  /** Highlight the ring color like a focus state. */
  highlight?: boolean;
  /**
   * Determines if custom user input that does not exist in options can be added.
   * @defaultValue false
   */
  createItem?: boolean | 'always' | { position?: 'top' | 'bottom'; when?: 'empty' | 'always' };
  /**
   * Fields to filter items by.
   * @defaultValue [labelKey]
   */
  filterFields?: Array<string>;
  /**
   * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof selectMenuFn.slots>;
}

export type SelectMenuEmits<A extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<AComboboxRootEmits, 'update:open'> & {
  change: [payload: Event];
  blur: [payload: FocusEvent];
  focus: [payload: FocusEvent];
  create: [item: string];
  /** Event handler when highlighted element changes. */
  highlight: [payload: {
    ref: HTMLElement;
    value: GetModelValue<A, VK, M>;
  } | undefined];
} & GetModelValueEmits<A, VK, M>;

type SlotProps<T extends SelectMenuItem> = (props: { item: T; index: number }) => any;

export interface SelectMenuSlots<
  A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>,
> {
  'leading': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof selectMenuFn> }) => any;
  'default': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean }) => any;
  'trailing': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof selectMenuFn> }) => any;
  'empty': (props: { searchTerm?: string }) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
  'create-item-label': (props: { item: string }) => any;
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
import { useAppConfig } from '#imports';
import {
  AComboboxAnchor,
  AComboboxArrow,
  AComboboxContent,
  AComboboxEmpty,
  AComboboxGroup,
  AComboboxInput,
  AComboboxItem,
  AComboboxItemIndicator,
  AComboboxLabel,
  AComboboxPortal,
  AComboboxRoot,
  AComboboxSeparator,
  AComboboxTrigger,
  AComboboxViewport,
  AFocusScope,
  useFilter,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { createReusableTemplate, reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { computed, toRaw, toRef } from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import { useFormField } from '../composables/use-form-field';
import { useLocale } from '../composables/use-locale';
import { compare, getProp, isArrayOfArray } from '../utils';
import PAvatar from './avatar.vue';
import PChip from './chip.vue';
import PIcon from './icon.vue';
import PInput from './input.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<SelectMenuProps<T, VK, M>>(),
  {
    portal: true,
    searchInput: true,
    labelKey: 'label' as never,
    resetSearchTermOnBlur: true,
  },
);
const emits = defineEmits<SelectMenuEmits<T, VK, M>>();
const slots = defineSlots<SelectMenuSlots<T, VK, M>>();

const searchTerm = defineModel<string>('searchTerm', { default: '' });

const { t } = useLocale();
const appConfig = useAppConfig();
const { contains } = useFilter({ sensitivity: 'base' });

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'modelValue',
    'defaultValue',
    'open',
    'defaultOpen',
    'required',
    'multiple',
    'resetSearchTermOnBlur',
    'highlightOnHover',
  ),
  emits,
);
const contentProps = toRef(() =>
  defu(props.content, {
    side: 'bottom',
    sideOffset: 8,
    collisionPadding: 8,
    position: 'popper',
  }) as AComboboxContentProps,
);
const arrowProps = toRef(() => props.arrow as AComboboxArrowProps);
const searchInputProps = toRef(() =>
  defu(props.searchInput, { placeholder: t('selectMenu.search'), variant: 'none' }) as InputProps,
);

const {
  emitFormBlur,
  emitFormFocus,
  emitFormInput,
  emitFormChange,
  size: formGroupSize,
  color,
  id,
  name,
  highlight,
  disabled,
  ariaAttrs,
} = useFormField<InputProps>(props);
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props);
const {
  isLeading,
  isTrailing,
  leadingIconName,
  trailingIconName,
} = useComponentIcons(toRef(() =>
  defu(
    props,
    { trailingIcon: appConfig.pohon.icons.chevronDown },
  )),
);

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value);

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();

const pohon = computed(() => selectMenuFn({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value,
}));

function displayValue(value: GetItemValue<T, VK> | Array<GetItemValue<T, VK>>): string {
  if (props.multiple && Array.isArray(value)) {
    return value.map((v) => displayValue(v)).filter(Boolean).join(', ');
  }

  if (!props.valueKey) {
    return value && (
      typeof value === 'object'
        ? getProp({ object: value, path: props.labelKey as string })
        : value
    );
  }

  const item = items.value.find((item) => compare({
    value: typeof item === 'object'
      ? getProp({ object: item as Record<string, any>, path: props.valueKey as string })
      : item,
    currentValue: value,
  }));

  return item && (
    typeof item === 'object'
      ? getProp({ object: item, path: props.labelKey as string })
      : item
  );
}

const groups = computed<Array<Array<SelectMenuItem>>>(() => {
  if (props.items?.length) {
    return isArrayOfArray(props.items)
      ? props.items
      : [props.items];
  }

  return [];
});

const items = computed(() => groups.value.flatMap((group) => group) as Array<T>);

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }

  const fields = Array.isArray(props.filterFields)
    ? props.filterFields
    : [props.labelKey] as Array<string>;

  return groups.value.map((items) =>
    items.filter((item) => {
      if (typeof item !== 'object' || item === null) {
        return contains({
          string: String(item),
          substring: searchTerm.value,
        });
      }

      if (item.type && ['label', 'separator'].includes(item.type)) {
        return true;
      }

      return fields.some((field) =>
        contains({
          string: getProp({ object: item, path: field }),
          substring: searchTerm.value,
        }),
      );
    }),
  ).filter((group) =>
    group.filter((item) =>
      !isSelectItem(item) || (!item.type || !['label', 'separator'].includes(item.type)),
    ).length > 0,
  );
});
const filteredItems = computed(() => filteredGroups.value.flatMap((group) => group));

const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false;
  }

  const newItem = props.valueKey
    ? { [props.valueKey]: searchTerm.value } as NestedItem<T>
    : searchTerm.value;

  if (
    (typeof props.createItem === 'object' && props.createItem.when === 'always')
    || props.createItem === 'always'
  ) {
    return !filteredItems.value.find((item) => compare({
      value: item,
      currentValue: newItem,
      comparator: String(props.valueKey),
    }));
  }

  return !filteredItems.value.length;
});

const createItemPosition = computed(() => typeof props.createItem === 'object' ? props.createItem.position : 'bottom');

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return;
  }
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);
  emitFormChange();
  emitFormInput();
}

function onUpdateOpen(value: boolean) {
  let timeoutId;

  if (!value) {
    const event = new FocusEvent('blur');

    emits('blur', event);
    emitFormBlur();

    // Since we use `displayValue` prop inside ComboboxInput we should reset searchTerm manually
    // https://akar.vinicunca.dev/docs/components/combobox#api-reference
    if (props.resetSearchTermOnBlur) {
      const STATE_ANIMATION_DELAY_MS = 100;

      // eslint-disable-next-line sonar/no-dead-store
      timeoutId = setTimeout(() => {
        searchTerm.value = '';
      }, STATE_ANIMATION_DELAY_MS);
    }
  } else {
    const event = new FocusEvent('focus');
    emits('focus', event);
    emitFormFocus();
    clearTimeout(timeoutId);
  }
}

function isSelectItem(item: SelectMenuItem): item is SelectMenuItemInternal {
  return typeof item === 'object' && item !== null;
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <AComboboxGroup :class="pohon.group({ class: props.pohon?.group })">
      <AComboboxItem
        :class="pohon.item({ class: props.pohon?.item })"
        :value="searchTerm"
        @select.prevent="emits('create', searchTerm)"
      >
        <span :class="pohon.itemLabel({ class: props.pohon?.itemLabel })">
          <slot
            name="create-item-label"
            :item="searchTerm"
          >
            {{ t('selectMenu.create', { label: searchTerm }) }}
          </slot>
        </span>
      </AComboboxItem>
    </AComboboxGroup>
  </DefineCreateItemTemplate>

  <AComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    ignore-filter
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <AComboboxAnchor as-child>
      <AComboboxTrigger
        :class="pohon.base({ class: [props.class, props.pohon?.base] })"
        tabindex="0"
      >
        <span
          v-if="isLeading || !!avatar || !!slots.leading"
          :class="pohon.leading({ class: props.pohon?.leading })"
        >
          <slot
            name="leading"
            :model-value="(modelValue as GetModelValue<T, VK, M>)"
            :open="open"
            :pohon="pohon"
          >
            <PIcon
              v-if="isLeading && leadingIconName"
              :name="leadingIconName"
              :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon })"
            />
            <PAvatar
              v-else-if="!!avatar"
              :size="(props.pohon?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size']"
              v-bind="avatar"
              :class="pohon.itemLeadingAvatar({ class: props.pohon?.itemLeadingAvatar })"
            />
          </slot>
        </span>

        <slot
          :model-value="modelValue as GetModelValue<T, VK, M>"
          :open="open"
        >
          <template
            v-for="displayedModelValue in [displayValue(modelValue as GetModelValue<T, VK, M>)]"
            :key="displayedModelValue"
          >
            <span
              v-if="displayedModelValue"
              :class="pohon.value({ class: props.pohon?.value })"
            >
              {{ displayedModelValue }}
            </span>
            <span
              v-else
              :class="pohon.placeholder({ class: props.pohon?.placeholder })"
            >
              {{ placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span
          v-if="isTrailing || !!slots.trailing"
          :class="pohon.trailing({ class: props.pohon?.trailing })"
        >
          <slot
            name="trailing"
            :model-value="(modelValue as GetModelValue<T, VK, M>)"
            :open="open"
            :pohon="pohon"
          >
            <PIcon
              v-if="trailingIconName"
              :name="trailingIconName"
              :class="pohon.trailingIcon({ class: props.pohon?.trailingIcon })"
            />
          </slot>
        </span>
      </AComboboxTrigger>
    </AComboboxAnchor>

    <AComboboxPortal :disabled="!portal">
      <AComboboxContent
        :class="pohon.content({ class: props.pohon?.content })"
        v-bind="contentProps"
      >
        <AFocusScope
          trapped
          :class="pohon.focusScope({ class: props.pohon?.focusScope })"
        >
          <AComboboxInput
            v-if="!!searchInput"
            v-model="searchTerm"
            :display-value="() => searchTerm"
            as-child
          >
            <PInput
              autofocus
              autocomplete="off"
              v-bind="searchInputProps"
              :class="pohon.input({ class: props.pohon?.input })"
            />
          </AComboboxInput>

          <AComboboxEmpty :class="pohon.empty({ class: props.pohon?.empty })">
            <slot
              name="empty"
              :search-term="searchTerm"
            >
              {{ searchTerm ? t('selectMenu.noMatch', { searchTerm }) : t('selectMenu.noData') }}
            </slot>
          </AComboboxEmpty>

          <AComboboxViewport :class="pohon.viewport({ class: props.pohon?.viewport })">
            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

            <AComboboxGroup
              v-for="(group, groupIndex) in filteredGroups"
              :key="`group-${groupIndex}`"
              :class="pohon.group({ class: props.pohon?.group })"
            >
              <template
                v-for="(item, index) in group"
                :key="`group-${groupIndex}-${index}`"
              >
                <AComboboxLabel
                  v-if="isSelectItem(item) && item.type === 'label'"
                  :class="pohon.label({ class: props.pohon?.label })"
                >
                  {{ getProp({ object: item, path: props.labelKey as string }) }}
                </AComboboxLabel>

                <AComboboxSeparator
                  v-else-if="isSelectItem(item) && item.type === 'separator'"
                  :class="pohon.separator({ class: props.pohon?.separator })"
                />

                <AComboboxItem
                  v-else
                  :class="pohon.item({ class: props.pohon?.item })"
                  :disabled="isSelectItem(item) && item.disabled"
                  :value="props.valueKey && isSelectItem(item) ? getProp({ object: item, path: props.valueKey as string }) : item"
                  @select="isSelectItem(item) && item.onSelect?.($event)"
                >
                  <slot
                    name="item"
                    :item="(item as NestedItem<T>)"
                    :index="index"
                  >
                    <slot
                      name="item-leading"
                      :item="(item as NestedItem<T>)"
                      :index="index"
                    >
                      <PIcon
                        v-if="isSelectItem(item) && item.icon"
                        :name="item.icon"
                        :class="pohon.itemLeadingIcon({ class: props.pohon?.itemLeadingIcon })"
                      />
                      <PAvatar
                        v-else-if="isSelectItem(item) && item.avatar"
                        :size="((props.pohon?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size'])"
                        v-bind="item.avatar"
                        :class="pohon.itemLeadingAvatar({ class: props.pohon?.itemLeadingAvatar })"
                      />
                      <PChip
                        v-else-if="isSelectItem(item) && item.chip"
                        :size="((props.pohon?.itemLeadingChipSize || pohon.itemLeadingChipSize()) as ChipProps['size'])"
                        inset
                        standalone
                        v-bind="item.chip"
                        :class="pohon.itemLeadingChip({ class: props.pohon?.itemLeadingChip })"
                      />
                    </slot>

                    <span :class="pohon.itemLabel({ class: props.pohon?.itemLabel })">
                      <slot
                        name="item-label"
                        :item="(item as NestedItem<T>)"
                        :index="index"
                      >
                        {{ isSelectItem(item) ? getProp({ object: item, path: props.labelKey as string }) : item }}
                      </slot>
                    </span>

                    <span :class="pohon.itemTrailing({ class: props.pohon?.itemTrailing })">
                      <slot
                        name="item-trailing"
                        :item="(item as NestedItem<T>)"
                        :index="index"
                      />

                      <AComboboxItemIndicator as-child>
                        <PIcon
                          :name="selectedIcon || appConfig.pohon.icons.check"
                          :class="pohon.itemTrailingIcon({ class: props.pohon?.itemTrailingIcon })"
                        />
                      </AComboboxItemIndicator>
                    </span>
                  </slot>
                </AComboboxItem>
              </template>
            </AComboboxGroup>

            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
          </AComboboxViewport>
        </AFocusScope>

        <AComboboxArrow
          v-if="!!arrow"
          v-bind="arrowProps"
          :class="pohon.arrow({ class: props.pohon?.arrow })"
        />
      </AComboboxContent>
    </AComboboxPortal>
  </AComboboxRoot>
</template>
