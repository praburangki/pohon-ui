export default () => ({
  slots: {
    root: '',
    input: '',
    close: '',
    content: '',
    viewport: '',
    group: '',
    empty: '',
    label: '',
    item: '',
    itemLeadingIcon: '',
    itemLeadingAvatar: '',
    itemLeadingAvatarSize: '',
    itemLeadingChip: '',
    itemLeadingChipSize: '',
    itemTrailing: '',
    itemTrailingIcon: '',
    itemTrailingHighlightedIcon: '',
    itemTrailingKbds: '',
    itemTrailingKbdsSize: '',
    itemLabel: '',
    itemLabelBase: '',
    itemLabelPrefix: '',
    itemLabelSuffix: '',
  },
  variants: {
    active: {
      true: {
        item: '',
        itemLeadingIcon: '',
      },
      false: {
        item: '',
        itemLeadingIcon: '',
      },
    },
    loading: {
      true: {
        itemLeadingIcon: '',
      },
    },
  },
});
