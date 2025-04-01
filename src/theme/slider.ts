import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    track: '',
    range: '',
    thumb: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        range: '',
        thumb: '',
      }])),
      neutral: {
        range: '',
        thumb: '',
      },
    },
    size: {
      xs: {
        thumb: '',
      },
      sm: {
        thumb: '',
      },
      md: {
        thumb: '',
      },
      lg: {
        thumb: '',
      },
      xl: {
        thumb: '',
      },
    },
    orientation: {
      horizontal: {
        root: '',
        range: '',
      },
      vertical: {
        root: '',
        range: '',
      },
    },
    disabled: {
      true: {
        root: '',
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      size: 'xs',
      class: {
        track: '',
      },
    },
    {
      orientation: 'horizontal',
      size: 'sm',
      class: {
        track: '',
      },
    },
    {
      orientation: 'horizontal',
      size: 'md',
      class: {
        track: '',
      },
    },
    {
      orientation: 'horizontal',
      size: 'lg',
      class: {
        track: '',
      },
    },
    {
      orientation: 'horizontal',
      size: 'xl',
      class: {
        track: '',
      },
    },
    {
      orientation: 'vertical',
      size: 'xs',
      class: {
        track: '',
      },
    },
    {
      orientation: 'vertical',
      size: 'sm',
      class: {
        track: '',
      },
    },
    {
      orientation: 'vertical',
      size: 'md',
      class: {
        track: '',
      },
    },
    {
      orientation: 'vertical',
      size: 'lg',
      class: {
        track: '',
      },
    },
    {
      orientation: 'vertical',
      size: 'xl',
      class: {
        track: '',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
