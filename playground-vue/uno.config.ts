import { presetVinicunca } from '@vinicunca/unocss-preset';
import { defineConfig } from 'unocss';

const THEME_COLORS = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];

export default defineConfig(
  {
    content: {
      filesystem: [
        './src/themes/*.ts',
      ],
    },
    outputToCssLayers: true,

    theme: {
      font: {
        sans: 'Public Sans, sans-serif',
      },
    },

    presets: [
      presetVinicunca(),
    ],

    rules: [
      ['rounded-pohon', {
        'border-radius': 'var(--pohon-radius)',
      }],
      [/^rounded-pohon-(\d+(?:\.\d+)?|\.\d+)$/, ([_, n]) => ({
        'border-radius': `calc(var(--pohon-radius) * ${n})`,
      })],
    ],

    safelist: [
      ...THEME_COLORS.map(
        (color) => {
          return [
            `bg-$pohon-brand-${color}`,
            `color-$pohon-brand-${color}`,
            `ring-$pohon-brand-${color}`,
          ];
        },
      ).flat(),
    ],
  },
);
