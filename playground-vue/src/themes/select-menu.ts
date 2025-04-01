import type SelectMenuTypes from '#build/pohon/select-menu';
import type { DeepPartial } from '@vinicunca/perkakas';
import { defu } from 'defu';
import { selectTheme } from './select';

// @unocss-include

export const selectMenuTheme: DeepPartial<typeof SelectMenuTypes> = defu({
  slots: {
    input: 'border-b border-(--ui-border)',
    focusScope: 'flex flex-col min-h-0',
  },
}, selectTheme);
