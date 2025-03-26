import { presetVinicunca } from '@vinicunca/unocss-preset';
import { defineConfig } from 'unocss';

export default defineConfig(
  {
    content: {
      filesystem: [
        './src/themes/*.ts',
      ],
    },
    outputToCssLayers: true,

    presets: [
      presetVinicunca(),
    ],
  },
);
