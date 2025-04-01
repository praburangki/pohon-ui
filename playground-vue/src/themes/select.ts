import type SelectTypes from '#build/pohon/select';
import type { DeepPartial } from '@vinicunca/perkakas';
import { defuFn } from 'defu';
import { buttonGroupVariant } from './button-group';
import { getInputTheme } from './input';

// @unocss-include

export const selectTheme: DeepPartial<typeof SelectTypes> = defuFn({
  slots: {
    root: undefined,
    base: 'relative group rounded-[calc(var(--ui-radius)*1.5)] inline-flex items-center focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    value: 'truncate pointer-events-none',
    placeholder: 'truncate text-(--ui-text-dimmed)',
    arrow: 'fill-(--ui-border)',
    content: 'max-h-60 w-(--reka-popper-anchor-width) bg-(--ui-bg) shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-(--ui-border) overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] pointer-events-auto',
    viewport: 'divide-y divide-(--ui-border) scroll-py-1',
    group: 'p-1 isolate',
    empty: 'py-2 text-center text-sm text-(--ui-text-muted)',
    label: 'font-semibold text-(--ui-text-highlighted)',
    separator: '-mx-1 my-1 h-px bg-(--ui-border)',
    item: 'group relative w-full flex items-center select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-[calc(var(--ui-radius)*1.5)] data-disabled:cursor-not-allowed data-disabled:opacity-75 text-(--ui-text) data-highlighted:text-(--ui-text-highlighted) data-highlighted:before:bg-(--ui-bg-elevated)/50 transition-colors before:transition-colors',
    itemLeadingIcon: 'shrink-0 text-(--ui-text-dimmed) group-data-highlighted:text-(--ui-text) transition-colors',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemLeadingChip: 'shrink-0',
    itemLeadingChipSize: '',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0',
    itemLabel: 'truncate',
  },
  variants: {
    ...buttonGroupVariant,
    size: {
      xs: {
        label: 'p-1 text-[10px]/3 gap-1',
        item: 'p-1 text-xs gap-1',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailingIcon: 'size-4',
      },
      sm: {
        label: 'p-1.5 text-[10px]/3 gap-1.5',
        item: 'p-1.5 text-xs gap-1.5',
        itemLeadingIcon: 'size-4',
        itemLeadingAvatarSize: '3xs',
        itemLeadingChip: 'size-4',
        itemLeadingChipSize: 'sm',
        itemTrailingIcon: 'size-4',
      },
      md: {
        label: 'p-1.5 text-xs gap-1.5',
        item: 'p-1.5 text-sm gap-1.5',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailingIcon: 'size-5',
      },
      lg: {
        label: 'p-2 text-xs gap-2',
        item: 'p-2 text-sm gap-2',
        itemLeadingIcon: 'size-5',
        itemLeadingAvatarSize: '2xs',
        itemLeadingChip: 'size-5',
        itemLeadingChipSize: 'md',
        itemTrailingIcon: 'size-5',
      },
      xl: {
        label: 'p-2 text-sm gap-2',
        item: 'p-2 text-base gap-2',
        itemLeadingIcon: 'size-6',
        itemLeadingAvatarSize: 'xs',
        itemLeadingChip: 'size-6',
        itemLeadingChipSize: 'lg',
        itemTrailingIcon: 'size-6',
      },
    },
  },
}, getInputTheme([]));
