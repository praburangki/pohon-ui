import type { Theme } from '@unocss/preset-wind3';
import type { PohonOptions } from '../unplugin';
import { definePreset } from '@unocss/core';
import { getPohonPreflights } from './unocss.preflights';

export const presetPohon = definePreset<PohonOptions['pohon'], Theme>(
  async (options) => {
    return {
      name: 'unocss-preset-pohon',

      preflights: [
        ...getPohonPreflights(options),
      ],
    };
  },
);
