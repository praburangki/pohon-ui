import type { UnpluginOptions } from 'unplugin';
import MagicString from 'magic-string';
import { resolvePathSync } from 'mlly';
import { normalize } from 'pathe';

import { runtimeDir } from '../unplugin';

/**
 * This plugin normalizes Nuxt environment (#imports) and `import.meta.client` within the Nuxt UI components.
 */
export default function NuxtEnvironmentPlugin() {
  const stubPath = resolvePathSync('../runtime/vue/stubs', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url });

  return {
    name: 'nuxt:pohon',
    enforce: 'pre',
    resolveId(id) {
      // this is implemented here rather than in a vite `config` hook for cross-builder support
      if (id === '#imports') {
        return stubPath;
      }
    },
    transformInclude(id) {
      return normalize(id).includes(runtimeDir);
    },
    transform(code) {
      if (code.includes('import.meta.client')) {
        const s = new MagicString(code);
        s.replaceAll('import.meta.client', 'true');

        if (s.hasChanged()) {
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true }),
          };
        }
      }
    },
  } satisfies UnpluginOptions;
}
