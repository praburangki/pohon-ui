import type { UnpluginOptions } from 'unplugin';
import type { PohonOptions } from '../unplugin';
import { genSafeVariableName } from 'knitwork';
import MagicString from 'magic-string';
import { resolvePathSync } from 'mlly';

/**
 * This plugin provides the necessary transforms to allow loading the
 * Pohon _Nuxt_ plugins in `src/runtime/plugins/` in a pure Vue environment.
 */
export default function PluginsPlugin(options: PohonOptions) {
  const plugins: Array<string> = [];

  plugins.unshift(resolvePathSync('../runtime/vue/plugins/head', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url }));
  if (options.colorMode) {
    plugins.push(resolvePathSync('../runtime/vue/plugins/color-mode', { extensions: ['.ts', '.mjs', '.js'], url: import.meta.url }));
  }

  return {
    name: 'nuxt:pohon:plugins',
    enforce: 'pre',
    resolveId(id) {
      if (id === '@vinicunca/pohon/vue-plugin') {
        return 'virtual:nuxt-pohon-plugins';
      }
    },
    transform(code, id) {
      if (plugins.some((p) => id.startsWith(p)) && code.includes('import.meta.client')) {
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
    loadInclude: (id) => id === 'virtual:nuxt-pohon-plugins',
    load() {
      return `
        ${plugins.map((p) => `import ${genSafeVariableName(p)} from "${p}"`).join('\n')}
export default {
  install (app) {
${plugins.map((p) => `    app.use(${genSafeVariableName(p)})`).join('\n')}
  }
}
        `;
    },
    // Argument Vite specific configuration
    vite: {
      config() {
        return {
          // Opt-out Pohon from Vite's pre-bundling,
          // as we need Vite's pipeline to resolve imports like `#imports`
          optimizeDeps: {
            exclude: ['@vinicunca/pohon'],
          },
        };
      },
    },
  } satisfies UnpluginOptions;
}
