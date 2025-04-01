import type ButtonTypes from '#build/pohon/button';
import type { DeepPartial } from '@vinicunca/perkakas';
import { buttonGroupVariant } from './button-group';

// @unocss-include

export function getButtonTheme(colors: Array<string>): DeepPartial<typeof ButtonTypes> {
  return {
    slots: {
      base: 'rounded-[calc(var(--ui-radius)*1.5)] font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
      label: 'truncate',
      leadingIcon: 'shrink-0',
      leadingAvatar: 'shrink-0',
      leadingAvatarSize: '',
      trailingIcon: 'shrink-0',
    },
    variants: {
      ...buttonGroupVariant,
      size: {
        xs: {
          base: 'px-2 py-1 text-xs gap-1',
          leadingIcon: 'size-4',
          leadingAvatarSize: '3xs',
          trailingIcon: 'size-4',
        },
        sm: {
          base: 'px-2.5 py-1.5 text-xs gap-1.5',
          leadingIcon: 'size-4',
          leadingAvatarSize: '3xs',
          trailingIcon: 'size-4',
        },
        md: {
          base: 'px-2.5 py-1.5 text-sm gap-1.5',
          leadingIcon: 'size-5',
          leadingAvatarSize: '2xs',
          trailingIcon: 'size-5',
        },
        lg: {
          base: 'px-3 py-2 text-sm gap-2',
          leadingIcon: 'size-5',
          leadingAvatarSize: '2xs',
          trailingIcon: 'size-5',
        },
        xl: {
          base: 'px-3 py-2 text-base gap-2',
          leadingIcon: 'size-6',
          leadingAvatarSize: 'xs',
          trailingIcon: 'size-6',
        },
      },
      block: {
        true: {
          base: 'w-full justify-center',
          trailingIcon: 'ms-auto',
        },
      },
    },
    compoundVariants: [
      ...colors.map((color: any) => ({
        color,
        variant: 'solid' as const,
        class: `text-(--ui-bg) bg-(--ui-${color}) hover:bg-(--ui-${color})/75 disabled:bg-(--ui-${color}) aria-disabled:bg-(--ui-${color}) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-${color})`,
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'outline' as const,
        class: `ring ring-inset ring-(--ui-${color})/50 text-(--ui-${color}) hover:bg-(--ui-${color})/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-${color})`,
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'soft' as const,
        class: `text-(--ui-${color}) bg-(--ui-${color})/10 hover:bg-(--ui-${color})/15 focus:outline-none focus-visible:bg-(--ui-${color})/15 disabled:bg-(--ui-${color})/10 aria-disabled:bg-(--ui-${color})/10`,
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'subtle' as const,
        class: `text-(--ui-${color}) ring ring-inset ring-(--ui-${color})/25 bg-(--ui-${color})/10 hover:bg-(--ui-${color})/15 disabled:bg-(--ui-${color})/10 aria-disabled:bg-(--ui-${color})/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-${color})`,
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'ghost' as const,
        class: `text-(--ui-${color}) hover:bg-(--ui-${color})/10 focus:outline-none focus-visible:bg-(--ui-${color})/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`,
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'link' as const,
        class: `text-(--ui-${color}) hover:text-(--ui-${color})/75 disabled:text-(--ui-${color}) aria-disabled:text-(--ui-${color}) focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-${color})`,
      })),
      {
        color: 'neutral' as const,
        variant: 'solid' as const,
        class: 'text-(--ui-bg) bg-(--ui-bg-inverted) hover:bg-(--ui-bg-inverted)/90 disabled:bg-(--ui-bg-inverted) aria-disabled:bg-(--ui-bg-inverted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-border-inverted)',
      },
      {
        color: 'neutral' as const,
        variant: 'outline' as const,
        class: 'ring ring-inset ring-(--ui-border-accented) text-(--ui-text) bg-(--ui-bg) hover:bg-(--ui-bg-elevated) disabled:bg-(--ui-bg) aria-disabled:bg-(--ui-bg) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
      },
      {
        color: 'neutral' as const,
        variant: 'soft' as const,
        class: 'text-(--ui-text) bg-(--ui-bg-elevated) hover:bg-(--ui-bg-accented)/75 focus:outline-none focus-visible:bg-(--ui-bg-accented)/75 disabled:bg-(--ui-bg-elevated) aria-disabled:bg-(--ui-bg-elevated)',
      },
      {
        color: 'neutral' as const,
        variant: 'subtle' as const,
        class: 'ring ring-inset ring-(--ui-border-accented) text-(--ui-text) bg-(--ui-bg-elevated) hover:bg-(--ui-bg-accented)/75 disabled:bg-(--ui-bg-elevated) aria-disabled:bg-(--ui-bg-elevated) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
      },
      {
        color: 'neutral' as const,
        variant: 'ghost' as const,
        class: 'text-(--ui-text) hover:bg-(--ui-bg-elevated) focus:outline-none focus-visible:bg-(--ui-bg-elevated) hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent',
      },
      {
        color: 'neutral' as const,
        variant: 'link' as const,
        class: 'text-(--ui-text-muted) hover:text-(--ui-text) disabled:text-(--ui-text-muted) aria-disabled:text-(--ui-text-muted) focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-(--ui-border-inverted)',
      },
      {
        size: 'xs' as const,
        square: true,
        class: 'p-1',
      },
      {
        size: 'sm' as const,
        square: true,
        class: 'p-1.5',
      },
      {
        size: 'md' as const,
        square: true,
        class: 'p-1.5',
      },
      {
        size: 'lg' as const,
        square: true,
        class: 'p-2',
      },
      {
        size: 'xl' as const,
        square: true,
        class: 'p-2',
      },
      {
        loading: true,
        leading: true,
        class: {
          leadingIcon: 'animate-spin',
        },
      },
      {
        loading: true,
        leading: false,
        trailing: true,
        class: {
          trailingIcon: 'animate-spin',
        },
      },
    ],
  };
}
