export default {
  slots: {
    root: '',
    list: '',
    item: '',
    link: '',
    linkLeadingIcon: '',
    linkLeadingAvatar: '',
    linkLeadingAvatarSize: '',
    linkLabel: '',
    separator: '',
    separatorIcon: '',
  },
  variants: {
    active: {
      true: {
        link: '',
      },
      false: {
        link: '',
      },
    },
    disabled: {
      true: {
        link: '',
      },
    },
    to: {
      true: '',
    },
  },
  compoundVariants: [
    {
      disabled: false,
      active: false,
      to: true,
      class: {
        link: '',
      },
    },
  ],
};
