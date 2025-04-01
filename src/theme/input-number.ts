import type { ModuleOptions } from '../module';
import inputTheme from './input';

export default (options: Required<ModuleOptions>) => {
  const input = inputTheme(options);

  return {
    slots: {
      root: '',
      base: '',
      increment: '',
      decrement: '',
    },
    variants: {
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
        neutral: '',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      variant: {
        ...input.variants.variant,
      },
      disabled: {
        true: {
          increment: '',
          decrement: '',
        },
      },
      orientation: {
        horizontal: {
          base: '',
          increment: '',
          decrement: '',
        },
        vertical: {
          increment: '',
          decrement: '',
        },
      },
      highlight: {
        true: '',
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
        orientation: 'horizontal',
        size: 'xs',
        class: '',
      },
      {
        orientation: 'horizontal',
        size: 'sm',
        class: '',
      },
      {
        orientation: 'horizontal',
        size: 'md',
        class: '',
      },
      {
        orientation: 'horizontal',
        size: 'lg',
        class: '',
      },
      {
        orientation: 'horizontal',
        size: 'xl',
        class: '',
      },
      {
        orientation: 'vertical',
        size: 'xs',
        class: '',
      },
      {
        orientation: 'vertical',
        size: 'sm',
        class: '',
      },
      {
        orientation: 'vertical',
        size: 'md',
        class: '',
      },
      {
        orientation: 'vertical',
        size: 'lg',
        class: '',
      },
      {
        orientation: 'vertical',
        size: 'xl',
        class: '',
      },
    ],
    defaultVariants: {
      size: 'md',
      color: 'primary',
      variant: 'outline',
    },
  };
};
