export default {
  slots: {
    overlay: '',
    content: '',
    header: '',
    wrapper: '',
    body: '',
    footer: '',
    title: '',
    description: '',
    close: '',
  },
  variants: {
    side: {
      top: {
        content: '',
      },
      right: {
        content: '',
      },
      bottom: {
        content: '',
      },
      left: {
        content: '',
      },
    },
    transition: {
      true: {
        overlay: '',
      },
    },
  },
  compoundVariants: [{
    transition: true,
    side: 'top',
    class: {
      content: '',
    },
  }, {
    transition: true,
    side: 'right',
    class: {
      content: '',
    },
  }, {
    transition: true,
    side: 'bottom',
    class: {
      content: '',
    },
  }, {
    transition: true,
    side: 'left',
    class: {
      content: '',
    },
  }],
};
