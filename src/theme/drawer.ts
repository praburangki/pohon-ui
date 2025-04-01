export default {
  slots: {
    overlay: '',
    content: '',
    handle: '',
    container: '',
    header: '',
    title: '',
    description: '',
    body: '',
    footer: '',
  },
  variants: {
    direction: {
      top: {
        content: '',
        handle: '',
      },
      right: {
        content: '',
        handle: '',
      },
      bottom: {
        content: '',
        handle: '',
      },
      left: {
        content: '',
        handle: '',
      },
    },
    inset: {
      true: {
        content: '',
      },
    },
  },
  compoundVariants: [
    {
      direction: ['top', 'bottom'],
      class: {
        content: '',
        handle: '',
      },
    },
    {
      direction: ['right', 'left'],
      class: {
        content: '',
        handle: '',
      },
    },
    {
      direction: 'top',
      inset: true,
      class: {
        content: '',
      },
    },
    {
      direction: 'top',
      inset: false,
      class: {
        content: '',
      },
    },
    {
      direction: 'bottom',
      inset: true,
      class: {
        content: '',
      },
    },
    {
      direction: 'bottom',
      inset: false,
      class: {
        content: '',
      },
    },
    {
      direction: 'left',
      inset: true,
      class: {
        content: '',
      },
    },
    {
      direction: 'left',
      inset: false,
      class: {
        content: '',
      },
    },
    {
      direction: 'right',
      inset: true,
      class: {
        content: '',
      },
    },
    {
      direction: 'right',
      inset: false,
      class: {
        content: '',
      },
    },
  ],
};
