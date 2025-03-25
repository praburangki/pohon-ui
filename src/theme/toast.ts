import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    wrapper: '',
    title: '',
    description: '',
    icon: '',
    avatar: '',
    avatarSize: '',
    actions: '',
    progress: '',
    close: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        root: '',
        icon: '',
        progress: '',
      }])),
      neutral: {
        root: '',
        icon: '',
        progress: '',
      },
    },
    orientation: {
      horizontal: {
        root: '',
        actions: '',
      },
      vertical: {
        root: '',
        actions: '',
      },
    },
    title: {
      true: {
        description: '',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
