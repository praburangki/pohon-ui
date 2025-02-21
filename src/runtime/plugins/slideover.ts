// FIXMEE: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app';

import type { SlideoverState } from '../composables/use-slideover';
import { defineNuxtPlugin } from '#imports';
import { shallowRef } from 'vue';
import { slideoverInjectionKey } from '../composables/use-slideover';

export default defineNuxtPlugin((nuxtApp) => {
  const slideoverState = shallowRef<SlideoverState>({
    component: 'div',
    props: {},
  });

  nuxtApp.vueApp.provide(slideoverInjectionKey, slideoverState);
});
