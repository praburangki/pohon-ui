<script lang="ts">
import type { APrimitiveProps } from '@vinicunca/akar';

export interface LinkBaseProps {
  as?: APrimitiveProps['as'];
  type?: string;
  disabled?: boolean;
  onClick?: ((event: MouseEvent) => void | Promise<void>) | Array<((event: MouseEvent) => void | Promise<void>)>;
  href?: string;
  navigate?: (event: MouseEvent) => void;
  rel?: string;
  target?: string;
  active?: boolean;
  isExternal?: boolean;
}
</script>

<script setup lang="ts">
import { APrimitive } from '@vinicunca/akar';

const props = withDefaults(
  defineProps<LinkBaseProps>(),
  {
    as: 'button',
    type: 'button',
  },
);

function onClickWrapper(event: MouseEvent) {
  if (props.disabled) {
    event.stopPropagation();
    event.preventDefault();

    return;
  }

  if (props.onClick) {
    for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) {
      onClick(event);
    }
  }

  if (props.href && props.navigate && !props.isExternal) {
    props.navigate(event);
  }
}
</script>

<template>
  <APrimitive
    v-bind="href ? {
      'as': 'a',
      'href': disabled ? undefined : href,
      'aria-disabled': disabled ? 'true' : undefined,
      'role': disabled ? 'link' : undefined,
      'tabindex': disabled ? -1 : undefined,
    } : as === 'button' ? {
      as,
      type,
      disabled,
    } : {
      as,
    }"
    :rel="rel"
    :target="target"
    @click="onClickWrapper"
  >
    <slot />
  </APrimitive>
</template>
