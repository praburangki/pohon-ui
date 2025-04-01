import type AlertTypes from '#build/pohon/alert';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export function getAlertTheme(colors: Array<string>): DeepPartial<typeof AlertTypes> {
  return {
    slots: {
      root: 'relative overflow-hidden w-full rounded-[calc(var(--ui-radius)*2)] p-4 flex gap-2.5',
      wrapper: 'min-w-0 flex-1 flex flex-col',
      title: 'text-sm font-medium',
      description: 'text-sm opacity-90',
      icon: 'shrink-0 size-5',
      avatar: 'shrink-0',
      avatarSize: '2xl',
      actions: 'flex flex-wrap gap-1.5 shrink-0',
      close: 'p-0',
    },
    variants: {
      orientation: {
        horizontal: {
          root: 'items-center',
          actions: 'items-center',
        },
        vertical: {
          root: 'items-start',
          actions: 'items-start mt-2.5',
        },
      },
      title: {
        true: {
          description: 'mt-1',
        },
      },
    },
    compoundVariants: [
      ...colors.map((color: any) => ({
        color,
        variant: 'solid' as const,
        class: {
          root: `bg-(--ui-${color}) text-(--ui-bg)`,
        },
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'outline' as const,
        class: {
          root: `text-(--ui-${color}) ring ring-inset ring-(--ui-${color})/25`,
        },
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'soft' as const,
        class: {
          root: `bg-(--ui-${color})/10 text-(--ui-${color})`,
        },
      })),
      ...colors.map((color: any) => ({
        color,
        variant: 'subtle' as const,
        class: {
          root: `bg-(--ui-${color})/10 text-(--ui-${color}) ring ring-inset ring-(--ui-${color})/25`,
        },
      })),
      {
        color: 'neutral',
        variant: 'solid',
        class: {
          root: 'text-(--ui-bg) bg-(--ui-bg-inverted)',
        },
      },
      {
        color: 'neutral',
        variant: 'outline',
        class: {
          root: 'text-(--ui-text-highlighted) bg-(--ui-bg) ring ring-inset ring-(--ui-border)',
        },
      },
      {
        color: 'neutral',
        variant: 'soft',
        class: {
          root: 'text-(--ui-text-highlighted) bg-(--ui-bg-elevated)/50',
        },
      },
      {
        color: 'neutral',
        variant: 'subtle',
        class: {
          root: 'text-(--ui-text-highlighted) bg-(--ui-bg-elevated)/50 ring ring-inset ring-(--ui-border-accented)',
        },
      },
    ],
  };
}
