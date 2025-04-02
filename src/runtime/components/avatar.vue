<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ClassValue, VariantProps } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import avatarTheme from '#build/pohon/avatar';
import { uv } from '../utils/uv';

const appConfigAvatar = appConfig_ as AppConfig & { pohon: { avatar: Partial<typeof avatarTheme> } };

const avatarFn = uv({
  extend: uv(avatarTheme),
  ...(appConfigAvatar.pohon?.avatar || {}),
});

type AvatarVariants = VariantProps<typeof avatarFn>;

export interface AvatarProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: APrimitiveProps['as'];
  src?: string;
  alt?: string;
  icon?: string;
  text?: string;
  size?: AvatarVariants['size'];
  class?: ClassValue;
  pohon?: Partial<typeof avatarFn.slots>;
}

export interface AvatarSlots {
  default: (props?: {}) => any;
}
</script>

<script lang="ts" setup>
import ImageComponent from '#build/pohon-image-component';
import { APrimitive, APrimitiveSlot } from '@vinicunca/akar';
import { computed, ref, watch } from 'vue';
import { useAvatarGroup } from '../composables/use-avatar-group';
import PIcon from './icon.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<AvatarProps>(),
  { as: 'span' },
);

const fallback = computed(() =>
  props.text
  || (props.alt || '')
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2),
);

const { size } = useAvatarGroup(props);

const pohon = computed(() => avatarFn({
  size: size.value,
}));

const sizePx = computed(
  () => ({
    '3xs': 16,
    '2xs': 20,
    'xs': 24,
    'sm': 28,
    'md': 32,
    'lg': 36,
    'xl': 40,
    '2xl': 44,
    '3xl': 48,
  })[props.size || 'md'],
);

const error = ref(false);

watch(
  () => props.src,
  () => {
    if (error.value) {
      error.value = false;
    }
  },
);

function onError() {
  error.value = true;
}
</script>

<template>
  <APrimitive
    :as="as"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <component
      :is="ImageComponent"
      v-if="src && !error"
      role="img"
      :src="src"
      :alt="alt"
      :width="sizePx"
      :height="sizePx"
      v-bind="$attrs"
      :class="pohon.image({ class: props.pohon?.image })"
      @error="onError"
    />

    <APrimitiveSlot
      v-else
      v-bind="$attrs"
    >
      <slot>
        <PIcon
          v-if="icon"
          :name="icon"
          :class="pohon.icon({ class: props.pohon?.icon })"
        />
        <span
          v-else
          :class="pohon.fallback({ class: props.pohon?.fallback })"
        >{{ fallback || '&nbsp;' }}</span>
      </slot>
    </APrimitiveSlot>
  </APrimitive>
</template>
