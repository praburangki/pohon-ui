import type { ModuleOptions } from '../module';
import { buttonGroupVariant } from './button-group';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: '',
    label: '',
    leadingIcon: '',
    leadingAvatar: '',
    leadingAvatarSize: '',
    trailingIcon: '',
  },
  variants: {
    ...buttonGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: '',
    },
    size: {
      xs: {
        base: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      sm: {
        base: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      md: {
        base: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      lg: {
        base: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
      xl: {
        base: '',
        leadingIcon: '',
        leadingAvatarSize: '',
        trailingIcon: '',
      },
    },
    block: {
      true: {
        base: '',
        trailingIcon: '',
      },
    },
    square: {
      true: '',
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
    active: {
      true: {
        base: '',
      },
      false: {
        base: '',
      },
    },
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'solid',
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'outline',
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'soft',
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'subtle',
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'ghost',
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'link',
      class: '',
    })),
    {
      color: 'neutral',
      variant: 'solid',
      class: '',
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: '',
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: '',
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: '',
    },
    {
      color: 'neutral',
      variant: 'ghost',
      class: '',
    },
    {
      color: 'neutral',
      variant: 'link',
      class: '',
    },
    {
      size: 'xs',
      square: true,
      class: '',
    },
    {
      size: 'sm',
      square: true,
      class: '',
    },
    {
      size: 'md',
      square: true,
      class: '',
    },
    {
      size: 'lg',
      square: true,
      class: '',
    },
    {
      size: 'xl',
      square: true,
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
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
});
