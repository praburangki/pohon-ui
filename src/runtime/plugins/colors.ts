// FIXMEE: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app';
import {
  defineNuxtPlugin,
  useAppConfig,
  useHead,
  useNuxtApp,
} from '#imports';
import { computed } from 'vue';

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();
  const nuxtApp = useNuxtApp();

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  function generateShades(key: string, value: string) {
    return shades.map((shade) => {
      const colorValue = value === 'neutral' ? 'old-neutral' : value;
      return `--pohon-color-${key}-${shade}: var(--colors-${colorValue}-${shade});`;
    }).join('\n  ');
  }
  function generateColor(key: string, shade: number) {
    return `--pohon-${key}: var(--pohon-color-${key}-${shade});`;
  }

  const root = computed(() => {
    const { neutral, ...colors } = appConfig.pohon.colors;

    return `@layer base {
  :root {
  ${Object.entries(appConfig.pohon.colors).map(([key, value]: [string, string]) => generateShades(key, value)).join('\n  ')}
  }
  :root, .light {
  ${Object.keys(colors).map((key) => generateColor(key, 500)).join('\n  ')}
  }
  .dark {
  ${Object.keys(colors).map((key) => generateColor(key, 400)).join('\n  ')}
  }
}`;
  });

  // Head
  const headData: any = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: 'nuxt-pohon-colors',
      type: 'text/css',
    }],
  };

  // SPA mode
  if (import.meta.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style');

    style.innerHTML = root.value;
    style.setAttribute('data-nuxt-pohon-colors', '');
    document.head.appendChild(style);

    headData.script = [{
      innerHTML: 'document.head.removeChild(document.querySelector(\'[data-nuxt-pohon-colors]\'))',
    }];
  }

  useHead(headData);
});
