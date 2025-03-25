export default {
  slots: {
    root: '',
    item: '',
    header: '',
    trigger: '',
    content: '',
    body: '',
    leadingIcon: '',
    trailingIcon: '',
    label: '',
  },
  variants: {
    disabled: {
      true: {
        trigger: '',
      },
    },
  },
};
