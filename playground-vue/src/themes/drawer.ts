import type DrawerTypes from '#build/pohon/drawer';
import type { DeepPartial } from '@vinicunca/perkakas';

// @unocss-include

export const drawerTheme: DeepPartial<typeof DrawerTypes> = {
  slots: {
    overlay: 'fixed inset-0 bg-(--ui-bg-elevated)/75',
    content: 'fixed bg-(--ui-bg) ring ring-(--ui-border) flex focus:outline-none',
    handle: 'shrink-0 !bg-(--ui-bg-accented) transition-opacity',
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: '',
    title: 'text-(--ui-text-highlighted) font-semibold',
    description: 'mt-1 text-(--ui-text-muted) text-sm',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5',
  },
  variants: {
    direction: {
      top: {
        content: 'mb-24 flex-col-reverse',
        handle: 'mb-4',
      },
      right: {
        content: 'flex-row',
        handle: '!ml-4',
      },
      bottom: {
        content: 'mt-24 flex-col',
        handle: 'mt-4',
      },
      left: {
        content: 'flex-row-reverse',
        handle: '!mr-4',
      },
    },
    inset: {
      true: {
        content: 'rounded-[calc(var(--ui-radius)*2)] after:hidden',
      },
    },
  },
  compoundVariants: [
    {
      direction: 'top',
      class: {
        content: 'h-auto max-h-[96%]',
        handle: '!w-12 !h-1.5 mx-auto',
      },
    },
    {
      direction: 'bottom',
      class: {
        content: 'h-auto max-h-[96%]',
        handle: '!w-12 !h-1.5 mx-auto',
      },
    },
    {
      direction: 'right',
      class: {
        content: 'w-auto max-w-[calc(100%-2rem)]',
        handle: '!h-12 !w-1.5 mt-auto mb-auto',
      },
    },
    {
      direction: 'left',
      class: {
        content: 'w-auto max-w-[calc(100%-2rem)]',
        handle: '!h-12 !w-1.5 mt-auto mb-auto',
      },
    },
    {
      direction: 'top',
      inset: true,
      class: {
        content: 'inset-x-4 top-4',
      },
    },
    {
      direction: 'top',
      inset: false,
      class: {
        content: 'inset-x-0 top-0 rounded-b-[calc(var(--ui-radius)*2)]',
      },
    },
    {
      direction: 'bottom',
      inset: true,
      class: {
        content: 'inset-x-4 bottom-4',
      },
    },
    {
      direction: 'bottom',
      inset: false,
      class: {
        content: 'inset-x-0 bottom-0 rounded-t-[calc(var(--ui-radius)*2)]',
      },
    },
    {
      direction: 'left',
      inset: true,
      class: {
        content: 'inset-y-4 left-4',
      },
    },
    {
      direction: 'left',
      inset: false,
      class: {
        content: 'inset-y-0 left-0 rounded-r-[calc(var(--ui-radius)*2)]',
      },
    },
    {
      direction: 'right',
      inset: true,
      class: {
        content: 'inset-y-4 right-4',
      },
    },
    {
      direction: 'right',
      inset: false,
      class: {
        content: 'inset-y-0 right-0 rounded-l-[calc(var(--ui-radius)*2)]',
      },
    },
  ],
};
