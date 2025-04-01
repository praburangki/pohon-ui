import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    content: '',
    group: '',
    label: '',
    separator: '',
    item: '',
    itemLeadingIcon: '',
    itemLeadingAvatar: '',
    itemLeadingAvatarSize: '',
    itemTrailing: '',
    itemTrailingIcon: '',
    itemTrailingKbds: '',
    itemTrailingKbdsSize: '',
    itemLabel: '',
    itemLabelExternalIcon: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
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
    size: {
      xs: {
        label: '',
        item: '',
        itemLeadingIcon: '',
        itemLeadingAvatarSize: '',
        itemTrailingIcon: '',
        itemTrailingKbds: '',
        itemTrailingKbdsSize: '',
      },
      sm: {
        label: '',
        item: '',
        itemLeadingIcon: '',
        itemLeadingAvatarSize: '',
        itemTrailingIcon: '',
        itemTrailingKbds: '',
        itemTrailingKbdsSize: '',
      },
      md: {
        label: '',
        item: '',
        itemLeadingIcon: '',
        itemLeadingAvatarSize: '',
        itemTrailingIcon: '',
        itemTrailingKbds: '',
        itemTrailingKbdsSize: '',
      },
      lg: {
        label: '',
        item: '',
        itemLeadingIcon: '',
        itemLeadingAvatarSize: '',
        itemTrailingIcon: '',
        itemTrailingKbds: '',
        itemTrailingKbdsSize: '',
      },
      xl: {
        label: '',
        item: '',
        itemLeadingIcon: '',
        itemLeadingAvatarSize: '',
        itemTrailingIcon: '',
        itemTrailingKbds: '',
        itemTrailingKbdsSize: '',
      },
    },
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      active: false,
      class: {
        item: '',
        itemLeadingIcon: '',
      },
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      active: true,
      class: {
        item: '',
        itemLeadingIcon: '',
      },
    })),
  ],
  defaultVariants: {
    size: 'md',
  },
});
