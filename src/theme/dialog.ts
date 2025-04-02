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
    transition: {
      true: {
        overlay: '',
        content: '',
      },
    },
    fullscreen: {
      true: {
        content: '',
      },
      false: {
        content: '',
      },
    },
  },
};
