<script lang="ts">
import type { DateValue } from '@internationalized/date';
import type { AppConfig } from '@nuxt/schema';
import type {
  ACalendarCellTriggerProps,
  ACalendarRootEmits,
  ACalendarRootProps,
  APrimitiveProps,
  ARangeCalendarRootEmits,
  ARangeCalendarRootProps,
  DateRange,
} from '@vinicunca/akar';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { ButtonProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import calendarTheme from '#build/pohon/calendar';
import { uv } from '../utils/uv';

const appConfigCalendar = appConfig_ as AppConfig & {
  pohon: { calendar: Partial<typeof calendarTheme> };
};

const calendarFn = uv({
  extend: uv(calendarTheme),
  ...(appConfigCalendar.pohon?.calendar || {}),
});

type CalendarVariants = VariantProps<typeof calendarFn>;

type CalendarDefaultValue<R extends boolean = false, M extends boolean = false> = R extends true
  ? DateRange
  : M extends true
    ? Array<DateValue>
    : DateValue;
type CalendarModelValue<R extends boolean = false, M extends boolean = false> = R extends true
  ? (DateRange | null)
  : M extends true
    ? (Array<DateValue> | undefined)
    : (DateValue | undefined);

type _CalendarRootProps = Omit<ACalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>;
type _RangeCalendarRootProps = Omit<ARangeCalendarRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale' | 'calendarLabel' | 'multiple'>;

export interface CalendarProps<R extends boolean = false, M extends boolean = false> extends _RangeCalendarRootProps, _CalendarRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * The icon to use for the next year control.
   * @defaultValue appConfig.pohon.icons.chevronDoubleRight
   * @IconifyIcon
   */
  nextYearIcon?: string;
  /**
   * Configure the next year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextYear?: ButtonProps;
  /**
   * The icon to use for the next month control.
   * @defaultValue appConfig.pohon.icons.chevronRight
   * @IconifyIcon
   */
  nextMonthIcon?: string;
  /**
   * Configure the next month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  nextMonth?: ButtonProps;
  /**
   * The icon to use for the previous year control.
   * @defaultValue appConfig.pohon.icons.chevronDoubleLeft
   * @IconifyIcon
   */
  prevYearIcon?: string;
  /**
   * Configure the prev year button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevYear?: ButtonProps;
  /**
   * The icon to use for the previous month control.
   * @defaultValue appConfig.pohon.icons.chevronLeft
   * @IconifyIcon
   */
  prevMonthIcon?: string;
  /**
   * Configure the prev month button.
   * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
   */
  prevMonth?: ButtonProps;
  /**
   * @defaultValue 'primary'
   */
  color?: CalendarVariants['color'];
  /**
   * @defaultValue 'md'
   */
  size?: CalendarVariants['size'];
  /** Whether or not a range of dates can be selected */
  range?: R & boolean;
  /** Whether or not multiple dates can be selected */
  multiple?: M & boolean;
  /** Show month controls */
  monthControls?: boolean;
  /** Show year controls */
  yearControls?: boolean;
  defaultValue?: CalendarDefaultValue<R, M>;
  modelValue?: CalendarModelValue<R, M>;
  class?: ClassValue;
  pohon?: PartialString<typeof calendarFn.slots>;
}

export interface CalendarEmits<R extends boolean, M extends boolean> extends Omit<ACalendarRootEmits & ARangeCalendarRootEmits, 'update:modelValue'> {
  'update:modelValue': [date: CalendarModelValue<R, M>];
}

export interface CalendarSlots {
  'heading': (props: { value: string }) => any;
  'day': (props: Pick<ACalendarCellTriggerProps, 'day'>) => any;
  'week-day': (props: { day: string }) => any;
}
</script>

<script setup lang="ts" generic="R extends boolean, M extends boolean">
import { useAppConfig } from '#imports';
import { useForwardPropsEmits } from '@vinicunca/akar';
import {
  ARangeCalendar,
  ACalendar as SingleCalendar,
} from '@vinicunca/akar/namespaced';
import { reactiveOmit } from '@vueuse/core';
import { computed } from 'vue';
import { useLocale } from '../composables/use-locale';
import PButton from './button.vue';

const props = withDefaults(
  defineProps<CalendarProps<R, M>>(),
  {
    fixedWeeks: true,
    monthControls: true,
    yearControls: true,
  },
);
const emits = defineEmits<CalendarEmits<R, M>>();
defineSlots<CalendarSlots>();

const appConfig = useAppConfig();
const { code: locale, dir, t } = useLocale();

const rootProps = useForwardPropsEmits(
  reactiveOmit(props, 'range', 'modelValue', 'defaultValue', 'color', 'size', 'monthControls', 'yearControls', 'class', 'pohon'),
  emits,
);

const nextYearIcon = computed(() =>
  props.nextYearIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronDoubleLeft
      : appConfig.pohon.icons.chevronDoubleRight
  ),
);
const nextMonthIcon = computed(() =>
  props.nextMonthIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronLeft
      : appConfig.pohon.icons.chevronRight
  ),
);
const prevYearIcon = computed(() =>
  props.prevYearIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronDoubleRight
      : appConfig.pohon.icons.chevronDoubleLeft
  ),
);
const prevMonthIcon = computed(() =>
  props.prevMonthIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.chevronRight
      : appConfig.pohon.icons.chevronLeft
  ),
);

const pohon = computed(() => calendarFn({
  color: props.color,
  size: props.size,
}));

function paginateYear(date: DateValue, sign: -1 | 1) {
  if (sign === -1) {
    return date.subtract({ years: 1 });
  }

  return date.add({ years: 1 });
}

const Calendar = computed(() => props.range ? ARangeCalendar : SingleCalendar);
</script>

<template>
  <Calendar.Root
    v-slot="{ weekDays, grid }"
    v-bind="rootProps"
    :model-value="modelValue"
    :default-value="defaultValue"
    :locale="locale"
    :dir="dir"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <Calendar.Header :class="pohon.header({ class: props.pohon?.header })">
      <Calendar.Prev
        v-if="props.yearControls"
        :prev-page="(date: DateValue) => paginateYear(date, -1)"
        :aria-label="t('calendar.prevYear')"
        as-child
      >
        <PButton
          :icon="prevYearIcon"
          :size="props.size"
          color="neutral"
          variant="ghost"
          v-bind="props.prevYear"
        />
      </Calendar.Prev>
      <Calendar.Prev
        v-if="props.monthControls"
        :aria-label="t('calendar.prevMonth')"
        as-child
      >
        <PButton
          :icon="prevMonthIcon"
          :size="props.size"
          color="neutral"
          variant="ghost"
          v-bind="props.prevMonth"
        />
      </Calendar.Prev>
      <Calendar.Heading
        v-slot="{ headingValue }"
        :class="pohon.heading({ class: props.pohon?.heading })"
      >
        <slot
          name="heading"
          :value="headingValue"
        >
          {{ headingValue }}
        </slot>
      </Calendar.Heading>
      <Calendar.Next
        v-if="props.monthControls"
        :aria-label="t('calendar.nextMonth')"
        as-child
      >
        <PButton
          :icon="nextMonthIcon"
          :size="props.size"
          color="neutral"
          variant="ghost"
          v-bind="props.nextMonth"
        />
      </Calendar.Next>
      <Calendar.Next
        v-if="props.yearControls"
        :next-page="(date: DateValue) => paginateYear(date, 1)"
        :aria-label="t('calendar.nextYear')"
        as-child
      >
        <PButton
          :icon="nextYearIcon"
          :size="props.size"
          color="neutral"
          variant="ghost"
          v-bind="props.nextYear"
        />
      </Calendar.Next>
    </Calendar.Header>
    <div :class="pohon.body({ class: props.pohon?.body })">
      <Calendar.Grid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="pohon.grid({ class: props.pohon?.grid })"
      >
        <Calendar.GridHead>
          <Calendar.GridRow :class="pohon.gridWeekDaysRow({ class: props.pohon?.gridWeekDaysRow })">
            <Calendar.HeadCell
              v-for="day in weekDays"
              :key="day"
              :class="pohon.headCell({ class: props.pohon?.headCell })"
            >
              <slot
                name="week-day"
                :day="day"
              >
                {{ day }}
              </slot>
            </Calendar.HeadCell>
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody :class="pohon.gridBody({ class: props.pohon?.gridBody })">
          <Calendar.GridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            :class="pohon.gridRow({ class: props.pohon?.gridRow })"
          >
            <Calendar.Cell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :class="pohon.cell({ class: props.pohon?.cell })"
            >
              <Calendar.CellTrigger
                :day="weekDate"
                :month="month.value"
                :class="pohon.cellTrigger({ class: props.pohon?.cellTrigger })"
              >
                <slot
                  name="day"
                  :day="weekDate"
                >
                  {{ weekDate.day }}
                </slot>
              </Calendar.CellTrigger>
            </Calendar.Cell>
          </Calendar.GridRow>
        </Calendar.GridBody>
      </Calendar.Grid>
    </div>
  </Calendar.Root>
</template>
