// @unocss-include

import type BadgeTypes from '#build/pohon/badge';
import type { DeepPartial } from '@vinicunca/perkakas';

export function getBadgeTheme(colors: Array<string>): DeepPartial<typeof BadgeTypes> {
  return {
    slots: {
      base: 'font-medium inline-flex items-center',
      label: 'truncate',
      leadingIcon: 'shrink-0',
      leadingAvatar: 'shrink-0',
      leadingAvatarSize: '',
      trailingIcon: 'shrink-0',
    },

    compoundVariants: [
      ...colors.map((color: any) => ({
        color,
        variant: 'solid' as const,
        class: `bg-$pohon-brand-${color} color-$pohon-bg`,
      })),

      ...(colors).map((color: any) => ({
        color,
        variant: 'outline' as const,
        class: `color-$pohon-brand-${color} ring ring-inset ring-$pohon-brand-${color} ring-opacity-50`,
      })),

      ...(colors).map((color: any) => ({
        color,
        variant: 'soft' as const,
        class: `bg-$pohon-brand-${color} bg-opacity-10 color-$pohon-brand-${color}`,
      })),

      ...(colors).map((color: any) => ({
        color,
        variant: 'subtle' as const,
        class: `bg-$pohon-brand-${color} bg-opacity-10 color-$pohon-brand-${color} ring ring-inset ring-$pohon-brand-${color}/25`,
      })),

      {
        color: 'neutral',
        variant: 'solid',
        class: 'text-$pohon-bg bg-$pohon-bg-inverted',
      },
      {
        color: 'neutral',
        variant: 'outline',
        class: 'ring ring-inset ring-$pohon-border-accented text-$pohon-text bg-$pohon-bg',
      },
      {
        color: 'neutral',
        variant: 'soft',
        class: 'text-$pohon-text bg-$pohon-bg-elevated',
      },
      {
        color: 'neutral',
        variant: 'subtle',
        class: 'ring ring-inset ring-$pohon-border-accented text-$pohon-text bg-$pohon-bg-elevated',
      },

    ],

    variants: {
      size: {
        xs: {
          base: 'text-[8px]/3 px-1 py-0.5 gap-1 rounded-pohon',
          leadingIcon: 'size-3',
          leadingAvatarSize: '3xs',
          trailingIcon: 'size-3',
        },
        sm: {
          base: 'text-[10px]/3 px-1.5 py-1 gap-1 rounded-pohon',
          leadingIcon: 'size-3',
          leadingAvatarSize: '3xs',
          trailingIcon: 'size-3',
        },
        md: {
          base: 'text-xs px-2 py-1 gap-1 rounded-pohon-1.5',
          leadingIcon: 'size-4',
          leadingAvatarSize: '3xs',
          trailingIcon: 'size-4',
        },
        lg: {
          base: 'text-sm px-2 py-1 gap-1.5 rounded-pohon-1.5',
          leadingIcon: 'size-5',
          leadingAvatarSize: '2xs',
          trailingIcon: 'size-5',
        },
        xl: {
          base: 'text-base px-2.5 py-1 gap-1.5 rounded-pohon-1.5',
          leadingIcon: 'size-6',
          leadingAvatarSize: '2xs',
          trailingIcon: 'size-6',
        },
      },
    },
  };
}
