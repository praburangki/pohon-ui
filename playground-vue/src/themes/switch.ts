import type SwitchTypes from '#build/pohon/switch';
import type { DeepPartial } from '@vinicunca/perkakas';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-start',
    base: ['inline-flex items-center shrink-0 rounded-full border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 data-[state=unchecked]:bg-(--ui-bg-accented)', options.theme.transitions && 'transition-[background] duration-200'],
    container: 'flex items-center',
    thumb: 'group pointer-events-none rounded-full bg-(--ui-bg) shadow-lg ring-0 transition-transform duration-200 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0 flex items-center justify-center',
    icon: ['absolute shrink-0 group-data-[state=unchecked]:text-(--ui-text-dimmed) opacity-0 size-10/12', options.theme.transitions && 'transition-[color,opacity] duration-200'],
    wrapper: 'ms-2',
    label: 'block font-medium text-(--ui-text)',
    description: 'text-(--ui-text-muted)'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: `data-[state=checked]:bg-(--ui-${color}) focus-visible:outline-(--ui-${color})`,
        icon: `group-data-[state=checked]:text-(--ui-${color})`
      }])),
      neutral: {
        base: 'data-[state=checked]:bg-(--ui-bg-inverted) focus-visible:outline-(--ui-border-inverted)',
        icon: 'group-data-[state=checked]:text-(--ui-text-highlighted)'
      }
    },
    size: {
      xs: {
        base: 'w-7',
        container: 'h-4',
        thumb: 'size-3 data-[state=checked]:translate-x-3 data-[state=checked]:rtl:-translate-x-3',
        wrapper: 'text-xs'
      },
      sm: {
        base: 'w-8',
        container: 'h-4',
        thumb: 'size-3.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:rtl:-translate-x-3.5',
        wrapper: 'text-xs'
      },
      md: {
        base: 'w-9',
        container: 'h-5',
        thumb: 'size-4 data-[state=checked]:translate-x-4 data-[state=checked]:rtl:-translate-x-4',
        wrapper: 'text-sm'
      },
      lg: {
        base: 'w-10',
        container: 'h-5',
        thumb: 'size-4.5 data-[state=checked]:translate-x-4.5 data-[state=checked]:rtl:-translate-x-4.5',
        wrapper: 'text-sm'
      },
      xl: {
        base: 'w-11',
        container: 'h-6',
        thumb: 'size-5 data-[state=checked]:translate-x-5 data-[state=checked]:rtl:-translate-x-5',
        wrapper: 'text-base'
      }
    },
    checked: {
      true: {
        icon: 'group-data-[state=checked]:opacity-100'
      }
    },
    unchecked: {
      true: {
        icon: 'group-data-[state=unchecked]:opacity-100'
      }
    },
    loading: {
      true: {
        icon: 'animate-spin'
      }
    },
    required: {
      true: {
        label: 'after:content-[\'*\'] after:ms-0.5 after:text-(--ui-error)'
      }
    },
    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75',
        label: 'cursor-not-allowed opacity-75',
        description: 'cursor-not-allowed opacity-75'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
};
