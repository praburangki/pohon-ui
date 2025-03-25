const apa = {
  slots: {
    root: '',
    image: '',
    fallback: '',
    icon: '',
  },
  variants: {
    size: {
      '3xs': {
        root: '',
      },
      '2xs': {
        root: '',
      },
      'xs': {
        root: '',
      },
      'sm': {
        root: '',
      },
      'md': {
        root: '',
      },
      'lg': {
        root: '',
      },
      'xl': {
        root: '',
      },
      '2xl': {
        root: '',
      },
      '3xl': {
        root: '',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
} as const;

export type AvatarSlots = typeof apa.slots;
export type AvatarVariants = typeof apa.variants;
export type AvatarTheme = typeof apa;
export type AvatarSize = keyof typeof apa.variants.size;

export default apa;
