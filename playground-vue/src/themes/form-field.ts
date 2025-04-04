import type FormFieldTypes from '#build/pohon/form-field';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const formFieldTheme: DeepPartial<typeof FormFieldTypes> = {
  slots: {
    root: '',
    wrapper: '',
    labelWrapper: 'flex content-center items-center justify-between',
    label: 'block font-medium text-(--ui-text)',
    container: 'mt-1 relative',
    description: 'text-(--ui-text-muted)',
    error: 'mt-2 text-(--ui-error)',
    hint: 'text-(--ui-text-muted)',
    help: 'mt-2 text-(--ui-text-muted)',
  },
  variants: {
    size: {
      xs: { root: 'text-xs' },
      sm: { root: 'text-xs' },
      md: { root: 'text-sm' },
      lg: { root: 'text-sm' },
      xl: { root: 'text-base' },
    },
    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-(--ui-error)',
      },
    },
  },
};
