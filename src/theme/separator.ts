import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    border: '',
    container: '',
    icon: '',
    avatar: '',
    avatarSize: '',
    label: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, { border: '' }])),
      neutral: { border: '' },
    },
    orientation: {
      horizontal: {
        root: '',
        border: '',
        container: '',
      },
      vertical: {
        root: '',
        border: '',
        container: '',
      },
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
    type: {
      solid: {
        border: '',
      },
      dashed: {
        border: '',
      },
      dotted: {
        border: '',
      },
    },
  },
  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { border: '' },
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { border: '' },
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { border: '' },
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { border: '' },
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { border: '' },
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { border: '' },
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { border: '' },
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { border: '' },
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { border: '' },
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { border: '' },
  }],
  defaultVariants: {
    color: 'neutral',
    size: 'xs',
    type: 'solid',
  },
});
