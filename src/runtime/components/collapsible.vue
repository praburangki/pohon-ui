<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ACollapsibleRootEmits, ACollapsibleRootProps, APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import appConfig_ from '#build/app.config';
import collapsibleTheme from '#build/pohon/collapsible';
import { uv } from '../utils/uv';

const appConfigCollapsible = appConfig_ as AppConfig & { pohon: { collapsible: Partial<typeof collapsibleTheme> } };

const collapsibleFn = uv({
  extend: uv(collapsibleTheme),
  ...(appConfigCollapsible.pohon?.collapsible || {}),
});

export interface CollapsibleProps extends Pick<ACollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: APrimitiveProps['as'];
  class?: ClassValue;
  pohon?: Partial<typeof collapsibleFn.slots>;
}

export interface CollapsibleEmits extends ACollapsibleRootEmits {}

export interface CollapsibleSlots {
  default: (props: { open: boolean }) => any;
  content: (props?: {}) => any;
}
</script>

<script setup lang="ts">
import {
  ACollapsibleContent,
  ACollapsibleRoot,
  ACollapsibleTrigger,
  useForwardPropsEmits,
} from '@vinicunca/akar';
import { reactivePick } from '@vueuse/core';

const props = withDefaults(
  defineProps<CollapsibleProps>(),
  {
    unmountOnHide: true,
  },
);
const emits = defineEmits<CollapsibleEmits>();
const slots = defineSlots<CollapsibleSlots>();

const rootProps = useForwardPropsEmits(
  reactivePick(
    props,
    'as',
    'defaultOpen',
    'open',
    'disabled',
    'unmountOnHide',
  ),
  emits,
);

const pohon = collapsibleFn();
</script>

<template>
  <ACollapsibleRoot
    v-slot="{ open }"
    v-bind="rootProps"
    :class="pohon.root({ class: [props.class, props.pohon?.root] })"
  >
    <ACollapsibleTrigger
      v-if="!!slots.default"
      as-child
    >
      <slot :open="open" />
    </ACollapsibleTrigger>

    <ACollapsibleContent :class="pohon.content({ class: props.pohon?.content })">
      <slot name="content" />
    </ACollapsibleContent>
  </ACollapsibleRoot>
</template>
