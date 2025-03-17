import type { Theme } from '@unocss/preset-wind3';
import type { PohonOptions } from './unplugin';
import { definePreset, LAYER_IMPORTS } from '@unocss/core';

export const presetPohon = definePreset<PohonOptions['pohon'], Theme>(
  async (options) => {
    return {
      name: 'unocss-preset-pohon',

      preflights: [
        {
          layer: LAYER_IMPORTS,
          getCSS: () => '@layer theme, base, components, utilities;',
        },
        {
          getCSS: () => compressCSS(generateColors(options)),
        },
        {
          layer: LAYER_IMPORTS,
          getCSS: () => compressCSS(generateBaseLayer()),
        },
      ],
    };
  },
);

function generateColors(options: PohonOptions['pohon']) {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  function generateShades(key: string, value: string) {
    return shades.map((shade) => {
      const colorValue = value === 'neutral' ? 'old-neutral' : value;
      return `--pohon-color-${key}-${shade}: var(--colors-${colorValue}-${shade});`;
    }).join('\n  ');
  }

  function generateColor(key: string, shade: number) {
    return `--pohon-${key}: var(--pohon-color-${key}-${shade});`;
  }

  const { neutral, ...colors } = options?.colors ?? {};

  const apa = `@layer base {
    :root {
    ${Object.entries(options?.colors ?? {}).map(([key, value]: [string, string]) => generateShades(key, value)).join('\n  ')}
    }
    :root, .light {
    ${Object.keys(colors).map((key) => generateColor(key, 500)).join('\n  ')}
    }
    .dark {
    ${Object.keys(colors).map((key) => generateColor(key, 400)).join('\n  ')}
    }
  }`;

  return apa;
}

function generateBaseLayer() {
  return `
@layer base {
  body {
    @apply antialiased text-$pohon-text bg-$pohon-bg color-scheme-light dark:color-scheme-dark;
  }

  :root, .light {
    --pohon-text-dimmed: var(--pohon-color-neutral-400);
    --pohon-text-muted: var(--pohon-color-neutral-500);
    --pohon-text-toned: var(--pohon-color-neutral-600);
    --pohon-text: var(--pohon-color-neutral-700);
    --pohon-text-highlighted: var(--pohon-color-neutral-900);

    --pohon-bg: var(--colors-white);
    --pohon-bg-muted: var(--pohon-color-neutral-50);
    --pohon-bg-elevated: var(--pohon-color-neutral-100);
    --pohon-bg-accented: var(--pohon-color-neutral-200);
    --pohon-bg-inverted: var(--pohon-color-neutral-900);

    --pohon-border: var(--pohon-color-neutral-200);
    --pohon-border-muted: var(--pohon-color-neutral-200);
    --pohon-border-accented: var(--pohon-color-neutral-300);
    --pohon-border-inverted: var(--pohon-color-neutral-900);

    --pohon-radius: var(--radius-sm);
    --pohon-container: var(--container-7xl);
  }

  .dark {
    --pohon-text-dimmed: var(--pohon-color-neutral-500);
    --pohon-text-muted: var(--pohon-color-neutral-400);
    --pohon-text-toned: var(--pohon-color-neutral-300);
    --pohon-text: var(--pohon-color-neutral-200);
    --pohon-text-highlighted: var(--colors-white);

    --pohon-bg: var(--pohon-color-neutral-900);
    --pohon-bg-muted: var(--pohon-color-neutral-800);
    --pohon-bg-elevated: var(--pohon-color-neutral-800);
    --pohon-bg-accented: var(--pohon-color-neutral-700);
    --pohon-bg-inverted: var(--colors-white);

    --pohon-border: var(--pohon-color-neutral-800);
    --pohon-border-muted: var(--pohon-color-neutral-700);
    --pohon-border-accented: var(--pohon-color-neutral-700);
    --pohon-border-inverted: var(--colors-white);
  }
}
  `;
}

function compressCSS(css: string) {
  return css.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '');
}
