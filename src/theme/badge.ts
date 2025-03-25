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
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'solid' as const,
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'outline' as const,
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'soft' as const,
      class: '',
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'subtle' as const,
      class: '',
    })),
    {
      color: 'neutral',
      variant: 'solid' as const,
      class: '',
    },
    {
      color: 'neutral',
      variant: 'outline' as const,
      class: '',
    },
    {
      color: 'neutral',
      variant: 'soft' as const,
      class: '',
    },
    {
      color: 'neutral',
      variant: 'subtle' as const,
      class: '',
    },
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
});
