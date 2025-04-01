import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
  },
  variants: {
    size: {
      xs: {
        base: '',
      },
      sm: {
        base: '',
      },
      md: {
        base: '',
      },
      lg: {
        base: '',
      },
      xl: {
        base: '',
      },
    },
    variant: {
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      none: '',
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    highlight: {
      true: '',
    },
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: ['outline', 'subtle'],
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      highlight: true,
      class: '',
    })),
    {
      color: 'neutral',
      variant: ['outline', 'subtle'],
      class: '',
    },
    {
      color: 'neutral',
      highlight: true,
      class: '',
    },
  ],
  defaultVariants: {
    size: '',
    color: '',
    variant: '',
  },
});
