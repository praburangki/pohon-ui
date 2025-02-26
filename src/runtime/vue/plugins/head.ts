import type { Plugin } from 'vue';
import { createHead, setHeadInjectionHandler } from '@unhead/vue';

export default {
  install() {
    setHeadInjectionHandler(() => createHead());
  },
} satisfies Plugin;
