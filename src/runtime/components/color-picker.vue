<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { MaybeRefOrGetter } from '@vueuse/shared';
import type { HSLObject } from 'colortranslator';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import colorPickerTheme from '#build/pohon/color-picker';
import { uv } from '../utils/uv';

const appConfigColorPicker = appConfig_ as AppConfig & {
  pohon: { colorPicker: Partial<typeof colorPickerTheme> };
};

const colorPickerFn = uv({
  extend: uv(colorPickerTheme),
  ...(appConfigColorPicker.pohon?.colorPicker || {}),
});

type ColorPickerVariants = VariantProps<typeof colorPickerFn>;

interface HSVColor {
  h: number;
  s: number;
  v: number;
}

function hslToHsv(hsl: HSLObject): HSVColor {
  const x = hsl.S * (hsl.L < 50 ? hsl.L : 100 - hsl.L);
  const v = hsl.L + (x / 100);

  return {
    h: hsl.H,
    s: hsl.L === 0 ? hsl.S : 2 * x / v,
    v,
  };
}

function hsvToHsl(hsv: HSVColor): HSLObject {
  const x = (200 - hsv.s) * hsv.v / 100;

  return {
    H: hsv.h,
    // eslint-disable-next-line sonar/no-nested-conditional
    S: x === 0 || x === 200 ? 0 : Math.round(hsv.s * hsv.v / (x <= 100 ? x : 200 - x)),
    L: Math.round(x / 2),
  };
}

export interface ColorPickerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  /**
   * Throttle time in ms for the color picker
   */
  throttle?: number;
  /**
   * Disable the color picker
   */
  disabled?: boolean;
  /**
   * The default value of the color picker
   */
  defaultValue?: string;
  /**
   * Format of the color
   * @defaultValue 'hex'
   */
  format?: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'lab';
  /**
   * @defaultValue 'md'
   */
  size?: ColorPickerVariants['size'];
  class?: ClassValue;
  pohon?: Partial<typeof colorPickerFn.slots>;
}

</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';
import { isBrowser } from '@vinicunca/perkakas';
import { useElementBounding, useEventListener, watchPausable, watchThrottled } from '@vueuse/core';
import { ColorTranslator } from 'colortranslator';
import { computed, nextTick, ref, toValue } from 'vue';

const props = withDefaults(
  defineProps<ColorPickerProps>(),
  {
    format: 'hex',
    throttle: 50,
    defaultValue: '#FFFFFF',
  },
);
const modelValue = defineModel<string>(undefined);

const pickedColor = computed<HSVColor>({
  get() {
    try {
      const color = new ColorTranslator(modelValue.value || props.defaultValue);

      return hslToHsv(color.HSLObject);
    } catch {
      return { h: 0, s: 0, v: 100 };
    }
  },
  set(value) {
    const color = new ColorTranslator(hsvToHsl(value), {
      decimals: 2,
      labUnit: 'percent',
      cmykUnit: 'percent',
      cmykFunction: 'cmyk',
    });

    switch (props.format) {
      case 'rgb':
        modelValue.value = color.RGB;
        break;
      case 'hsl':
        modelValue.value = color.HSL;
        break;
      case 'cmyk':
        modelValue.value = color.CMYK;
        break;
      case 'lab':
        modelValue.value = color.CIELab;
        break;
      case 'hex':
      default:
        modelValue.value = color.HEX;
    }
  },
});

function useColorDraggable(
  { targetElement, containerElement, axis = 'both', initialPosition = { x: 0, y: 0 }, disabled }:
  {
    targetElement: MaybeRefOrGetter<HTMLElement | null>;
    containerElement: MaybeRefOrGetter<HTMLElement | null>;
    axis?: 'x' | 'y' | 'both';
    initialPosition?: { x: number; y: number };
    disabled?: MaybeRefOrGetter<boolean | undefined>;
  },
) {
  const position = ref<{ x: number; y: number }>(initialPosition);
  const pressedDelta = ref<{ x: number; y: number }>();
  const targetRect = useElementBounding(targetElement);
  const containerRect = useElementBounding(containerElement);

  function start(event: PointerEvent) {
    if (toValue(disabled)) {
      return event.preventDefault();
    }

    const container = toValue(containerElement);

    pressedDelta.value = {
      x: event.clientX - (container ? event.clientX - containerRect.left.value + container.scrollLeft : targetRect.left.value),
      y: event.clientY - (container ? event.clientY - containerRect.top.value + container.scrollTop : targetRect.top.value),
    };

    move(event);
  }

  function move(event: PointerEvent) {
    if (!pressedDelta.value) {
      return;
    }

    const container = toValue(containerElement);
    let { x, y } = position.value;

    if (container && (axis === 'x' || axis === 'both')) {
      x = Math.min(Math.max(0, (event.clientX - pressedDelta.value.x) / container.scrollWidth * 100), 100);
    }

    if (container && (axis === 'y' || axis === 'both')) {
      y = Math.min(Math.max(0, (event.clientY - pressedDelta.value.y) / container.scrollHeight * 100), 100);
    }

    position.value = { x, y };
  }

  function end() {
    if (!pressedDelta.value) {
      return;
    }

    pressedDelta.value = undefined;
  }

  if (isBrowser) {
    useEventListener(containerElement, 'pointerdown', start);
    useEventListener(window, 'pointermove', move);
    useEventListener(window, 'pointerup', end);
  }

  return {
    position,
  };
}

function normalizeHue(hue: number, dir: 'left' | 'right' = 'left'): number {
  if (dir === 'right') {
    return (hue * 100) / 360;
  }

  return (hue / 100) * 360;
}

function normalizeBrightness(brightness: number): number {
  return 100 - brightness;
}

const selectorRef = ref<HTMLDivElement | null>(null);
const selectorThumbRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const trackThumbRef = ref<HTMLDivElement | null>(null);

const disabled = computed(() => props.disabled);

const { position: selectorThumbPosition } = useColorDraggable({
  targetElement: selectorThumbRef,
  containerElement: selectorRef,
  axis: 'both',
  initialPosition: {
    x: pickedColor.value.s,
    y: normalizeBrightness(pickedColor.value.v),
  },
  disabled,
});

const { position: trackThumbPosition } = useColorDraggable({
  targetElement: trackThumbRef,
  containerElement: trackRef,
  axis: 'y',
  initialPosition: {
    x: 0,
    y: normalizeHue(pickedColor.value.h, 'right'),
  },
  disabled,
});

const {
  pause: pauseWatchColor,
  resume: resumeWatchColor,
} = watchPausable(
  pickedColor,
  (hsb) => {
    selectorThumbPosition.value = {
      x: hsb.s,
      y: normalizeBrightness(hsb.v),
    };
    trackThumbPosition.value = {
      x: 0,
      y: normalizeHue(hsb.h, 'right'),
    };
  },
);

watchThrottled(
  [selectorThumbPosition, trackThumbPosition],
  () => {
    pauseWatchColor();

    pickedColor.value = {
      h: normalizeHue(trackThumbPosition.value.y),
      s: selectorThumbPosition.value.x,
      v: normalizeBrightness(selectorThumbPosition.value.y),
    };

    nextTick(resumeWatchColor);
  },
  { throttle: () => props.throttle },
);

const trackThumbColor = computed(() =>
  new ColorTranslator(
    hsvToHsl({
      h: normalizeHue(trackThumbPosition.value.y),
      s: 100,
      v: 100,
    }),
  ).HEX,
);

const selectorStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
}));

const selectorThumbStyle = computed(() => ({
  backgroundColor: new ColorTranslator(modelValue.value || props.defaultValue).HEX,
  left: `${selectorThumbPosition.value.x}%`,
  top: `${selectorThumbPosition.value.y}%`,
}));

const trackThumbStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
  top: `${trackThumbPosition.value.y}%`,
}));

const pohon = computed(() => colorPickerFn({
  size: props.size,
}));
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
    :data-disabled="disabled ? true : undefined"
  >
    <div :class="pohon.picker({ class: props.pohon?.picker })">
      <div
        ref="selectorRef"
        :class="pohon.selector({ class: props.pohon?.selector })"
        :style="selectorStyle"
      >
        <div
          :class="pohon.selectorBackground({ class: props.pohon?.selectorBackground })"
          data-color-picker-background
        >
          <div
            ref="selectorThumbRef"
            :class="pohon.selectorThumb({ class: props.pohon?.selectorThumb })"
            :style="selectorThumbStyle"
            :data-disabled="disabled ? true : undefined"
          />
        </div>
      </div>
      <div
        ref="trackRef"
        :class="pohon.track({ class: props.pohon?.track })"
        data-color-picker-track
      >
        <div
          ref="trackThumbRef"
          :class="pohon.trackThumb({ class: props.pohon?.trackThumb })"
          :style="trackThumbStyle"
          :data-disabled="disabled ? true : undefined"
        />
      </div>
    </div>
  </APrimitive>
</template>

<style scoped>
[data-color-picker-background] {
  background-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

[data-color-picker-track] {
  background-image: linear-gradient(0deg, red 0, #f0f 17%, #00f 33%, #0ff 50%, #0f0 67%, #ff0 83%, red);
}
</style>
