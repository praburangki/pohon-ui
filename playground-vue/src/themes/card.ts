// @unocss-include

export const cardTheme = {
  slots: {
    root: 'rounded-pohon-2',
    header: 'p-4 sm:px-6',
    body: 'p-4 sm:p-6',
    footer: 'p-4 sm:px-6',
  },
  variants: {
    variant: {
      solid: {
        root: 'bg-$pohon-bg-inverted color-$pohon-bg',
      },
      outline: {
        root: 'bg-$pohon-bg/50 ring ring-$pohon-border divide-y divide-$pohon-border',
      },
      soft: {
        root: 'bg-$pohon-bg-elevated/50 divide-y divide-$pohon-border',
      },
      subtle: {
        root: 'bg-$pohon-bg-elevated/50 ring ring-$pohon-border divide-y divide-$pohon-border',
      },
    },
  },
};
