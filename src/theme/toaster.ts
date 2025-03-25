export default {
  slots: {
    viewport: '',
    base: '',
  },
  variants: {
    position: {
      'top-left': {
        viewport: '',
      },
      'top-center': {
        viewport: '',
      },
      'top-right': {
        viewport: '',
      },
      'bottom-left': {
        viewport: '',
      },
      'bottom-center': {
        viewport: '',
      },
      'bottom-right': {
        viewport: '',
      },
    },
    swipeDirection: {
      up: '',
      right: '',
      down: '',
      left: '',
    },
  },
  compoundVariants: [
    {
      position: ['top-left', 'top-center', 'top-right'],
      class: {
        viewport: '',
        base: '',
      },
    },
    {
      position: ['bottom-left', 'bottom-center', 'bottom-right'],
      class: {
        viewport: '',
        base: '',
      },
    },
    {
      swipeDirection: ['left', 'right'],
      class: '',
    },
    {
      swipeDirection: ['up', 'down'],
      class: '',
    },
  ],
  defaultVariants: {
    position: 'bottom-right',
  },
};
