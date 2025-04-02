<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import type { AutoHeightOptionsType } from 'embla-carousel-auto-height';
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll';
import type { AutoplayOptionsType } from 'embla-carousel-autoplay';
import type { ClassNamesOptionsType } from 'embla-carousel-class-names';
import type { FadeOptionsType } from 'embla-carousel-fade';
import type { WheelGesturesPluginOptions } from 'embla-carousel-wheel-gestures';
import type { AcceptableValue } from 'reka-ui';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { ButtonProps } from '../types';
import type { PartialString } from '../types/type.utils';
import appConfig_ from '#build/app.config';
import carouselTheme from '#build/pohon/carousel';
import { isBoolean, KEY_CODES } from '@vinicunca/perkakas';
import { uv } from '../utils/uv';

const appConfigCarousel = appConfig_ as AppConfig & {
  pohon: { carousel: Partial<typeof carouselTheme> };
};

const carouselFn = uv({
  extend: uv(carouselTheme),
  ...(appConfigCarousel.pohon?.carousel || {}),
});

type CarouselVariants = VariantProps<typeof carouselFn>;

export type CarouselItem = AcceptableValue;

export interface CarouselProps<T extends CarouselItem = CarouselItem> extends Omit<EmblaOptionsType, 'axis' | 'container' | 'slides' | 'direction'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * Configure the prev button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  prev?: ButtonProps;
  /**
   * The icon displayed in the prev button.
   * @defaultValue appConfig.pohon.icons.arrowLeft
   * @IconifyIcon
   */
  prevIcon?: string;
  /**
   * Configure the next button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  next?: ButtonProps;
  /**
   * The icon displayed in the next button.
   * @defaultValue appConfig.pohon.icons.arrowRight
   * @IconifyIcon
   */
  nextIcon?: string;
  /**
   * Display prev and next buttons to scroll the carousel.
   * @defaultValue false
   */
  arrows?: boolean;
  /**
   * Display dots to scroll to a specific slide.
   * @defaultValue false
   */
  dots?: boolean;
  /**
   * The orientation of the carousel.
   * @defaultValue 'horizontal'
   */
  orientation?: CarouselVariants['orientation'];
  items?: Array<T>;
  /**
   * Enable Autoplay plugin
   * @link https://www.embla-carousel.com/plugins/autoplay/
   */
  autoplay?: boolean | AutoplayOptionsType;
  /**
   * Enable Auto Scroll plugin
   * @link https://www.embla-carousel.com/plugins/auto-scroll/
   */
  autoScroll?: boolean | AutoScrollOptionsType;
  /**
   * Enable Auto Height plugin
   * @link https://www.embla-carousel.com/plugins/auto-height/
   */
  autoHeight?: boolean | AutoHeightOptionsType;
  /**
   * Enable Class Names plugin
   * @link https://www.embla-carousel.com/plugins/class-names/
   */
  classNames?: boolean | ClassNamesOptionsType;
  /**
   * Enable Fade plugin
   * @link https://www.embla-carousel.com/plugins/fade/
   */
  fade?: boolean | FadeOptionsType;
  /**
   * Enable Wheel Gestures plugin
   * @link https://www.embla-carousel.com/plugins/wheel-gestures/
   */
  wheelGestures?: boolean | WheelGesturesPluginOptions;
  class?: ClassValue;
  pohon?: PartialString<typeof carouselFn.slots>;
}

export interface CarouselSlots<T extends CarouselItem = CarouselItem> {
  default: (props: { item: T; index: number }) => any;
}
</script>

<script setup lang="ts" generic="T extends CarouselItem">
import { useAppConfig } from '#imports';
import { APrimitive, useForwardProps } from '@vinicunca/akar';
import { computedAsync, reactivePick } from '@vueuse/core';
import useEmblaCarousel from 'embla-carousel-vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useLocale } from '../composables/use-locale';
import PButton from './button.vue';

const props = withDefaults(
  defineProps<CarouselProps<T>>(),
  {
    orientation: 'horizontal',
    arrows: false,
    dots: false,
    // Embla Options
    active: true,
    align: 'center',
    breakpoints: () => ({}),
    containScroll: 'trimSnaps',
    dragFree: false,
    dragThreshold: 10,
    duration: 25,
    inViewThreshold: 0,
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
    startIndex: 0,
    watchDrag: true,
    watchResize: true,
    watchSlides: true,
    watchFocus: true,
    // Embla Plugins
    autoplay: false,
    autoScroll: false,
    autoHeight: false,
    classNames: false,
    fade: false,
    wheelGestures: false,
  },
);
defineSlots<CarouselSlots<T>>();

const appConfig = useAppConfig();
const { dir, t } = useLocale();
const rootProps = useForwardProps(
  reactivePick(
    props,
    'active',
    'align',
    'breakpoints',
    'containScroll',
    'dragFree',
    'dragThreshold',
    'duration',
    'inViewThreshold',
    'loop',
    'skipSnaps',
    'slidesToScroll',
    'startIndex',
    'watchDrag',
    'watchResize',
    'watchSlides',
    'watchFocus',
  ),
);

const prevIcon = computed(() =>
  props.prevIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.arrowRight
      : appConfig.pohon.icons.arrowLeft),
);
const nextIcon = computed(() =>
  props.nextIcon || (
    dir.value === 'rtl'
      ? appConfig.pohon.icons.arrowLeft
      : appConfig.pohon.icons.arrowRight),
);

const pohon = computed(() => carouselFn({
  orientation: props.orientation,
}));

const options = computed<EmblaOptionsType>(() => ({
  ...(props.fade ? { align: 'center', containScroll: false } : {}),
  ...rootProps.value,
  axis: props.orientation === 'horizontal' ? 'x' : 'y',
  direction: dir.value === 'rtl' ? 'rtl' : 'ltr',
}));

const plugins = computedAsync<Array<EmblaPluginType>>(async () => {
  const plugins = [];

  if (props.autoplay) {
    const AutoplayPlugin = await import('embla-carousel-autoplay').then((r) => r.default);
    plugins.push(
      AutoplayPlugin(
        isBoolean(props.autoplay)
          ? {}
          : props.autoplay,
      ),
    );
  }

  if (props.autoScroll) {
    const AutoScrollPlugin = await import('embla-carousel-auto-scroll').then((r) => r.default);
    plugins.push(
      AutoScrollPlugin(
        isBoolean(props.autoScroll)
          ? {}
          : props.autoScroll,
      ),
    );
  }

  if (props.autoHeight) {
    const AutoHeightPlugin = await import('embla-carousel-auto-height').then((r) => r.default);
    plugins.push(
      AutoHeightPlugin(
        isBoolean(props.autoHeight)
          ? {}
          : props.autoHeight,
      ),
    );
  }

  if (props.classNames) {
    const ClassNamesPlugin = await import('embla-carousel-class-names').then((r) => r.default);
    plugins.push(
      ClassNamesPlugin(
        isBoolean(props.classNames)
          ? {}
          : props.classNames,
      ),
    );
  }

  if (props.fade) {
    const FadePlugin = await import('embla-carousel-fade').then((r) => r.default);
    plugins.push(
      FadePlugin(
        isBoolean(props.fade)
          ? {}
          : props.fade,
      ),
    );
  }

  if (props.wheelGestures) {
    const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures');
    plugins.push(
      WheelGesturesPlugin(
        isBoolean(props.wheelGestures)
          ? {}
          : props.wheelGestures,
      ),
    );
  }

  return plugins;
});

const [emblaRef, emblaApi] = useEmblaCarousel(options.value, plugins.value);

watch(
  [options, plugins],
  () => {
    emblaApi.value?.reInit(options.value, plugins.value);
  },
);

function scrollPrev() {
  emblaApi.value?.scrollPrev();
}
function scrollNext() {
  emblaApi.value?.scrollNext();
}
function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index);
}

function onKeyDown(event: KeyboardEvent) {
  const prevKey = props.orientation === 'vertical' ? KEY_CODES.ARROW_UP : KEY_CODES.ARROW_LEFT;
  const nextKey = props.orientation === 'vertical' ? KEY_CODES.ARROW_DOWN : KEY_CODES.ARROW_RIGHT;

  if (event.key === prevKey) {
    event.preventDefault();
    scrollPrev();

    return;
  }

  if (event.key === nextKey) {
    event.preventDefault();
    scrollNext();
  }
}

const canScrollNext = ref(false);
const canScrollPrev = ref(false);
const selectedIndex = ref<number>(0);
const scrollSnaps = ref<Array<number>>([]);

function onInit(api: EmblaCarouselType) {
  scrollSnaps.value = api?.scrollSnapList() || [];
}
function onSelect(api: EmblaCarouselType) {
  canScrollNext.value = api?.canScrollNext() || false;
  canScrollPrev.value = api?.canScrollPrev() || false;
  selectedIndex.value = api?.selectedScrollSnap() || 0;
}

onMounted(() => {
  if (!emblaApi.value) {
    return;
  }

  emblaApi.value?.on('init', onInit);
  emblaApi.value?.on('init', onSelect);
  emblaApi.value?.on('reInit', onInit);
  emblaApi.value?.on('reInit', onSelect);
  emblaApi.value?.on('select', onSelect);
});

defineExpose({
  emblaRef,
  emblaApi,
});
</script>

<template>
  <APrimitive
    :as="as"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    @keydown="onKeyDown"
  >
    <div
      ref="emblaRef"
      :class="pohon.viewport({ class: props.pohon?.viewport })"
    >
      <div :class="pohon.container({ class: props.pohon?.container })">
        <div
          v-for="(item, index) in items"
          :key="index"
          role="group"
          aria-roledescription="slide"
          :class="pohon.item({ class: props.pohon?.item })"
        >
          <slot
            :item="item"
            :index="index"
          />
        </div>
      </div>
    </div>

    <div
      v-if="arrows || dots"
      :class="pohon.controls({ class: props.pohon?.controls })"
    >
      <div
        v-if="arrows"
        :class="pohon.arrows({ class: props.pohon?.arrows })"
      >
        <PButton
          :disabled="!canScrollPrev"
          :icon="prevIcon"
          size="md"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.prev')"
          v-bind="typeof prev === 'object' ? prev : undefined"
          :class="pohon.prev({ class: props.pohon?.prev })"
          @click="scrollPrev"
        />
        <PButton
          :disabled="!canScrollNext"
          :icon="nextIcon"
          size="md"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.next')"
          v-bind="typeof next === 'object' ? next : undefined"
          :class="pohon.next({ class: props.pohon?.next })"
          @click="scrollNext"
        />
      </div>

      <div
        v-if="dots"
        :class="pohon.dots({ class: props.pohon?.dots })"
      >
        <template
          v-for="(_, index) in scrollSnaps"
          :key="index"
        >
          <button
            :aria-label="t('carousel.goto', { slide: index + 1 })"
            :class="pohon.dot({ class: props.pohon?.dot, active: selectedIndex === index })"
            @click="scrollTo(index)"
          />
        </template>
      </div>
    </div>
  </APrimitive>
</template>
