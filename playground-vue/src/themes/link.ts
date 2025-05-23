import type LinkTypes from '#build/pohon/link';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const linkTheme: DeepPartial<typeof LinkTypes> = {
  base: 'focus-visible:outline-(--ui-primary)',
  variants: {
    active: {
      true: 'text-(--ui-primary)',
      false: 'text-(--ui-text-muted) hover:text-(--ui-text) transition-colors',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-75',
    },
  },
};
