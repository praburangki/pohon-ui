import type { ModuleOptions } from '../module';
import { defuFn } from 'defu';
import { buttonGroupVariant } from './button-group';
import input from './input';

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      root: () => undefined,
      base: () => '',
      value: '',
      placeholder: '',
      arrow: '',
      content: '',
      viewport: '',
      group: '',
      empty: '',
      label: '',
      separator: '',
      item: '',
      itemLeadingIcon: '',
      itemLeadingAvatar: '',
      itemLeadingAvatarSize: '',
      itemLeadingChip: '',
      itemLeadingChipSize: '',
      itemTrailing: '',
      itemTrailingIcon: '',
      itemLabel: '',
    },
    variants: {
      ...buttonGroupVariant,
      size: {
        xs: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
        },
        sm: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
        },
        md: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
        },
        lg: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
        },
        xl: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
        },
      },
    },
  }, input(options));
};
