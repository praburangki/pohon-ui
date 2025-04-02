<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type {
  ASelectArrowProps,
  ASelectContentEmits,
  ASelectContentProps,
  ASelectRootEmits,
  ASelectRootProps,
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
import selectTheme from '#build/pohon/select';
import { uv } from '../utils/uv';

const appConfigSelect = appConfig_ as AppConfig & {
  pohon: { select: Partial<typeof selectTheme> };
};

const selectFn = uv({
  extend: uv(selectTheme),
  ...(appConfigSelect.pohon?.select || {}),
});

interface SelectItemBase {
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
  [key: string]: any;
}
export type SelectItem = SelectItemBase | AcceptableValue | boolean;

type SelectVariants = VariantProps<typeof selectFn>;

export interface SelectProps<T extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Omit<ASelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps {
  id?: string;
  /** The placeholder text when the select is empty. */
  placeholder?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: SelectVariants['color'];
  /**
   * @defaultValue 'outline'
   */
  variant?: SelectVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: SelectVariants['size'];
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
  content?: Omit<ASelectContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ASelectContentEmits>>;
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ASelectArrowProps, 'as' | 'asChild'>;
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean;
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: VK;
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>;
  items?: T;
  /** The value of the Select when initially rendered. Use when you do not need to control the state of the Select. */
  defaultValue?: GetModelValue<T, VK, M>;
  /** The controlled value of the Select. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>;
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean;
  /** Highlight the ring color like a focus state. */
  highlight?: boolean;
  class?: ClassValue;
  pohon?: PartialString<typeof selectFn.slots>;
}

export type SelectEmits<A extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<ASelectRootEmits, 'update:modelValue'> & {
  change: [payload: Event];
  blur: [payload: FocusEvent];
  focus: [payload: FocusEvent];
} & GetModelValueEmits<A, VK, M>;

type SlotProps<T extends SelectItem> = (props: { item: T; index: number }) => any;

export interface SelectSlots<
  A extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>,
> {
  'leading': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof selectFn> }) => any;
  'default': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean }) => any;
  'trailing': (props: { modelValue?: GetModelValue<A, VK, M>; open: boolean; pohon: ReturnType<typeof selectFn> }) => any;
  'item': SlotProps<T>;
  'item-leading': SlotProps<T>;
  'item-label': SlotProps<T>;
  'item-trailing': SlotProps<T>;
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import { useAppConfig } from '#imports';
import {
  ASelectArrow,
  ASelectContent,
  ASelectGroup,
  ASelectItem,
  ASelectItemIndicator,
  ASelectItemText,
  ASelectLabel,
  ASelectPortal,
  ASelectRoot,
  ASelectSeparator,
  ASelectTrigger,
  ASelectViewport,
  useForwardPropsEmits,

} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { defu } from 'defu';
import { computed, toRef } from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import { useFormField } from '../composables/use-form-field';
import { compare, getProp, isArrayOfArray } from '../utils';
import PAvatar from './avatar.vue';
import PChip from './chip.vue';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<SelectProps<T, VK, M>>(),
  {
    valueKey: 'value' as never,
    labelKey: 'label' as never,
    portal: true,
  },
);
const emits = defineEmits<SelectEmits<T, VK, M>>();
const slots = defineSlots<SelectSlots<T, VK, M>>();

const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'open',
    'defaultOpen',
    'disabled',
    'autocomplete',
    'required',
    'multiple',
  ),
  emits,
);
const contentProps = toRef(() =>
  defu(
    props.content,
    { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' },
  ) as ASelectContentProps,
);
const arrowProps = toRef(() => props.arrow as ASelectArrowProps);

const {
  emitFormChange,
  emitFormInput,
  emitFormBlur,
  emitFormFocus,
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
} = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.pohon.icons.chevronDown })));

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value);

const pohon = computed(() => selectFn({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value,
}));

const groups = computed<Array<Array<SelectItem>>>(() => {
  if (props.items?.length) {
    return isArrayOfArray(props.items)
      ? props.items
      : [props.items];
  }

  return [];
});

const items = computed(() => groups.value.flatMap((group) => group) as Array<T>);

function displayValue(value?: GetItemValue<T, VK> | Array<GetItemValue<T, VK>>): string {
  if (props.multiple && Array.isArray(value)) {
    return value.map((v) => displayValue(v)).filter(Boolean).join(', ');
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

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } });
  emits('change', event);

  emitFormChange();
  emitFormInput();
}
function onUpdateOpen(value: boolean) {
  if (!value) {
    const event = new FocusEvent('blur');
    emits('blur', event);
    emitFormBlur();
  } else {
    const event = new FocusEvent('focus');
    emits('focus', event);
    emitFormFocus();
  }
}

function isSelectItem(item: SelectItem): item is SelectItemBase {
  return typeof item === 'object' && item !== null;
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <ASelectRoot
    v-slot="{ modelValue, open }"
    :name="name"
    v-bind="rootProps"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :default-value="defaultValue as (AcceptableValue | AcceptableValue[])"
    :model-value="modelValue as (AcceptableValue | AcceptableValue[])"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ASelectTrigger
      :id="id"
      :class="pohon.base({ class: [props.class, props.pohon?.base] })"
      v-bind="{ ...$attrs, ...ariaAttrs }"
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
            :size="((props.pohon?.itemLeadingAvatarSize || pohon.itemLeadingAvatarSize()) as AvatarProps['size'])"
            v-bind="avatar"
            :class="pohon.itemLeadingAvatar({ class: props.pohon?.itemLeadingAvatar })"
          />
        </slot>
      </span>

      <slot
        :model-value="(modelValue as GetModelValue<T, VK, M>)"
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
    </ASelectTrigger>

    <ASelectPortal :disabled="!portal">
      <ASelectContent
        :class="pohon.content({ class: props.pohon?.content })"
        v-bind="contentProps"
      >
        <ASelectViewport :class="pohon.viewport({ class: props.pohon?.viewport })">
          <ASelectGroup
            v-for="(group, groupIndex) in groups"
            :key="`group-${groupIndex}`"
            :class="pohon.group({ class: props.pohon?.group })"
          >
            <template
              v-for="(item, index) in group"
              :key="`group-${groupIndex}-${index}`"
            >
              <ASelectLabel
                v-if="isSelectItem(item) && item.type === 'label'"
                :class="pohon.label({ class: props.pohon?.label })"
              >
                {{ getProp({ object: item, path: props.labelKey as string }) }}
              </ASelectLabel>

              <ASelectSeparator
                v-else-if="isSelectItem(item) && item.type === 'separator'"
                :class="pohon.separator({ class: props.pohon?.separator })"
              />

              <ASelectItem
                v-else
                :class="pohon.item({ class: props.pohon?.item })"
                :disabled="isSelectItem(item) && item.disabled"
                :value="isSelectItem(item) ? getProp({ object: item, path: props.valueKey as string }) : item"
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

                  <ASelectItemText :class="pohon.itemLabel({ class: props.pohon?.itemLabel })">
                    <slot
                      name="item-label"
                      :item="(item as NestedItem<T>)"
                      :index="index"
                    >
                      {{ isSelectItem(item) ? getProp({ object: item, path: props.labelKey as string }) : item }}
                    </slot>
                  </ASelectItemText>

                  <span :class="pohon.itemTrailing({ class: props.pohon?.itemTrailing })">
                    <slot
                      name="item-trailing"
                      :item="(item as NestedItem<T>)"
                      :index="index"
                    />

                    <ASelectItemIndicator as-child>
                      <PIcon
                        :name="selectedIcon || appConfig.pohon.icons.check"
                        :class="pohon.itemTrailingIcon({ class: props.pohon?.itemTrailingIcon })"
                      />
                    </ASelectItemIndicator>
                  </span>
                </slot>
              </ASelectItem>
            </template>
          </ASelectGroup>
        </ASelectViewport>

        <ASelectArrow
          v-if="!!arrow"
          v-bind="arrowProps"
          :class="pohon.arrow({ class: props.pohon?.arrow })"
        />
      </ASelectContent>
    </ASelectPortal>
  </ASelectRoot>
</template>
