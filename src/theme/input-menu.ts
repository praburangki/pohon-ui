import type { ModuleOptions } from '../module';
import { defuFn } from 'defu';
import input from './input';

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      base: () => [''],
      trailing: '',
      arrow: '',
      content: '',
      viewport: '',
      group: '',
      empty: '',
      label: '',
      separator: '',
      item: [''],
      itemLeadingIcon: [''],
      itemLeadingAvatar: '',
      itemLeadingAvatarSize: '',
      itemLeadingChip: '',
      itemLeadingChipSize: '',
      itemTrailing: '',
      itemTrailingIcon: '',
      itemLabel: '',
      tagsItem: '',
      tagsItemText: '',
      tagsItemDelete: [''],
      tagsItemDeleteIcon: '',
      tagsInput: '',
    },
    variants: {
      multiple: {
        true: {
          root: '',
          tagsInput: '',
        },
        false: {
          base: '',
        },
      },
      size: {
        xs: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
          tagsItem: '',
          tagsItemDeleteIcon: '',
        },
        sm: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
          tagsItem: '',
          tagsItemDeleteIcon: '',
        },
        md: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
          tagsItem: '',
          tagsItemDeleteIcon: '',
        },
        lg: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
          tagsItem: '',
          tagsItemDeleteIcon: '',
        },
        xl: {
          label: '',
          item: '',
          itemLeadingIcon: '',
          itemLeadingAvatarSize: '',
          itemLeadingChip: '',
          itemLeadingChipSize: '',
          itemTrailingIcon: '',
          tagsItem: '',
          tagsItemDeleteIcon: '',
        },
      },
    },
    compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
      color,
      multiple: true,
      variant: ['outline', 'subtle'],
      class: '',
    })), {
      color: 'neutral',
      multiple: true,
      variant: ['outline', 'subtle'],
      class: '',
    }],
  }, input(options));
};
