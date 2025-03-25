import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
    indicator: '',
    status: '',
    steps: '',
    step: '',
  },
  variants: {
    animation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': '',
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: '',
        steps: '',
      }])),
      neutral: {
        indicator: '',
        steps: '',
      },
    },
    size: {
      '2xs': {
        status: '',
        steps: '',
      },
      'xs': {
        status: '',
        steps: '',
      },
      'sm': {
        status: '',
        steps: '',
      },
      'md': {
        status: '',
        steps: '',
      },
      'lg': {
        status: '',
        steps: '',
      },
      'xl': {
        status: '',
        steps: '',
      },
      '2xl': {
        status: '',
        steps: '',
      },
    },
    step: {
      active: {
        step: '',
      },
      first: {
        step: '',
      },
      other: {
        step: '',
      },
      last: {
        step: '',
      },
    },
    orientation: {
      horizontal: {
        root: '',
        base: '',
        status: '',
      },
      vertical: {
        root: '',
        base: '',
        status: '',
      },
    },
    inverted: {
      true: {
        status: '',
      },
    },
  },
  compoundVariants: [{
    inverted: true,
    orientation: 'horizontal',
    class: {
      step: '',
      status: '',
    },
  }, {
    inverted: true,
    orientation: 'vertical',
    class: {
      steps: '',
      status: '',
    },
  }, {
    orientation: 'horizontal',
    size: '2xs',
    class: '',
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: '',
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: '',
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: '',
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: '',
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: '',
  }, {
    orientation: 'horizontal',
    size: '2xl',
    class: '',
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: '',
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: '',
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: '',
  }, {
    orientation: 'vertical',
    size: 'md',
    class: '',
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: '',
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: '',
  }, {
    orientation: 'vertical',
    size: '2xl',
    class: '',
  }, {
    orientation: 'horizontal',
    animation: 'carousel',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'vertical',
    animation: 'carousel',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'horizontal',
    animation: 'carousel-inverse',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'vertical',
    animation: 'carousel-inverse',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'horizontal',
    animation: 'swing',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'vertical',
    animation: 'swing',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'horizontal',
    animation: 'elastic',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'vertical',
    animation: 'elastic',
    class: {
      indicator: '',
    },
  }],
  defaultVariants: {
    animation: 'carousel',
    color: 'primary',
    size: 'md',
  },
});
