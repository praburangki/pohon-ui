import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    base: '',
    caption: '',
    thead: '',
    tbody: '',
    tr: '',
    th: '',
    td: '',
    empty: '',
    loading: '',
  },
  variants: {
    pinned: {
      true: {
        th: '',
        td: '',
      },
    },
    sticky: {
      true: {
        thead: '',
      },
    },
    loading: {
      true: {
        thead: '',
      },
    },
    loadingAnimation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': '',
    },
    loadingColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: '',
    },
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((loadingColor: string) => ({
      loading: true,
      loadingColor,
      class: {
        thead: '',
      },
    })),
    {
      loading: true,
      loadingColor: 'neutral',
      class: {
        thead: '',
      },
    },
    {
      loading: true,
      loadingAnimation: 'carousel',
      class: {
        thead: '',
      },
    },
    {
      loading: true,
      loadingAnimation: 'carousel-inverse',
      class: {
        thead: '',
      },
    },
    {
      loading: true,
      loadingAnimation: 'swing',
      class: {
        thead: '',
      },
    },
    {
      loading: true,
      loadingAnimation: 'elastic',
      class: {
        thead: '',
      },
    },
  ],
  defaultVariants: {
    loadingColor: 'primary',
    loadingAnimation: 'carousel',
  },
});
