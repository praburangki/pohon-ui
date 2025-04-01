import type { UnpluginOptions } from 'unplugin';
import type { PohonOptions } from '../unplugin';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { getTemplates } from '../templates';

/**
 * This plugin is responsible for getting the generated virtual templates and
 * making them available to the Vue build.
 */
export default function TemplatePlugin(
  options: PohonOptions,
  appConfig: Record<string, any>,
) {
  const templates = getTemplates(options, appConfig.ui);
  const templateKeys = new Set(templates.map((t) => `#build/${t.filename}`));

  const projectRoot = options.projectRoot || process.cwd();

  const outputDir = resolve(projectRoot, './.vite/pohon');

  return {
    name: 'nuxt:pohon:templates',
    enforce: 'pre',
    resolveId(id) {
      if (templateKeys.has(`${id}.ts`)) {
        return `${id.replace('#build/', 'virtual:nuxt-pohon-templates/')}.ts`;
      }
    },
    loadInclude: (id) => templateKeys.has(id.replace('virtual:nuxt-pohon-templates/', '#build/')),
    async load(id) {
      id = id.replace('virtual:nuxt-pohon-templates/', '#build/');

      // Create directory if it doesn't exist
      await mkdir(outputDir, { recursive: true });

      const template = templates.find((t) => `#build/${t.filename}` === id)!;
      const content = await template.getContents!({} as any);
      const filename = template.filename!.replace('pohon/', '');
      const filePath = resolve(outputDir, filename);

      await writeFile(filePath, content, 'utf-8');

      return content;
    },
  } satisfies UnpluginOptions;
}
