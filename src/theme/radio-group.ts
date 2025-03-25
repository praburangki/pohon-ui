import type { ModuleOptions } from '../module';

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    fieldset: '',
    legend: '',
    item: '',
    base: '',
    indicator: '',
    container: '',
    wrapper: '',
    label: '',
    description: '',
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        base: '',
        indicator: '',
      }])),
      neutral: {
        base: '',
        indicator: '',
      },
    },
    orientation: {
      horizontal: {
        fieldset: '',
        wrapper: '',
      },
      vertical: {
        fieldset: '',
      },
    },
    size: {
      xs: {
        fieldset: '',
        legend: '',
        base: '',
        item: '',
        container: '',
        indicator: '',
      },
      sm: {
        fieldset: '',
        legend: '',
        base: '',
        item: '',
        container: '',
        indicator: '',
      },
      md: {
        fieldset: '',
        legend: '',
        base: '',
        item: '',
        container: '',
        indicator: '',
      },
      lg: {
        fieldset: '',
        legend: '',
        base: '',
        item: '',
        container: '',
        indicator: '',
      },
      xl: {
        fieldset: '',
        legend: '',
        base: '',
        item: '',
        container: '',
        indicator: '',
      },
    },
    disabled: {
      true: {
        base: '',
        label: '',
      },
    },
    required: {
      true: {
        legend: '',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
