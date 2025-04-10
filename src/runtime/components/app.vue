<script lang="ts">
import type { ConfigProviderProps, TooltipProviderProps } from '@vinicunca/akar';
import type { Locale, Messages, ToasterProps } from '../types';

export interface AppProps<T extends Messages = Messages> extends Omit<ConfigProviderProps, 'useId' | 'dir' | 'locale'> {
  tooltip?: TooltipProviderProps;
  toaster?: ToasterProps | null;
  locale?: Locale<T>;
}

export interface AppSlots {
  default: (props?: {}) => any;
}

export default {
  name: 'PohonApp',
};
</script>

<script setup lang="ts" generic="T extends Messages">
import { ConfigProvider, TooltipProvider, useForwardProps } from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';
import { provide, toRef, useId } from 'vue';
import { localeContextInjectionKey } from '../composables/useLocale';
import UOverlayProvider from './OverlayProvider.vue';
import UToaster from './toaster.vue';

const props = defineProps<AppProps<T>>();
defineSlots<AppSlots>();

const configProviderProps = useForwardProps(reactivePick(props, 'scrollBody'));
const tooltipProps = toRef(() => props.tooltip);
const toasterProps = toRef(() => props.toaster);

const locale = toRef(() => props.locale);
provide(localeContextInjectionKey, locale);
</script>

<template>
  <ConfigProvider
    :use-id="() => (useId() as string)"
    :dir="locale?.dir"
    :locale="locale?.code"
    v-bind="configProviderProps"
  >
    <TooltipProvider v-bind="tooltipProps">
      <UToaster
        v-if="toaster !== null"
        v-bind="toasterProps"
      >
        <slot />
      </UToaster>
      <slot v-else />

      <UOverlayProvider />
    </TooltipProvider>
  </ConfigProvider>
</template>
