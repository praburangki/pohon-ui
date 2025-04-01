import type ContainerTypes from '#build/pohon/container';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const containerTheme: DeepPartial<typeof ContainerTypes> = {
  base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8',
};
