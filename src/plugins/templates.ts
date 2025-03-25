import type { UnpluginOptions } from 'unplugin';

import type { PohonOptions } from '../unplugin';
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

  return {
    name: 'nuxt:pohon:templates',
    enforce: 'pre',
    resolveId(id) {
      if (templateKeys.has(`${id}.ts`)) {
        return `${id.replace('#build/', 'virtual:nuxt-pohon-templates/')}.ts`;
      }
    },
    loadInclude: (id) => templateKeys.has(id.replace('virtual:nuxt-pohon-templates/', '#build/')),
    load(id) {
      id = id.replace('virtual:nuxt-pohon-templates/', '#build/');
      const content = templates.find((t) => `#build/${t.filename}` === id)!.getContents!({} as any);
      return content;
    },
  } satisfies UnpluginOptions;
}
