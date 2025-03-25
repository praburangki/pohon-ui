import type { ModuleOptions } from '../module';

export interface ThemeSlots {
  base?: string;
  label?: string;
  leadingIcon?: string;
  leadingAvatar?: string;
  leadingAvatarSize?: string;
  trailingIcon?: string;
  [key: string]: string | undefined;
}

export interface ThemeVariants {
  color?: Record<string, string>;
  variant?: Record<string, string>;
  size?: Record<string, string | Record<string, string>>;
  [key: string]: Record<string, any> | undefined;
}

export interface ThemeCompoundVariant {
  color?: string;
  variant?: string;
  size?: string;
  class: string;
  [key: string]: any;
}

export interface ThemeDefaultVariants {
  color?: string;
  variant?: string;
  size?: string;
  [key: string]: string | undefined;
}

export interface ThemeObject {
  slots: ThemeSlots;
  variants: ThemeVariants;
  compoundVariants: Array<ThemeCompoundVariant>;
  defaultVariants: ThemeDefaultVariants;
}

export type ThemeFunction = (options: Required<ModuleOptions>) => ThemeObject;
