import type { UnpluginOptions } from 'unplugin';

import type { PohonOptions } from '../unplugin';

/**
 * This plugin injects Pohon configuration into the runtime build so Pohon components can
 * access it.
 */
export default function AppConfigPlugin(
  options: PohonOptions & { theme: NonNullable<PohonOptions['theme']> },
  appConfig: Record<string, any>,
) {
  return {
    name: 'nuxt:pohon:app-config',

    enforce: 'pre',

    resolveId(id) {
      if (id === '#build/app.config') {
        return 'virtual:nuxt-pohon-app-config';
      }
    },

    loadInclude: (id) => id === 'virtual:nuxt-pohon-app-config',

    load() {
      return `
          export default ${JSON.stringify(appConfig!)}
        `;
    },
  } satisfies UnpluginOptions;
}
