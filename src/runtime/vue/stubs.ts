import type { NuxtApp } from '#app';
import type { Ref, Plugin as VuePlugin } from 'vue';

import appConfig from '#build/app.config';
import { useColorMode as useColorModeVueUse } from '@vueuse/core';
import { ref } from 'vue';

export { useHead } from '@unhead/vue';
export { useRoute, useRouter } from 'vue-router';

export function useColorMode() {
  if (!appConfig.colorMode) {
    return {
      forced: true,
    };
  }

  const { store, system } = useColorModeVueUse();

  return {
    get preference() {
      return store.value === 'auto' ? 'system' : store.value;
    },
    set preference(value) {
      store.value = value === 'system' ? 'auto' : value;
    },
    get value() {
      return store.value === 'auto' ? system.value : store.value;
    },
    forced: false,
  };
}

export const useAppConfig = () => appConfig;

const state: Record<string, any> = {};

export function useState<T>(key: string, init: () => T): Ref<T> {
  if (state[key]) {
    return state[key] as Ref<T>;
  }
  const value = ref(init());
  state[key] = value;

  return value as Ref<T>;
}

export function useNuxtApp() {
  return {
    isHydrating: true,
    payload: { serverRendered: false },
  };
}

export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void) {
  return {
    install(app) {
      plugin({ vueApp: app } as NuxtApp);
    },
  } satisfies VuePlugin;
}
