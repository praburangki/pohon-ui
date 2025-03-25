import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    list: '',
    indicator: '',
    trigger: '',
    content: '',
    leadingIcon: '',
    leadingAvatar: '',
    leadingAvatarSize: '',
    label: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    variant: {
      pill: {
        list: '',
        trigger: '',
        indicator: '',
      },
      link: {
        list: '',
        indicator: '',
      },
    },
    orientation: {
      horizontal: {
        root: '',
        list: '',
        indicator: '',
        trigger: '',
      },
      vertical: {
        list: '',
        indicator: '',
      },
    },
    size: {
      xs: {
        trigger: '',
        leadingIcon: '',
        leadingAvatarSize: '',
      },
      sm: {
        trigger: '',
        leadingIcon: '',
        leadingAvatarSize: '',
      },
      md: {
        trigger: '',
        leadingIcon: '',
        leadingAvatarSize: '',
      },
      lg: {
        trigger: '',
        leadingIcon: '',
        leadingAvatarSize: '',
      },
      xl: {
        trigger: '',
        leadingIcon: '',
        leadingAvatarSize: '',
      },
    },
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'pill',
    class: {
      indicator: '',
    },
  }, {
    orientation: 'horizontal',
    variant: 'link',
    class: {
      list: '',
      indicator: '',
    },
  }, {
    orientation: 'vertical',
    variant: 'pill',
    class: {
      indicator: '',
      list: '',
    },
  }, {
    orientation: 'vertical',
    variant: 'link',
    class: {
      list: '',
      indicator: '',
    },
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: '',
      trigger: '',
    },
  })), {
    color: 'neutral',
    variant: 'pill',
    class: {
      indicator: '',
      trigger: '',
    },
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: {
      indicator: '',
      trigger: '',
    },
  })), {
    color: 'neutral',
    variant: 'link',
    class: {
      indicator: '',
      trigger: '',
    },
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md',
  },
});
