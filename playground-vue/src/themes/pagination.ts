import type PaginationTypes from '#build/pohon/pagination';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const paginationTheme: DeepPartial<typeof PaginationTypes> = {
  slots: {
    root: '',
    list: 'flex items-center gap-1',
    ellipsis: 'pointer-events-none',
    label: 'min-w-5 text-center',
    first: '',
    prev: '',
    item: '',
    next: '',
    last: '',
  },
};
