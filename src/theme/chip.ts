import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    size: {
      '3xs': '',
      '2xs': '',
      'xs': '',
      'sm': '',
      'md': '',
      'lg': '',
      'xl': '',
      '2xl': '',
      '3xl': '',
    },
    position: {
      'top-right': '',
      'bottom-right': '',
      'top-left': '',
      'bottom-left': '',
    },
    inset: {
      false: '',
    },
    standalone: {
      false: '',
    },
  },
  compoundVariants: [{
    position: 'top-right',
    inset: false,
    class: '',
  }, {
    position: 'bottom-right',
    inset: false,
    class: '',
  }, {
    position: 'top-left',
    inset: false,
    class: '',
  }, {
    position: 'bottom-left',
    inset: false,
    class: '',
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    position: 'top-right',
  },
});
