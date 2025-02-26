import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin';
import type { Options as ComponentsOptions } from 'unplugin-vue-components/types';
import type { PohonOptions } from '../unplugin';
import { toKebabCase, toPascalCase } from '@vinicunca/perkakas';
import { defu } from 'defu';

import { join, normalize } from 'pathe';
import { globSync } from 'tinyglobby';
import AutoImportComponents from 'unplugin-vue-components';
import { runtimeDir } from '../unplugin';

const RELATIVE_IMPORT_RE = /^\.{1,2}\//;

/**
 * This plugin adds all the Pohon components as auto-imports.
 */
export default function ComponentImportPlugin(
  options: PohonOptions & { prefix: NonNullable<PohonOptions['prefix']> },
  meta: UnpluginContextMeta,
) {
  const components = globSync('**/*.vue', { cwd: join(runtimeDir, 'components') });

  const componentNames = new Set(
    components.map(
      (c) => {
        const componentName = toPascalCase(c.replace(/\.vue$/, ''));
        return `${options.prefix}${componentName}`;
      },
    ),
  );

  const overrides = globSync('**/*.vue', { cwd: join(runtimeDir, 'vue/components') });
  const overrideNames = new Set(overrides.map((c) => `${options.prefix}${c.replace(/\.vue$/, '')}`));

  const pluginOptions = defu(
    options.components,
    <ComponentsOptions>{
      dts: options.dts ?? true,
      exclude: [/[\\/]node_modules[\\/](?!\.pnpm|@vinicunca\/pohon)/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      resolvers: [
        (componentName) => {
          const removedPrefix = componentName.slice(options.prefix.length);
          const fileName = toKebabCase(removedPrefix);

          if (overrideNames.has(componentName)) {
            return {
              name: 'default',
              from: join(
                runtimeDir,
                'vue/components',
                `${fileName}.vue`,
              ),
            };
          }

          if (componentNames.has(componentName)) {
            return {
              name: 'default',
              from: join(
                runtimeDir,
                'components',
                `${fileName}.vue`,
              ),

            };
          }
        },
      ],
    },
  );

  return [
    /**
     * This plugin aims to ensure we override certain components with Vue-compatible versions:
     * <PIcon> and <PLink> currently.
     */
    {
      name: 'nuxt:pohon:components',
      enforce: 'pre',
      resolveId(id, importer) {
        // only apply to runtime pohon components
        if (!importer || !normalize(importer).includes(runtimeDir)) {
          return;
        }

        // only apply to relative imports
        if (!RELATIVE_IMPORT_RE.test(id)) {
          return;
        }

        const filename = id.match(/([^/]+)\.vue$/)?.[1];
        if (filename && overrideNames.has(`${options.prefix}${filename}`)) {
          return join(runtimeDir, 'vue/components', `${filename}.vue`);
        }
      },
    },
    AutoImportComponents.raw(pluginOptions, meta) as UnpluginOptions,
  ] satisfies Array<UnpluginOptions>;
}
