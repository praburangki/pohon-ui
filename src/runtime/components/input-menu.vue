<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  AComboboxArrowProps,
  AComboboxContentEmits,
  AComboboxContentProps,
  AComboboxRootEmits,
  AComboboxRootProps,
  APrimitiveProps,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { InputHTMLAttributes } from 'vue';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps, ChipProps, InputProps } from '../types';
import type {
  AcceptableValue,
  ArrayOrNested,
  EmitsToProps,
  GetItemKeys,
  GetModelValue,
  GetModelValueEmits,
  NestedItem,
  PartialString,
} from '../types/type.utils';
import appConfig_ from '#build/app.config';
import inputMenuTheme from '#build/pohon/input-menu';
import { uv } from '../utils/uv';

const appConfigInputMenu = appConfig_ as AppConfig & {
  pohon: { inputMenu: Partial<typeof inputMenuTheme> };
};

const inputMenuFn = uv({
  extend: uv(inputMenuTheme),
  ...(appConfigInputMenu.pohon?.inputMenu || {}),
});

interface InputMenuItemInternal {
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
export type InputMenuItem = InputMenuItemInternal | AcceptableValue | boolean;

type InputMenuVariants = VariantProps<typeof inputMenuFn>;

export interface InputMenuProps<T extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<AComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'highlightOnHover'>, UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  id?: string;
  type?: InputHTMLAttributes['type'];
  /** The placeholder text when the input is empty. */
  placeholder?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: InputMenuVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: InputMenuVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: InputMenuVariants['size'];
  required?: boolean;
  autofocus?: boolean;
  autofocusDelay?: number;
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
   * The icon displayed to delete a tag.
   * Works only when `multiple` is `true`.
   * @defaultValue appConfig.pohon.icons.close
   * @IconifyIcon
   */
  deleteIcon?: string;
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<AComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<AComboboxContentEmits>>;
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
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
  /** The value of the InputMenu when initially rendered. Use when you do not need to control the state of the InputMenu. */
  defaultValue?: GetModelValue<T, VK, M>;
  /** The controlled value of the InputMenu. Can be binded-with with `v-model`. */
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
  pohon?: PartialString<typeof inputMenuFn.slots>;
}

export type InputMenuEmits<A extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<AComboboxRootEmits, 'update:open'> & {
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

type SlotProps<T extends InputMenuItem> = (props: { item: T; index: number }) => any;

export interface InputMenuSlots<
  A extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>,
> {
  'leading': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof inputMenuFn> }) => any;
  'trailing': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof inputMenuFn> }) => any;
  'empty': (props: { searchTerm?: string }) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
  'tags-item-text': SlotProps<T>;
  'tags-item-delete': SlotProps<T>;
  'create-item-label': (props: { item: string }) => any;
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
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
  ATagsInputInput,
  ATagsInputItem,
  ATagsInputItemDelete,
  ATagsInputItemText,
  ATagsInputRoot,
  useFilter,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { createReusableTemplate, reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { isEqual } from 'ohash/utils';
import {
  computed,
  nextTick,
  onMounted,
  ref,
  toRaw,
  toRef,
} from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import { useFormField } from '../composables/use-form-field';
import { useLocale } from '../composables/use-locale';
import { compare, getProp, isArrayOfArray } from '../utils';
import PAvatar from './avatar.vue';
import PChip from './chip.vue';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<InputMenuProps<T, VK, M>>(),
  {
    type: 'text',
    autofocusDelay: 0,
    portal: true,
    labelKey: 'label' as never,
  },
);
const emits = defineEmits<InputMenuEmits<T, VK, M>>();
const slots = defineSlots<InputMenuSlots<T, VK, M>>();

const searchTerm = defineModel<string>('searchTerm', { default: '' });

const { t } = useLocale();
const appConfig = useAppConfig();
const { contains } = useFilter({ sensitivity: 'base' });

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'modelValue',
    'defaultValue',
    'open',
    'defaultOpen',
    'required',
    'multiple',
    'resetSearchTermOnBlur',
    'highlightOnHover',
    'ignoreFilter',
  ),
  emits,
);
const contentProps = toRef(() =>
  defu(
    props.content,
    { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' },
  ) as AComboboxContentProps,
);
const arrowProps = toRef(() => props.arrow as AComboboxArrowProps);

const {
  emitFormBlur,
  emitFormFocus,
  emitFormChange,
  emitFormInput,
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

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value);

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();

const pohon = computed(() => inputMenuFn({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  multiple: props.multiple,
  buttonGroup: orientation.value,
}));

function displayValue(value: T): string {
  if (!props.valueKey) {
    return value && (typeof value === 'object' ? getProp({ object: value, path: props.labelKey as string }) : value);
  }

  const item = items.value.find((item) =>
    compare({
      value: typeof item === 'object'
        ? getProp({ object: item as Record<string, any>, path: props.valueKey as string })
        : item,
      currentValue: value,
    }),
  );
  return item && (
    typeof item === 'object'
      ? getProp({ object: item, path: props.labelKey as string })
      : item
  );
}

const groups = computed<Array<Array<InputMenuItem>>>(() => {
  if (props.items?.length) {
    return isArrayOfArray(props.items)
      ? props.items
      : [props.items];
  }

  return [];
});

const items = computed(() => groups.value.flatMap((group) => group));

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value;
  }

  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as Array<string>;

  return groups.value.map((group) =>
    group.filter((item) => {
      if (typeof item !== 'object' || item === null) {
        return contains({ string: String(item), substring: searchTerm.value });
      }

      if (item.type && ['label', 'separator'].includes(item.type)) {
        return true;
      }

      return fields.some((field) => contains({
        string: getProp({ object: item, path: field }),
        substring: searchTerm.value,
      }));
    }),
  ).filter((group) =>
    group.filter((item) =>
      !isInputItem(item) || (!item.type || !['label', 'separator'].includes(item.type)),
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

const inputRef = ref<InstanceType<typeof AComboboxInput> | null>(null);

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus();
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus();
  }, props.autofocusDelay);
});

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

function onBlur(event: FocusEvent) {
  emits('blur', event);
  emitFormBlur();
}

function onFocus(event: FocusEvent) {
  emits('focus', event);
  emitFormFocus();
}

function onUpdateOpen(value: boolean) {
  if (!value) {
    const event = new FocusEvent('blur');
    emits('blur', event);
    emitFormBlur();
  } else {
    const event = new FocusEvent('focus');
    emits('focus', event);
  }

  nextTick(() => {
    searchTerm.value = '';
  });
}

function onRemoveTag(event: any) {
  if (props.multiple) {
    const modelValue = props.modelValue as GetModelValue<T, VK, true>;
    const filteredValue = modelValue.filter((value) => !isEqual(value, event));
    emits('update:modelValue', filteredValue as GetModelValue<T, VK, M>);
    onUpdate(filteredValue);
  }
}

function isInputItem(item: InputMenuItem): item is InputMenuItemInternal {
  return typeof item === 'object' && item !== null;
}

defineExpose({
  inputRef,
});
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
            {{ t('inputMenu.create', { label: searchTerm }) }}
          </slot>
        </span>
      </AComboboxItem>
    </AComboboxGroup>
  </DefineCreateItemTemplate>

  <AComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :as-child="!!multiple"
    ignore-filter
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
    @keydown.enter="$event.preventDefault()"
  >
    <AComboboxAnchor
      :as-child="!multiple"
      :class="pohon.base({ class: props.pohon?.base })"
    >
      <ATagsInputRoot
        v-if="multiple"
        v-slot="{ modelValue: tags }"
        :model-value="(modelValue as string[])"
        :disabled="disabled"
        :required="required"
        delimiter=""
        as-child
        @blur="onBlur"
        @focus="onFocus"
        @remove-tag="onRemoveTag"
      >
        <ATagsInputItem
          v-for="(item, index) in tags"
          :key="index"
          :value="item"
          :class="pohon.tagsItem({ class: props.pohon?.tagsItem })"
        >
          <ATagsInputItemText :class="pohon.tagsItemText({ class: props.pohon?.tagsItemText })">
            <slot
              name="tags-item-text"
              :item="(item as NestedItem<T>)"
              :index="index"
            >
              {{ displayValue(item as T) }}
            </slot>
          </ATagsInputItemText>

          <ATagsInputItemDelete
            :class="pohon.tagsItemDelete({ class: props.pohon?.tagsItemDelete })"
            :disabled="disabled"
          >
            <slot
              name="tags-item-delete"
              :item="(item as NestedItem<T>)"
              :index="index"
            >
              <PIcon
                :name="deleteIcon || appConfig.pohon.icons.close"
                :class="pohon.tagsItemDeleteIcon({ class: props.pohon?.tagsItemDeleteIcon })"
              />
            </slot>
          </ATagsInputItemDelete>
        </ATagsInputItem>

        <AComboboxInput
          as-child
          @update:model-value="searchTerm = $event"
        >
          <ATagsInputInput
            ref="inputRef"
            v-bind="{ ...$attrs, ...ariaAttrs }"
            :placeholder="placeholder"
            :class="pohon.tagsInput({ class: props.pohon?.tagsInput })"
            @keydown.enter.prevent
          />
        </AComboboxInput>
      </ATagsInputRoot>

      <AComboboxInput
        v-else
        ref="inputRef"
        :display-value="displayValue"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        @blur="onBlur"
        @focus="onFocus"
        @update:model-value="searchTerm = $event"
      />

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

      <AComboboxTrigger
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
      </AComboboxTrigger>
    </AComboboxAnchor>

    <AComboboxPortal :disabled="!portal">
      <AComboboxContent
        :class="pohon.content({ class: props.pohon?.content })"
        v-bind="contentProps"
      >
        <AComboboxEmpty :class="pohon.empty({ class: props.pohon?.empty })">
          <slot
            name="empty"
            :search-term="searchTerm"
          >
            {{ searchTerm ? t('inputMenu.noMatch', { searchTerm }) : t('inputMenu.noData') }}
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
                v-if="isInputItem(item) && item.type === 'label'"
                :class="pohon.label({ class: props.pohon?.label })"
              >
                {{ getProp({ object: item, path: props.labelKey as string }) }}
              </AComboboxLabel>

              <AComboboxSeparator
                v-else-if="isInputItem(item) && item.type === 'separator'"
                :class="pohon.separator({ class: props.pohon?.separator })"
              />

              <AComboboxItem
                v-else
                :class="pohon.item({ class: props.pohon?.item })"
                :disabled="isInputItem(item) && item.disabled"
                :value="props.valueKey && isInputItem(item) ? getProp({ object: item, path: String(props.valueKey) }) : item"
                @select="isInputItem(item) && item.onSelect?.($event)"
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
                      v-if="isInputItem(item) && item.icon"
                      :name="item.icon"
                      :class="pohon.itemLeadingIcon({ class: props.pohon?.itemLeadingIcon })"
                    />
                    <PAvatar
                      v-else-if="isInputItem(item) && item.avatar"
                      :size="(props.pohon?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size']"
                      v-bind="item.avatar"
                      :class="pohon.itemLeadingAvatar({ class: props.pohon?.itemLeadingAvatar })"
                    />
                    <PChip
                      v-else-if="isInputItem(item) && item.chip"
                      :size="(props.pohon?.itemLeadingChipSize || pohon.itemLeadingChipSize()) as ChipProps['size']"
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
                      {{ isInputItem(item) ? getProp({ object: item, path: props.labelKey as string }) : item }}
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

        <AComboboxArrow
          v-if="!!arrow"
          v-bind="arrowProps"
          :class="pohon.arrow({ class: props.pohon?.arrow })"
        />
      </AComboboxContent>
    </AComboboxPortal>
  </AComboboxRoot>
</template>
