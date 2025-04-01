export default {
  slots: {
    root: '',
    viewport: '',
    container: '',
    item: '',
    controls: '',
    arrows: '',
    prev: '',
    next: '',
    dots: '',
    dot: '',
  },
  variants: {
    orientation: {
      vertical: {
        container: '',
        item: '',
        prev: '',
        next: '',
      },
      horizontal: {
        container: '',
        item: '',
        prev: '',
        next: '',
      },
    },
    active: {
      true: {
        dot: '',
      },
    },
  },
};
