<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { AAccordionRootProps, AccordionRootEmits } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { DynamicSlots } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import accordionTheme from '#build/pohon/accordion';
import { uv } from '../utils/uv';

const appConfigAccordion = appConfig_ as AppConfig & {
  pohon: { accordion: Partial<typeof accordionTheme> };
};

const accordionFn = uv({
  extend: uv(accordionTheme),
  ...(appConfigAccordion.pohon?.accordion || {}),
});

export interface AccordionItem {
  label?: string;
  /**
   * @IconifyIcon
   */
  icon?: string;
  /**
   * @IconifyIcon
   */
  trailingIcon?: string;
  slot?: string;
  content?: string;
  /** A unique value for the accordion item. Defaults to the index. */
  value?: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface AccordionProps<T extends AccordionItem = AccordionItem> extends Pick<AAccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: AAccordionRootProps['as'];
  items?: Array<T>;
  /**
   * The icon displayed on the right side of the trigger.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string;
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string;
  class?: ClassValue;
  pohon?: Partial<typeof accordionFn.slots>;
}

export interface AccordionEmits extends AccordionRootEmits {}

type SlotProps<T extends AccordionItem> = (props: { item: T; index: number; open: boolean }) => any;

export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
  leading: SlotProps<T>;
  default: SlotProps<T>;
  trailing: SlotProps<T>;
  content: SlotProps<T>;
  body: SlotProps<T>;
} & DynamicSlots<T, 'body', { index: number; open: boolean }>;
</script>

<script setup lang="ts" generic="T extends AccordionItem">
import { useAppConfig } from '#imports';
import {
  AAccordionContent,
  AAccordionHeader,
  AAccordionItem,
  AAccordionRoot,
  AAccordionTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { getProp } from '../utils';
import PIcon from './icon.vue';

const props = withDefaults(
  defineProps<AccordionProps<T>>(),
  {
    type: 'single',
    collapsible: true,
    unmountOnHide: true,
    labelKey: 'label',
  },
);
const emits = defineEmits<AccordionEmits>();
const slots = defineSlots<AccordionSlots<T>>();

const appConfig = useAppConfig();
const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'collapsible',
    'defaultValue',
    'disabled',
    'modelValue',
    'type',
    'unmountOnHide',
  ),
  emits,
);

const pohon = computed(() => accordionFn({
  disabled: props.disabled,
}));
</script>

<template>
  <AAccordionRoot
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <AAccordionItem
      v-for="(item, index) in props.items"
      v-slot="{ open }"
      :key="index"
      :value="item.value || String(index)"
      :disabled="item.disabled"
      :class="pohon.item({ class: props.pohon?.item })"
    >
      <AAccordionHeader :class="pohon.header({ class: props.pohon?.header })">
        <AAccordionTrigger :class="pohon.trigger({ class: props.pohon?.trigger, disabled: item.disabled })">
          <slot
            name="leading"
            :item="item"
            :index="index"
            :open="open"
          >
            <PIcon
              v-if="item.icon"
              :name="item.icon"
              :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon })"
            />
          </slot>

          <span
            v-if="getProp({ object: item, path: props.labelKey as string }) || !!slots.default"
            :class="pohon.label({ class: props.pohon?.label })"
          >
            <slot
              :item="item"
              :index="index"
              :open="open"
            >{{ getProp({ object: item, path: props.labelKey as string }) }}</slot>
          </span>

          <slot
            name="trailing"
            :item="item"
            :index="index"
            :open="open"
          >
            <PIcon
              :name="item.trailingIcon || trailingIcon || appConfig.pohon.icons.chevronDown"
              :class="pohon.trailingIcon({ class: props.pohon?.trailingIcon })"
            />
          </slot>
        </AAccordionTrigger>
      </AAccordionHeader>

      <AAccordionContent
        v-if="item.content || !!slots.content || (item.slot && !!slots[item.slot as keyof AccordionSlots<T>]) || !!slots.body || (item.slot && !!slots[`${item.slot}-body` as keyof AccordionSlots<T>])"
        :class="pohon.content({ class: props.pohon?.content })"
      >
        <slot
          :name="(item.slot || 'content') as keyof AccordionSlots<T>"
          :item="item"
          :index="index"
          :open="open"
        >
          <div :class="pohon.body({ class: props.pohon?.body })">
            <slot
              :name="(item.slot ? `${item.slot}-body` : 'body') as keyof AccordionSlots<T>"
              :item="item"
              :index="index"
              :open="open"
            >
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AAccordionContent>
    </AAccordionItem>
  </AAccordionRoot>
</template>
