import type PopoverTypes from '#build/pohon/popover';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const popoverTheme: DeepPartial<typeof PopoverTypes> = {
  slots: {
    content: 'bg-(--ui-bg) shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-(--ui-border) data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] focus:outline-none pointer-events-auto',
    arrow: 'fill-(--ui-border)',
  },
};
