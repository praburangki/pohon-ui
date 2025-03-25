import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import PohonPlugin from '../src/vite';

import {
  avatarGroupTheme,
  avatarTheme,
  badgeTheme,
  cardTheme,
} from './src/themes';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
  },
  plugins: [
    vue(),
    PohonPlugin({
      pohon: {
        colors: {
          primary: 'green',
          neutral: 'slate',
        },
        avatar: avatarTheme,
        avatarGroup: avatarGroupTheme,
        badge: badgeTheme,
        card: cardTheme,
      },
      components: {
        dirs: ['../playground/app/components'],
      },
    }),
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
