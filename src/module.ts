import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  hasNuxtModule,
  installModule,
} from '@nuxt/kit';
import { defu } from 'defu';
import { defaultOptions, getDefaultPohonConfig, resolveColors } from './defaults';
import { addTemplates } from './templates';

export type * from './runtime/types';

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `P`
   * @link https://pohon.vinicunca.dev/getting-started/installation/nuxt#prefix
   */
  prefix?: string;

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @link https://pohon.vinicunca.dev/getting-started/installation/nuxt#fonts
   */
  fonts?: boolean;

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @link https://pohon.vinicunca.dev/getting-started/installation/nuxt#colormode
   */
  colorMode?: boolean;

  /**
   * Customize how the theme is generated
   * @link https://pohon.vinicunca.dev/getting-started/theme
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @link https://pohon.vinicunca.dev/getting-started/installation/nuxt#themecolors
     */
    colors?: Array<string>;

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @link https://pohon.vinicunca.dev/getting-started/installation/nuxt#themetransitions
     */
    transitions?: boolean;
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'pohon',
    configKey: 'pohon',
    compatibility: {
      nuxt: '>=3.14.0',
    },
    docs: 'https://pohon.vinicunca.dev/getting-started/installation/nuxt',
  },

  defaults: defaultOptions,

  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    options.theme = options.theme || {};
    options.theme.colors = resolveColors(options.theme.colors);

    nuxt.options.pohon = options;

    nuxt.options.alias['#pohon'] = resolve('./runtime');

    nuxt.options.appConfig.pohon = defu(
      nuxt.options.appConfig.pohon || {},
      getDefaultPohonConfig(options.theme.colors),
    );

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {};
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, 'isolate'].filter(Boolean).join(' ');

    async function registerModule(
      name: string,
      key: string,
      options: Record<string, any> = {},
    ) {
      if (!hasNuxtModule(name)) {
        await installModule(name, options);
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options);
      }
    }

    await registerModule('@nuxt/icon', 'icon', { cssLayer: 'components' });
    await registerModule('@unocss/nuxt', 'unocss');

    if (options.fonts) {
      await registerModule('@nuxt/fonts', 'fonts', { experimental: { processCSSVariables: true } });
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', 'colorMode', { classSuffix: '', disableTransition: true });
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') });

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false,
    });

    addImportsDir(resolve('./runtime/composables'));

    addTemplates(options, nuxt, resolve);
  },
});
