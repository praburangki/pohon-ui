import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    list: '',
    label: '',
    item: '',
    link: '',
    linkLeadingIcon: '',
    linkLeadingAvatar: '',
    linkLeadingAvatarSize: '',
    linkTrailing: '',
    linkTrailingBadge: '',
    linkTrailingBadgeSize: '',
    linkTrailingIcon: '',
    linkLabel: '',
    linkLabelExternalIcon: '',
    childList: '',
    childItem: '',
    childLink: '',
    childLinkWrapper: '',
    childLinkIcon: '',
    childLinkLabel: '',
    childLinkLabelExternalIcon: '',
    childLinkDescription: '',
    separator: '',
    viewportWrapper: '',
    viewport: '',
    content: '',
    indicator: '',
    arrow: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: '',
        childLink: '',
      }])),
      neutral: {
        link: '',
        childLink: '',
      },
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    variant: {
      pill: '',
      link: '',
    },
    orientation: {
      horizontal: {
        root: '',
        list: '',
        item: '',
        link: '',
        childList: '',
      },
      vertical: {
        root: '',
        link: '',
      },
    },
    contentOrientation: {
      horizontal: {
        viewport: '',
        viewportWrapper: '',
        content: '',
      },
      vertical: {
        viewport: '',
        content: '',
      },
    },
    active: {
      true: {
        childLink: '',
        childLinkIcon: '',
      },
      false: {
        link: '',
        linkLeadingIcon: '',
        childLink: '',
        childLinkIcon: '',
      },
    },
    disabled: {
      true: {
        link: '',
      },
    },
    highlight: {
      true: '',
    },
    level: {
      true: '',
    },
    collapsed: {
      true: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      contentOrientation: 'horizontal',
      class: {
        childList: '',
      },
    },
    {
      orientation: 'horizontal',
      contentOrientation: 'vertical',
      class: {
        childList: '',
        content: '',
      },
    },
    {
      orientation: 'horizontal',
      highlight: true,
      class: {
        link: '',
      },
    },
    {
      orientation: 'vertical',
      highlight: true,
      level: true,
      class: {
        link: '',
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'pill',
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'pill',
      orientation: 'horizontal',
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    {
      disabled: false,
      variant: 'pill',
      highlight: true,
      orientation: 'horizontal',
      class: {
        link: '',
      },
    },
    {
      disabled: false,
      variant: 'pill',
      highlight: false,
      active: false,
      orientation: 'horizontal',
      class: {
        link: '',
      },
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'pill',
      active: true,
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    })),
    {
      color: 'neutral',
      variant: 'pill',
      active: true,
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    {
      variant: 'pill',
      active: true,
      highlight: false,
      class: {
        link: '',
      },
    },
    {
      variant: 'pill',
      active: true,
      highlight: true,
      class: {
        link: '',
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'link',
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'link',
      orientation: 'horizontal',
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'link',
      active: true,
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    })),
    {
      color: 'neutral',
      variant: 'link',
      active: true,
      class: {
        link: '',
        linkLeadingIcon: '',
      },
    },
    ...(options.theme.colors || []).map((highlightColor: string) => ({
      highlightColor,
      highlight: true,
      level: true,
      active: true,
      class: {
        link: '',
      },
    })),
    {
      highlightColor: 'neutral',
      highlight: true,
      level: true,
      active: true,
      class: {
        link: '',
      },
    },
    {
      orientation: 'vertical',
      collapsed: false,
      class: {
        childList: '',
        childItem: '',
      },
    },
    {
      orientation: 'vertical',
      collapsed: true,
      class: {
        link: '',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill',
  },
});
