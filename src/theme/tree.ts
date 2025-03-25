import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    item: '',
    listWithChildren: '',
    itemWithChildren: '',
    link: '',
    linkLeadingIcon: '',
    linkLabel: '',
    linkTrailing: '',
    linkTrailingIcon: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: '',
      }])),
      neutral: {
        link: '',
      },
    },
    size: {
      xs: {
        link: '',
        linkLeadingIcon: '',
        linkTrailingIcon: '',
      },
      sm: {
        link: '',
        linkLeadingIcon: '',
        linkTrailingIcon: '',
      },
      md: {
        link: '',
        linkLeadingIcon: '',
        linkTrailingIcon: '',
      },
      lg: {
        link: '',
        linkLeadingIcon: '',
        linkTrailingIcon: '',
      },
      xl: {
        link: '',
        linkLeadingIcon: '',
        linkTrailingIcon: '',
      },
    },
    selected: {
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
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    selected: true,
    class: {
      link: '',
    },
  })), {
    color: 'neutral',
    selected: true,
    class: {
      link: '',
    },
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
