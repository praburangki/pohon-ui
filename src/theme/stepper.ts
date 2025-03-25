import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    header: '',
    item: '',
    container: '',
    trigger: '',
    indicator: '',
    icon: '',
    separator: '',
    wrapper: '',
    title: '',
    description: '',
    content: '',
  },

  variants: {
    orientation: {
      horizontal: {
        root: '',
        container: '',
        separator: '',
        wrapper: '',
      },
      vertical: {
        header: '',
        item: '',
        separator: '',
      },
    },

    size: {
      xs: {
        trigger: '',
        icon: '',
        title: '',
        description: '',
        wrapper: '',
      },
      sm: {
        trigger: '',
        icon: '',
        title: '',
        description: '',
        wrapper: '',
      },
      md: {
        trigger: '',
        icon: '',
        title: '',
        description: '',
        wrapper: '',
      },
      lg: {
        trigger: '',
        icon: '',
        title: '',
        description: '',
        wrapper: '',
      },
      xl: {
        trigger: '',
        icon: '',
        title: '',
        description: '',
        wrapper: '',
      },
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        trigger: '',
        separator: '',
      }])),
      neutral: {
        trigger: '',
        separator: '',
      },
    },
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { separator: '' },
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { separator: '' },
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { separator: '' },
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { separator: '' },
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { separator: '' },
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { separator: '', item: '' },
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { separator: '', item: '' },
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { separator: '', item: '' },
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { separator: '', item: '' },
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { separator: '', item: '' },
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
