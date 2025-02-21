import type * as pohon from '#build/pohon';

import type { colors } from 'unocss/preset-mini';
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types';
import type { Options as ComponentsOptions } from 'unplugin-vue-components/types';
import type { ModuleOptions } from './module';
import type { DeepPartial } from './runtime/types';
import type icons from './theme/icons';
import { createUnplugin } from 'unplugin';

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {});

type AppConfigPohon = {
  // TODO: add type hinting for colors from `options.theme.colors`
  colors?: Record<string, Color> & { neutral?: NeutralColor };
  icons?: Partial<typeof icons>;
} & DeepPartial<typeof pohon>;

export interface PohonOptions extends Omit<ModuleOptions, 'fonts' | 'colorMode'> {
  /** Whether to generate declaration files for auto-imported components. */
  dts?: boolean;
  pohon?: AppConfigPohon;
  /**
   * Enable or disable `@vueuse/core` color-mode integration
   * @defaultValue `true`
   */
  colorMode?: boolean;
  /**
   * Override options for `unplugin-auto-import`
   */
  autoImport?: Partial<AutoImportOptions>;
  /**
   * Override options for `unplugin-vue-components`
   */
  components?: Partial<ComponentsOptions>;
}

export const PohonPlugin = createUnplugin<PohonOptions | undefined>((options_ = {}, meta) => {

});
