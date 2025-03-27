import type { PohonOptions } from '../src/vite';
import vue from '@vitejs/plugin-vue';
import UnoCss from 'unocss/vite';
import { defineConfig } from 'vite';
import { PohonPluginVite, resolveColorsConfig } from '../src/vite';
import {
  avatarGroupTheme,
  avatarTheme,
  cardTheme,
  getBadgeTheme,
} from './src/themes';

const THEME_COLORS = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'];

const colorConfigs = resolveColorsConfig(THEME_COLORS);

const pohonOptions: PohonOptions = {
  pohon: {
    colors: {
      primary: 'green',
      neutral: 'slate',
      tertiary: 'indigo',
    },
    avatar: avatarTheme,
    avatarGroup: avatarGroupTheme,
    badge: getBadgeTheme(colorConfigs),
    card: cardTheme,
  },
  theme: {
    colors: THEME_COLORS,
  },
  components: {
    dirs: ['../playground/app/components'],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
  },
  plugins: [
    vue(),
    PohonPluginVite(pohonOptions),
    UnoCss(),
  ],
  optimizeDeps: {
    // prevents reloading page when navigating between components
    include: [
      '@vinicunca/akar/namespaced',
      'vaul-vue',
      'embla-carousel-vue',
      'embla-carousel-autoplay',
      'embla-carousel-auto-scroll',
      'embla-carousel-auto-height',
      'embla-carousel-class-names',
      'embla-carousel-fade',
      'embla-carousel-wheel-gestures',
    ],
  },
});
