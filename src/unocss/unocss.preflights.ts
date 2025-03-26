import type { Preflight } from '@unocss/core';
import type { Theme } from '@unocss/preset-wind4';
import type { PohonOptions } from '../unplugin';
import { entries, isString } from '@vinicunca/perkakas';

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export function getPohonPreflights(options: PohonOptions['pohon']): Array<Preflight> {
  return [
    {
      getCSS: generateThemeColorsVariables(options),
    },
    {
      getCSS: generateBaseLayer(),
    },
  ];
}

function generateThemeColorsVariables(options: PohonOptions['pohon']): Preflight<Theme>['getCSS'] {
  return ({ theme }) => {
    const rootVariables = entries(options?.colors ?? {}).map(([themeName, colorName]) => {
      /**
       * themeName -> the name from options.colors
       * colorName -> the name from wind4Theme.colors
       */
      return generateShades({ themeName, colorName, colors: theme.colors });
    }).join('\n  ');

    const { neutral, ...colors } = options?.colors ?? {};

    const brandLight = Object.keys(colors).map((key) => generateColor(key, 500)).join('\n  ');
    const brandDark = Object.keys(colors).map((key) => generateColor(key, 400)).join('\n  ');

    return compressCSS(
      `:root {
       ${rootVariables}
      }

      :root, .light {
        ${brandLight}
      }

      .dark {
        ${brandDark}
      }`,
    );
  };
}

function generateShades(
  { themeName, colorName, colors }:
  { themeName: string; colorName: string; colors: Theme['colors'] },
) {
  return SHADES.map((shade) => {
    const colorFamily = colors?.[colorName];
    const colorValue = isString(colorFamily) ? colorFamily : colorFamily?.[shade.toString()];

    return `--pohon-color-${themeName}-${shade}: ${colorValue};`;
  }).join('\n  ');
}

function generateColor(key: string, shade: number) {
  return `--pohon-brand-${key}: var(--pohon-color-${key}-${shade});`;
}

function generateBaseLayer(): Preflight<Theme>['getCSS'] {
  return ({ theme }) => {
    const whiteColor = theme?.colors?.white;
    const defaultRadius = theme?.radius?.DEFAULT;

    return compressCSS(
      `body {
        @apply antialiased color-$pohon-text bg-$pohon-bg color-scheme-light dark:color-scheme-dark;
      }

      :root, .light {
        --pohon-text-dimmed: var(--pohon-color-neutral-400);
        --pohon-text-muted: var(--pohon-color-neutral-500);
        --pohon-text-toned: var(--pohon-color-neutral-600);
        --pohon-text: var(--pohon-color-neutral-700);
        --pohon-text-highlighted: var(--pohon-color-neutral-900);

        --pohon-bg: ${whiteColor};
        --pohon-bg-muted: var(--pohon-color-neutral-50);
        --pohon-bg-elevated: var(--pohon-color-neutral-100);
        --pohon-bg-accented: var(--pohon-color-neutral-200);
        --pohon-bg-inverted: var(--pohon-color-neutral-900);

        --pohon-border: var(--pohon-color-neutral-200);
        --pohon-border-muted: var(--pohon-color-neutral-200);
        --pohon-border-accented: var(--pohon-color-neutral-300);
        --pohon-border-inverted: var(--pohon-color-neutral-900);

        --pohon-radius: ${defaultRadius};
      }

      .dark {
        --pohon-text-dimmed: var(--pohon-color-neutral-500);
        --pohon-text-muted: var(--pohon-color-neutral-400);
        --pohon-text-toned: var(--pohon-color-neutral-300);
        --pohon-text: var(--pohon-color-neutral-200);
        --pohon-text-highlighted: ${whiteColor};

        --pohon-bg: var(--pohon-color-neutral-900);
        --pohon-bg-muted: var(--pohon-color-neutral-800);
        --pohon-bg-elevated: var(--pohon-color-neutral-800);
        --pohon-bg-accented: var(--pohon-color-neutral-700);
        --pohon-bg-inverted: ${whiteColor};

        --pohon-border: var(--pohon-color-neutral-800);
        --pohon-border-muted: var(--pohon-color-neutral-700);
        --pohon-border-accented: var(--pohon-color-neutral-700);
        --pohon-border-inverted: ${whiteColor};
      }`,
    );
  };
}

function compressCSS(css: string) {
  return css.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '');
}
