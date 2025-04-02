<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APaginationRootEmits, APaginationRootProps, APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { ButtonProps } from '../types';
import appConfig_ from '#build/app.config';
import paginationTheme from '#build/pohon/pagination';
import { uv } from '../utils/uv';

const appConfigPagination = appConfig_ as AppConfig & {
  pohon: { pagination: Partial<typeof paginationTheme> };
};

const paginationFn = uv({
  extend: uv(paginationTheme),
  ...(appConfigPagination.pohon?.pagination || {}),
});

export interface PaginationProps extends Partial<Pick<APaginationRootProps, 'defaultPage' | 'disabled' | 'itemsPerPage' | 'page' | 'showEdges' | 'siblingCount' | 'total'>> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * The icon to use for the first page control.
   * @defaultValue appConfig.pohon.icons.chevronDoubleLeft
   * @IconifyIcon
   */
  firstIcon?: string;
  /**
   * The icon to use for the previous page control.
   * @defaultValue appConfig.pohon.icons.chevronLeft
   * @IconifyIcon
   */
  prevIcon?: string;
  /**
   * The icon to use for the next page control.
   * @defaultValue appConfig.pohon.icons.chevronRight
   * @IconifyIcon
   */
  nextIcon?: string;
  /**
   * The icon to use for the last page control.
   * @defaultValue appConfig.pohon.icons.chevronDoubleRight
   * @IconifyIcon
   */
  lastIcon?: string;
  /**
   * The icon to use for the ellipsis control.
   * @defaultValue appConfig.pohon.icons.ellipsis
   * @IconifyIcon
   */
  ellipsisIcon?: string;
  /**
   * The color of the pagination controls.
   * @defaultValue 'neutral'
   * @IconifyIcon
   */
  color?: ButtonProps['color'];
  /**
   * The variant of the pagination controls.
   * @defaultValue 'outline'
   */
  variant?: ButtonProps['variant'];
  /**
   * The color of the active pagination control.
   * @defaultValue 'primary'
   */
  activeColor?: ButtonProps['color'];
  /**
   * The variant of the active pagination control.
   * @defaultValue 'solid'
   */
  activeVariant?: ButtonProps['variant'];
  /**
   * Whether to show the first, previous, next, and last controls.
   * @defaultValue true
   */
  showControls?: boolean;
  size?: ButtonProps['size'];
  /**
   * A function to render page controls as links.
   * @param page The page number to navigate to.
   */
  to?: (page: number) => ButtonProps['to'];
  class?: ClassValue;
  pohon?: Partial<typeof paginationFn.slots>;
}

export interface PaginationEmits extends APaginationRootEmits {}

export interface PaginationSlots {
  first: (props?: {}) => any;
  prev: (props?: {}) => any;
  next: (props?: {}) => any;
  last: (props?: {}) => any;
  ellipsis: (props?: {}) => any;
  item: (props: {
    page: number;
    pageCount: number;
    item: {
      type: 'ellipsis';
    } | {
      type: 'page';
      value: number;
    };
    index: number;
  }) => any;
}
</script>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import {
  APaginationEllipsis,
  APaginationFirst,
  APaginationLast,
  APaginationList,
  APaginationListItem,
  APaginationNext,
  APaginationPrev,
  APaginationRoot,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import PButton from './button.vue';

const props = withDefaults(
  defineProps<PaginationProps>(),
  {
    size: 'md',
    color: 'neutral',
    variant: 'outline',
    activeColor: 'primary',
    activeVariant: 'solid',
    showControls: true,
    showEdges: false,
    itemsPerPage: 10,
    siblingCount: 2,
    total: 0,
  },
);
const emits = defineEmits<PaginationEmits>();
const slots = defineSlots<PaginationSlots>();

const appConfig = useAppConfig();
const { dir } = useLocale();
const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'defaultPage',
    'disabled',
    'itemsPerPage',
    'page',
    'showEdges',
    'siblingCount',
    'total',
  ),
  emits,
);

const firstIcon = computed(() =>
  props.firstIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronDoubleRight
      : appConfig.pohon.icons.chevronDoubleLeft
  ),
);
const prevIcon = computed(() =>
  props.prevIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronRight
      : appConfig.pohon.icons.chevronLeft
  ),
);
const nextIcon = computed(() =>
  props.nextIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronLeft
      : appConfig.pohon.icons.chevronRight
  ),
);
const lastIcon = computed(() =>
  props.lastIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronDoubleLeft
      : appConfig.pohon.icons.chevronDoubleRight
  ),
);

const pohon = paginationFn();
</script>

<template>
  <APaginationRoot
    v-slot="{ page, pageCount }"
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <APaginationList
      v-slot="{ items }"
      :class="pohon.list({ class: props.pohon?.list })"
    >
      <APaginationFirst
        v-if="showControls || !!slots.first"
        as-child
        :class="pohon.first({ class: props.pohon?.first })"
      >
        <slot name="first">
          <PButton
            :color="color"
            :variant="variant"
            :size="size"
            :icon="firstIcon"
            :to="to?.(1)"
          />
        </slot>
      </APaginationFirst>
      <APaginationPrev
        v-if="showControls || !!slots.prev"
        as-child
        :class="pohon.prev({ class: props.pohon?.prev })"
      >
        <slot name="prev">
          <PButton
            :color="color"
            :variant="variant"
            :size="size"
            :icon="prevIcon"
            :to="page > 1 ? to?.(page - 1) : undefined"
          />
        </slot>
      </APaginationPrev>

      <template v-for="(item, index) in items">
        <APaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          as-child
          :value="item.value"
          :class="pohon.item({ class: props.pohon?.item })"
        >
          <slot
            name="item"
            v-bind="{ item, index, page, pageCount }"
          >
            <PButton
              :color="page === item.value ? activeColor : color"
              :variant="page === item.value ? activeVariant : variant"
              :size="size"
              :label="String(item.value)"
              :pohon="{ label: pohon.label() }"
              :to="to?.(item.value)"
              square
            />
          </slot>
        </APaginationListItem>

        <APaginationEllipsis
          v-else
          :key="item.type"
          :index="index"
          as-child
          :class="pohon.ellipsis({ class: props.pohon?.ellipsis })"
        >
          <slot name="ellipsis">
            <PButton
              :color="color"
              :variant="variant"
              :size="size"
              :icon="ellipsisIcon || appConfig.pohon.icons.ellipsis"
            />
          </slot>
        </APaginationEllipsis>
      </template>

      <APaginationNext
        v-if="showControls || !!slots.next"
        as-child
        :class="pohon.next({ class: props.pohon?.next })"
      >
        <slot name="next">
          <PButton
            :color="color"
            :variant="variant"
            :size="size"
            :icon="nextIcon"
            :to="page < pageCount ? to?.(page + 1) : undefined"
          />
        </slot>
      </APaginationNext>
      <APaginationLast
        v-if="showControls || !!slots.last"
        as-child
        :class="pohon.last({ class: props.pohon?.last })"
      >
        <slot name="last">
          <PButton
            :color="color"
            :variant="variant"
            :size="size"
            :icon="lastIcon"
            :to="to?.(pageCount)"
          />
        </slot>
      </APaginationLast>
    </APaginationList>
  </APaginationRoot>
</template>
