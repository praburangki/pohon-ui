/* eslint-disable node/prefer-global/process */
import { addCustomTab, startSubprocess } from '@nuxt/devtools-kit';
import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addVitePlugin,
  createResolver,
  defineNuxtModule,
  extendPages,
  hasNuxtModule,
  installModule,
} from '@nuxt/kit';
import { defu } from 'defu';
import { getPort } from 'get-port-please';
import sirv from 'sirv';
import { defaultOptions, getDefaultPohonConfig, resolveColors } from './defaults';
import { devtoolsMetaPlugin } from './devtools/meta';
import { addTemplates, buildTemplates } from './templates';

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

  /**
   * Configuration for the Pohon devtools.
   */
  devtools?: {
    /**
     * Enable or disable Pohon devtools.
     * @defaultValue `true`
     */
    enabled?: boolean;
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

    const plugin = await import('unocss/vite').then((r) => r.default);
    addVitePlugin(plugin());

    async function registerModule(
      name: string,
      key: string,
      options: Record<string, any>,
    ) {
      if (!hasNuxtModule(name)) {
        await installModule(name, options);
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options);
      }
    }

    await registerModule('@nuxt/icon', 'icon', { cssLayer: 'components' });
    if (options.fonts) {
      await registerModule('@nuxt/fonts', 'fonts', { experimental: { processCSSVariables: true } });
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', 'colorMode', { classSuffix: '', disableTransition: true });
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') });
    addPlugin({ src: resolve('./runtime/plugins/dialog') });
    addPlugin({ src: resolve('./runtime/plugins/slideover') });

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false,
    });

    addImportsDir(resolve('./runtime/composables'));

    addTemplates(options, nuxt, resolve);

    if (nuxt.options.dev && nuxt.options.devtools.enabled && options.devtools?.enabled) {
      const templates = buildTemplates(options);
      nuxt.options.vite = defu(
        nuxt.options?.vite,
        {
          plugins: [
            devtoolsMetaPlugin({ resolve, templates, options }),
          ],
        },
      );

      // Runs UI devtools in a subprocess for local development
      if (process.env.NUXT_POHON_DEVTOOLS_LOCAL) {
        const PORT = await getPort({ port: 42124 });
        nuxt.hook('app:resolve', () => {
          startSubprocess(
            {
              command: 'pnpm',
              args: ['nuxi', 'dev'],
              cwd: './devtools',
              stdio: 'pipe',
              env: {
                PORT: PORT.toString(),
              },
            },
            {
              id: 'pohon:devtools:local',
              name: 'Nuxt Pohon DevTools Local',
              icon: 'logos-nuxt-icon',
            },
            nuxt,
          );
        });

        nuxt.hook('vite:extendConfig', (config) => {
          config.server ||= {};
          config.server.proxy ||= {};
          config.server.proxy['/__nuxt_pohon__/devtools'] = {
            target: `http://localhost:${PORT}`,
            changeOrigin: true,
            followRedirects: true,
            ws: true,
            rewriteWsOrigin: true,
          };
        });
      } else {
        nuxt.hook('vite:serverCreated', async (server) => {
          server.middlewares.use('/__nuxt_pohon__/devtools', sirv(resolve('../dist/client/devtools'), {
            single: true,
            dev: true,
          }));
        });
      }

      nuxt.options.routeRules = defu(nuxt.options.routeRules, { '/__nuxt_pohon__/**': { ssr: false } });
      extendPages((pages) => {
        if (pages.length) {
          pages.unshift({
            name: 'pohon-devtools',
            path: '/__nuxt_pohon__/components/:slug',
            file: resolve('./devtools/runtime/devtools-renderer.vue'),
            meta: {
              layout: false,
            },
          });
        }
      });

      addCustomTab({
        name: 'nuxt-pohon',
        title: 'Nuxt Pohon',
        icon: '/__nuxt_pohon__/devtools/favicon.svg',
        view: {
          type: 'iframe',
          src: '/__nuxt_pohon__/devtools',
        },
      });
    }
  },
});
