import type { Plugin } from 'vue';
import { useDark } from '@vueuse/core';

export default {
  install() {
    useDark();
  },
} satisfies Plugin;
