import { pick } from '@vinicunca/perkakas';

import icons from './theme/icons';

export function getDefaultPohonConfig(colors?: Array<string>) {
  return {
    colors: pick({
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate',
    }, [...(colors || []), 'neutral' as any]),
    icons,
  };
}

export const defaultOptions = {
  prefix: 'P',
  fonts: true,
  colorMode: true,
  theme: {
    colors: undefined,
    transitions: true,
  },
  devtools: {
    enabled: true,
  },
};

export function resolveColors(colors?: Array<string>) {
  return colors?.length
    ? [...new Set(['primary', ...colors])]
    : ['primary', 'secondary', 'success', 'info', 'warning', 'error'];
}
