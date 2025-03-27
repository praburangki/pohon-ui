import type { Resolver } from '@nuxt/kit';
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema';
import type { ModuleOptions } from './module';
import { fileURLToPath } from 'node:url';
import { addTemplate, addTypeTemplate } from '@nuxt/kit';
import { isFunction, toKebabCase } from '@vinicunca/perkakas';
import * as theme from './theme';

export function buildTemplates(options: ModuleOptions) {
  return Object.entries(theme).reduce((acc, [key, component]) => {
    acc[key] = isFunction(component)
      ? component(options as Required<ModuleOptions>)
      : component;
    return acc;
  }, {} as Record<string, any>);
}

export function getTemplates(options: ModuleOptions, pohonConfig: Record<string, any>) {
  const templates: Array<NuxtTemplate> = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const component in theme) {
    templates.push({
      filename: `pohon/${toKebabCase(component)}.ts`,

      write: true,

      getContents: async () => {
        const template = (theme as any)[component];
        const result = isFunction(template)
          ? template(options)
          : template;

        const variants = Object.entries(result.variants || {})
          .filter(([_, values]) => {
            const keys = Object.keys(values as Record<string, unknown>);
            return keys.some((key) => key !== 'true' && key !== 'false');
          })
          .map(([key]) => key);

        let json = JSON.stringify(result, null, 2);

        for (const variant of variants) {
          json = json.replace(new RegExp(`("${variant}": "[^"]+")`, 'g'), `$1 as typeof ${variant}[number]`);
          json = json.replace(new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'), (_, before, match, after) => {
            const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`);
            return `${before}${replaced}${after}`;
          });
        }

        function generateVariantDeclarations(variants: Array<string>) {
          return variants.map((variant) => {
            const keys = Object.keys(result.variants[variant]);
            return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const;`;
          });
        }

        // For local development, import directly from theme
        // eslint-disable-next-line node/prefer-global/process
        if (process.env.DEV) {
          const templatePath = fileURLToPath(new URL(`./theme/${toKebabCase(component)}`, import.meta.url));
          return [
            `import template from ${JSON.stringify(templatePath)};`,
            ...generateVariantDeclarations(variants),
            `const result = typeof template === 'function' ? template(${JSON.stringify(options, null, 2)}) : template;`,
            `const theme = ${json};`,
            'export default result as typeof theme;',
          ].join('\n\n');
        }

        // For production build
        return [
          ...generateVariantDeclarations(variants),
          `export default ${json};`,
        ].join('\n\n');
      },
    });
  }

  templates.push({
    filename: 'pohon/index.ts',
    write: true,
    getContents: () => Object.keys(theme).map((component) => `export { default as ${component} } from './${toKebabCase(component)}';`).join('\n'),
  });

  // FIXMEE: `typeof colors[number]` should include all colors from the theme
  templates.push({
    filename: 'types/pohon.d.ts',
    getContents: () => `import * as pohon from '#build/pohon';
import type { DeepPartial } from '@vinicunca/perkakas';
import type { defaultConfig } from 'unocss-variants';
import type { colors } from 'unocss/preset-mini';

const icons = ${JSON.stringify(pohonConfig.icons)};

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | (string & {});
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {});

type AppConfigPohon = {
  colors?: {
    ${options.theme?.colors?.map((color) => `${color}?: Color;`).join('\n\t\t')}
    neutral?: NeutralColor;
  }
  icons?: Partial<typeof icons>;
  uv?: typeof defaultConfig;
} & DeepPartial<typeof pohon>;

declare module '@nuxt/schema' {
  interface AppConfigInput {
    pohon?: AppConfigPohon;
  }
}

export {};
`,
  });

  templates.push({
    filename: 'pohon-image-component.ts',
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find((c) => c.pascalName === 'NuxtImg' && !c.filePath.includes('nuxt/dist/app'));

      return image ? `export { default } from "${image.filePath}"` : 'export default "img"';
    },
  });

  return templates;
}

export function addTemplates(
  options: ModuleOptions,
  nuxt: Nuxt,
  resolve: Resolver['resolve'],
) {
  const templates = getTemplates(options, nuxt.options.appConfig.pohon);
  for (const template of templates) {
    if (template.filename!.endsWith('.d.ts')) {
      addTypeTemplate(template as NuxtTypeTemplate);
    } else {
      addTemplate(template);
    }
  }

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: resolve('./runtime/types/app.config.d.ts') });
  });
}
