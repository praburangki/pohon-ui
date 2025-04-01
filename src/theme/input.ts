import type { ModuleOptions } from '../module';
import { buttonGroupVariantWithRoot } from './button-group';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
    leading: '',
    leadingIcon: '',
    leadingAvatar: '',
    leadingAvatarSize: '',
    trailing: '',
    trailingIcon: '',
  },
  variants: {
    ...buttonGroupVariantWithRoot,
    size: {
      xs: {
        base: '',
        leading: '',
        trailing: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      sm: {
        base: '',
        leading: '',
        trailing: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      md: {
        base: '',
        leading: '',
        trailing: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      lg: {
        base: '',
        leading: '',
        trailing: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      xl: {
        base: '',
        leading: '',
        trailing: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
    },
    variant: {
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      none: '',
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    leading: {
      true: '',
    },
    trailing: {
      true: '',
    },
    loading: {
      true: '',
    },
    highlight: {
      true: '',
    },
    type: {
      file: '',
    },
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: ['outline', 'subtle'],
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      highlight: true,
      class: '',
    })),
    {
      color: 'neutral',
      variant: ['outline', 'subtle'],
      class: '',
    },
    {
      color: 'neutral',
      highlight: true,
      class: '',
    },
    {
      leading: true,
      size: 'xs',
      class: '',
    },
    {
      leading: true,
      size: 'sm',
      class: '',
    },
    {
      leading: true,
      size: 'md',
      class: '',
    },
    {
      leading: true,
      size: 'lg',
      class: '',
    },
    {
      leading: true,
      size: 'xl',
      class: '',
    },
    {
      trailing: true,
      size: 'xs',
      class: '',
    },
    {
      trailing: true,
      size: 'sm',
      class: '',
    },
    {
      trailing: true,
      size: 'md',
      class: '',
    },
    {
      trailing: true,
      size: 'lg',
      class: '',
    },
    {
      trailing: true,
      size: 'xl',
      class: '',
    },
    {
      loading: true,
      leading: true,
      class: {
        leadingIcon: '',
      },
    },
    {
      loading: true,
      leading: false,
      trailing: true,
      class: {
        trailingIcon: '',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline',
  },
});
