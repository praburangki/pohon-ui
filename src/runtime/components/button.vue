<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ClassValue, VariantProps } from 'unocss-variants';
import type { UseComponentIconsProps } from '../composables/use-component-icons';
import type { AvatarProps } from '../types';
import type { PartialString } from '../types/type.utils';
import type { LinkProps } from './link.vue';
import _appConfig from '#build/app.config';
import theme from '#build/pohon/button';
import { uv } from '../utils/uv';

const appConfigButton = _appConfig as AppConfig & { pohon: { button: Partial<typeof theme> } };

const buttonFn = uv({
  extend: uv(theme),
  ...(appConfigButton.pohon?.button || {}),
});

type ButtonVariants = VariantProps<typeof buttonFn>;

export interface ButtonProps extends UseComponentIconsProps, Omit<LinkProps, 'raw' | 'custom'> {
  label?: string;
  /**
   * @defaultValue 'primary'
   */
  color?: ButtonVariants['color'];
  activeColor?: ButtonVariants['color'];
  /**
   * @defaultValue 'solid'
   */
  variant?: ButtonVariants['variant'];
  activeVariant?: ButtonVariants['variant'];
  /**
   * @defaultValue 'md'
   */
  size?: ButtonVariants['size'];
  /** Render the button with equal padding on all sides. */
  square?: boolean;
  /** Render the button full width. */
  block?: boolean;
  /** Set loading state automatically based on the `@click` promise state */
  loadingAuto?: boolean;
  onClick?: ((event: MouseEvent) => void | Promise<void>) | Array<((event: MouseEvent) => void | Promise<void>)>;
  class?: ClassValue;
  pohon?: PartialString<typeof buttonFn.slots>;
}

export interface ButtonSlots {
  leading: (props?: object) => any;
  default: (props?: object) => any;
  trailing: (props?: object) => any;
}
</script>

<script setup lang="ts">
import type { Ref } from 'vue';
import { useForwardProps } from '@vinicunca/akar';
import { omit } from '@vinicunca/perkakas';
import { computed, inject, ref } from 'vue';
import { useButtonGroup } from '../composables/use-button-group';
import { useComponentIcons } from '../composables/use-component-icons';
import { formLoadingInjectionKey } from '../composables/use-form-field';
import { pickLinkProps } from '../utils/util.link';
import PAvatar from './avatar.vue';
import PIcon from './icon.vue';
import PLinkBase from './link-base.vue';
import PLink from './link.vue';

const props = withDefaults(
  defineProps<ButtonProps>(),
  {
    active: undefined,
    activeClass: '',
    inactiveClass: '',
  },
);
const slots = defineSlots<ButtonSlots>();

const linkProps = useForwardProps(pickLinkProps(props));

const { orientation, size: buttonSize } = useButtonGroup<ButtonProps>(props);

const loadingAutoState = ref(false);
const formLoading = inject<Ref<boolean> | undefined>(formLoadingInjectionKey, undefined);

async function onClickWrapper(event: MouseEvent) {
  loadingAutoState.value = true;
  const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
  try {
    await Promise.all(callbacks.map((fn) => fn?.(event)));
  } finally {
    loadingAutoState.value = false;
  }
}

const isLoading = computed(() => {
  return props.loading || (props.loadingAuto && (loadingAutoState.value || (formLoading?.value && props.type === 'submit')));
});

const {
  isLeading,
  isTrailing,
  leadingIconName,
  trailingIconName,
} = useComponentIcons(
  computed(() => ({ ...props, loading: isLoading.value })),
);

const pohon = computed(() => uv({
  extend: buttonFn,
  variants: {
    active: {
      true: {
        base: props.activeClass,
      },
      false: {
        base: props.inactiveClass,
      },
    },
  },
})({
  color: props.color,
  variant: props.variant,
  size: buttonSize.value,
  loading: isLoading.value,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: isLeading.value,
  trailing: isTrailing.value,
  buttonGroup: orientation.value,
}));
</script>

<template>
  <PLink
    v-slot="{ active, ...slotProps }"
    :type="type"
    :disabled="disabled || isLoading"
    :class="pohon.base({ class: [props.class, props.pohon?.base] })"
    v-bind="omit(linkProps, ['type', 'disabled', 'onClick'])"
    custom
  >
    <PLinkBase
      v-bind="slotProps"
      :class="pohon.base({
        class: [props.class, props.pohon?.base],
        active,
        ...(active && activeVariant ? { variant: activeVariant } : {}),
        ...(active && activeColor ? { color: activeColor } : {}),
      })"
      @click="onClickWrapper"
    >
      <slot name="leading">
        <PIcon
          v-if="isLeading && leadingIconName"
          :name="leadingIconName"
          :class="pohon.leadingIcon({ class: props.pohon?.leadingIcon, active })"
        />
        <PAvatar
          v-else-if="!!avatar"
          :size="(props.pohon?.leadingAvatarSize || pohon.leadingAvatarSize()) as AvatarProps['size']"
          v-bind="avatar"
          :class="pohon.leadingAvatar({ class: props.pohon?.leadingAvatar, active })"
        />
      </slot>

      <slot>
        <span
          v-if="label"
          :class="pohon.label({ class: props.pohon?.label, active })"
        >
          {{ label }}
        </span>
      </slot>

      <slot name="trailing">
        <PIcon
          v-if="isTrailing && trailingIconName"
          :name="trailingIconName"
          :class="pohon.trailingIcon({ class: props.pohon?.trailingIcon, active })"
        />
      </slot>
    </PLinkBase>
  </PLink>
</template>
