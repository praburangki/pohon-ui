import type CollapsibleTypes from '#build/pohon/collapsible';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const collapsibleTheme: DeepPartial<typeof CollapsibleTypes> = {
  slots: {
    root: '',
    content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden',
  },
};
