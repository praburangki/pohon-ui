// @unocss-include
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
    close: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
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
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'solid',
      class: {
        root: '',
      },
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'outline',
      class: {
        root: '',
      },
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'soft',
      class: {
        root: '',
      },
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'subtle',
      class: {
        root: '',
      },
    })),
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        root: '',
      },
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        root: '',
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        root: '',
      },
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: {
        root: '',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
  },
});
