import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
    container: '',
    thumb: '',
    icon: '',
    wrapper: '',
    label: '',
    description: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: '',
        icon: '',
      }])),
      neutral: {
        base: '',
        icon: '',
      },
    },
    size: {
      xs: {
        base: '',
        container: '',
        thumb: '',
        wrapper: '',
      },
      sm: {
        base: '',
        container: '',
        thumb: '',
        wrapper: '',
      },
      md: {
        base: '',
        container: '',
        thumb: '',
        wrapper: '',
      },
      lg: {
        base: '',
        container: '',
        thumb: '',
        wrapper: '',
      },
      xl: {
        base: '',
        container: '',
        thumb: '',
        wrapper: '',
      },
    },
    checked: {
      true: {
        icon: '',
      },
    },
    unchecked: {
      true: {
        icon: '',
      },
    },
    loading: {
      true: {
        icon: '',
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
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
