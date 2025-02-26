import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin';
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types';
import type { PohonOptions } from '../unplugin';

import { defu } from 'defu';
import { join } from 'pathe';
import AutoImport from 'unplugin-auto-import';
import { runtimeDir } from '../unplugin';

/**
 * This plugin adds all the Pohon composables as auto-imports.
 */
export default function AutoImportPlugin(options: PohonOptions, meta: UnpluginContextMeta): UnpluginOptions {
  const pluginOptions = defu(
    options.autoImport,
    <AutoImportOptions>{
      dts: options.dts ?? true,
      dirs: [join(runtimeDir, 'composables')],
    },
  );

  return AutoImport.raw(pluginOptions, meta) as UnpluginOptions;
}
