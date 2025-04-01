import type SkeletonTypes from '#build/pohon/skeleton';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const skeletonTheme: DeepPartial<typeof SkeletonTypes> = {
  base: 'animate-pulse rounded-[calc(var(--ui-radius)*1.5)] bg-(--ui-bg-elevated)',
};
