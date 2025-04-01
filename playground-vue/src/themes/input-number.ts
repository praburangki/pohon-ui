import type InputNumberTypes from '#build/pohon/input-number';
import type { DeepPartial } from '@vinicunca/perkakas';
import { getInputTheme } from './input';

// @unocss-include

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';

export function getInputNumberTheme(colors: Array<Color>): DeepPartial<typeof InputNumberTypes> {
  const input = getInputTheme(colors);

  return {
    slots: {
      root: 'relative inline-flex items-center',
      base: 'w-full rounded-[calc(var(--ui-radius)*1.5)] border-0 placeholder:text-(--ui-text-dimmed) focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
      increment: 'absolute flex items-center',
      decrement: 'absolute flex items-center',
    },
    variants: {
      color: {
        ...Object.fromEntries(colors.map((color: Color) => [color, ''])),
        neutral: '',
      },
      size: {
        xs: 'px-2 py-1 text-xs gap-1',
        sm: 'px-2.5 py-1.5 text-xs gap-1.5',
        md: 'px-2.5 py-1.5 text-sm gap-1.5',
        lg: 'px-3 py-2 text-sm gap-2',
        xl: 'px-3 py-2 text-base gap-2',
      },
      variant: {
        ...input.variants?.variant,
      },
      disabled: {
        true: {
          increment: 'opacity-75 cursor-not-allowed',
          decrement: 'opacity-75 cursor-not-allowed',
        },
      },
      orientation: {
        horizontal: {
          base: 'text-center',
          increment: 'inset-y-0 end-0 pe-1',
          decrement: 'inset-y-0 start-0 ps-1',
        },
        vertical: {
          increment: 'top-0 end-0 pe-1 [&>button]:py-0 scale-80',
          decrement: 'bottom-0 end-0 pe-1 [&>button]:py-0 scale-80',
        },
      },
      highlight: {
        true: '',
      },
    },
    compoundVariants: [
      ...colors.map((color: Color) => ({
        color,
        variant: ['outline', 'subtle'],
        class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-${color})`,
      })),
      ...colors.map((color: Color) => ({
        color,
        highlight: true,
        class: `ring ring-inset ring-(--ui-${color})`,
      })),
      {
        color: 'neutral',
        variant: ['outline', 'subtle'],
        class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ui-border-inverted)',
      },
      {
        color: 'neutral',
        highlight: true,
        class: 'ring ring-inset ring-(--ui-border-inverted)',
      },
      {
        orientation: 'horizontal',
        size: 'xs',
        class: 'px-7',
      },
      {
        orientation: 'horizontal',
        size: 'sm',
        class: 'px-8',
      },
      {
        orientation: 'horizontal',
        size: 'md',
        class: 'px-9',
      },
      {
        orientation: 'horizontal',
        size: 'lg',
        class: 'px-10',
      },
      {
        orientation: 'horizontal',
        size: 'xl',
        class: 'px-11',
      },
      {
        orientation: 'vertical',
        size: 'xs',
        class: 'pe-7',
      },
      {
        orientation: 'vertical',
        size: 'sm',
        class: 'pe-8',
      },
      {
        orientation: 'vertical',
        size: 'md',
        class: 'pe-9',
      },
      {
        orientation: 'vertical',
        size: 'lg',
        class: 'pe-10',
      },
      {
        orientation: 'vertical',
        size: 'xl',
        class: 'pe-11',
      },
    ],
  };
}
