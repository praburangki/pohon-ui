declare module '#build/pohon' {
  export interface AvatarTheme {
    base: string;
    size: {
      'xs': string;
      'sm': string;
      'md': string;
      'lg': string;
      'xl': string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      '7xl': string;
      '8xl': string;
      '9xl': string;
    };
    color: {
      white: string;
      gray: string;
      zinc: string;
      neutral: string;
      stone: string;
      red: string;
      orange: string;
      amber: string;
      yellow: string;
      lime: string;
      green: string;
      emerald: string;
      teal: string;
      cyan: string;
      sky: string;
      blue: string;
      indigo: string;
      violet: string;
      purple: string;
      fuchsia: string;
      pink: string;
      rose: string;
    };
    ring: {
      base: string;
      color: {
        white: string;
        gray: string;
        zinc: string;
        neutral: string;
        stone: string;
        red: string;
        orange: string;
        amber: string;
        yellow: string;
        lime: string;
        green: string;
        emerald: string;
        teal: string;
        cyan: string;
        sky: string;
        blue: string;
        indigo: string;
        violet: string;
        purple: string;
        fuchsia: string;
        pink: string;
        rose: string;
      };
    };
    icon: {
      base: string;
      size: {
        'xs': string;
        'sm': string;
        'md': string;
        'lg': string;
        'xl': string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
        '6xl': string;
        '7xl': string;
        '8xl': string;
        '9xl': string;
      };
    };
    status: {
      base: string;
      online: string;
      offline: string;
      away: string;
      busy: string;
    };
  }

  export interface AvatarGroupTheme {
    base: string;
    ring: {
      base: string;
      color: {
        white: string;
        gray: string;
        zinc: string;
        neutral: string;
        stone: string;
        red: string;
        orange: string;
        amber: string;
        yellow: string;
        lime: string;
        green: string;
        emerald: string;
        teal: string;
        cyan: string;
        sky: string;
        blue: string;
        indigo: string;
        violet: string;
        purple: string;
        fuchsia: string;
        pink: string;
        rose: string;
      };
    };
  }

  export interface BadgeTheme {
    base: string;
    size: {
      'xs': string;
      'sm': string;
      'md': string;
      'lg': string;
      'xl': string;
      '2xl': string;
    };
    color: {
      white: string;
      gray: string;
      zinc: string;
      neutral: string;
      stone: string;
      red: string;
      orange: string;
      amber: string;
      yellow: string;
      lime: string;
      green: string;
      emerald: string;
      teal: string;
      cyan: string;
      sky: string;
      blue: string;
      indigo: string;
      violet: string;
      purple: string;
      fuchsia: string;
      pink: string;
      rose: string;
    };
    variant: {
      solid: string;
      soft: string;
      outline: string;
      ghost: string;
    };
  }

  const avatar: AvatarTheme;
  const avatarGroup: AvatarGroupTheme;
  const badge: BadgeTheme;

  export { avatar, avatarGroup, badge };
}
