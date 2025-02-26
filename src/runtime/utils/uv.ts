import type { AppConfig } from '@nuxt/schema';
import type { defaultConfig } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import { createUv } from 'unocss-variants';

const appConfigUv = appConfig_ as AppConfig & { pohon: { uv: typeof defaultConfig } };

export const uv = createUv(appConfigUv.pohon?.uv);
