// FIXMEE: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app';

import type { DialogState } from '../composables/use-dialog';
import { defineNuxtPlugin } from '#imports';
import { shallowRef } from 'vue';
import { dialogInjectionKey } from '../composables/use-dialog';

export default defineNuxtPlugin((nuxtApp) => {
  const dialogState = shallowRef<DialogState>({
    component: 'div',
    props: {},
  });

  nuxtApp.vueApp.provide(dialogInjectionKey, dialogState);
});
