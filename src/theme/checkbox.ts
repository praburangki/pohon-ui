import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
    container: '',
    wrapper: '',
    icon: '',
    label: '',
    description: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    size: {
      xs: {
        base: '',
        container: '',
        wrapper: '',
      },
      sm: {
        base: '',
        container: '',
        wrapper: '',
      },
      md: {
        base: '',
        container: '',
        wrapper: '',
      },
      lg: {
        base: '',
        container: '',
        wrapper: '',
      },
      xl: {
        base: '',
        container: '',
        wrapper: '',
      },
    },
    required: {
      true: {
        label: '',
      },
    },
    disabled: {
      true: {
        base: '',
        label: '',
        description: '',
      },
    },
    checked: {
      true: '',
    },
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    checked: true,
    class: '',
  })), {
    color: 'neutral',
    checked: true,
    class: '',
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
