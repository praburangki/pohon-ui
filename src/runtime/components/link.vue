<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { APrimitiveProps } from '@vinicunca/akar';
import type { ClassValue } from 'unocss-variants';
import type { ButtonHTMLAttributes } from 'vue';
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router';
import appConfig_ from '#build/app.config';
import linkTheme from '#build/pohon/link';
import { uv } from '../utils/uv';

interface NuxtLinkProps extends Omit<RouterLinkProps, 'to'> {
  /**
   * Route Location the link should navigate to when clicked on.
   */
  to?: RouteLocationRaw; // need to manually type to avoid breaking typedPages
  /**
   * An alias for `to`. If used with `to`, `href` will be ignored
   */
  href?: NuxtLinkProps['to'];
  /**
   * Forces the link to be considered as external (true) or internal (false). This is helpful to handle edge-cases
   */
  external?: boolean;
  /**
   * Where to display the linked URL, as the name for a browsing context.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null;
  /**
   * A rel attribute value to apply on the link. Defaults to "noopener noreferrer" for external links.
   */
  rel?: 'noopener' | 'noreferrer' | 'nofollow' | 'sponsored' | 'ugc' | (string & {}) | null;
  /**
   * If set to true, no rel attribute will be added to the link
   */
  noRel?: boolean;
  /**
   * A class to apply to links that have been prefetched.
   */
  prefetchedClass?: string;
  /**
   * When enabled will prefetch middleware, layouts and payloads of links in the viewport.
   */
  prefetch?: boolean;
  /**
   * Allows controlling when to prefetch links. By default, prefetch is triggered only on visibility.
   */
  prefetchOn?: 'visibility' | 'interaction' | Partial<{
    visibility: boolean;
    interaction: boolean;
  }>;
  /**
   * Escape hatch to disable `prefetch` attribute.
   */
  noPrefetch?: boolean;
}

const appConfigLink = appConfig_ as AppConfig & {
  pohon: { link: Partial<typeof linkTheme> };
};

const linkFn = uv({
  extend: uv(linkTheme),
  ...(appConfigLink.pohon?.link || {}),
});

export interface LinkProps extends NuxtLinkProps {
  /**
   * The element or component this component should render as when not a link.
   * @defaultValue 'button'
   */
  as?: APrimitiveProps['as'];
  /**
   * The type of the button when not a link.
   * @defaultValue 'button'
   */
  type?: ButtonHTMLAttributes['type'];
  disabled?: boolean;
  /** Force the link to be active independent of the current route. */
  active?: boolean;
  /** Will only be active if the current route is an exact match. */
  exact?: boolean;
  /** Allows controlling how the current route query sets the link as active. */
  exactQuery?: boolean | 'partial';
  /** Will only be active if the current route hash is an exact match. */
  exactHash?: boolean;
  /** The class to apply when the link is inactive. */
  inactiveClass?: string;
  custom?: boolean;
  /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
  raw?: boolean;
  class?: ClassValue;
}

export interface LinkSlots {
  default: (props: { active: boolean }) => any;
}
</script>

<script setup lang="ts">
import { useRoute } from '#imports';
import { useForwardProps } from '@vinicunca/akar';
import { reactiveOmit } from '@vueuse/core';
import { diff, isEqual } from 'ohash/utils';
import { computed } from 'vue';
import PLinkBase from './link-base.vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<LinkProps>(),
  {
    as: 'button',
    type: 'button',
    ariaCurrentValue: 'page',
    active: undefined,
    activeClass: '',
    inactiveClass: '',
  },
);
defineSlots<LinkSlots>();

const route = useRoute();
const nuxtLinkProps = useForwardProps(
  reactiveOmit(
    props,
    'as',
    'type',
    'disabled',
    'active',
    'exact',
    'exactQuery',
    'exactHash',
    'activeClass',
    'inactiveClass',
    'raw',
    'class',
  ),
);

const pohon = computed(() => uv({
  extend: linkFn,
  variants: {
    active: {
      true: props.activeClass,
      false: props.inactiveClass,
    },
  },
}));

function isPartiallyEqual(item1: any, item2: any) {
  const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
    if (q.type === 'added') {
      filtered.add(q.key);
    }

    return filtered;
  }, new Set<string>());

  const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)));
  const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)));

  return isEqual(item1Filtered, item2Filtered);
}

function isLinkActive({ route: linkRoute, isActive, isExactActive }: any) {
  if (props.active !== undefined) {
    return props.active;
  }

  if (props.exactQuery === 'partial') {
    if (!isPartiallyEqual(linkRoute.query, route.query)) {
      return false;
    }
  } else if (props.exactQuery === true) {
    if (!isEqual(linkRoute.query, route.query)) {
      return false;
    }
  }

  if (props.exactHash && linkRoute.hash !== route.hash) {
    return false;
  }

  if (props.exact && isExactActive) {
    return true;
  }

  return !props.exact && isActive;
}

function resolveLinkClass({ route, isActive, isExactActive }: any) {
  const active = isLinkActive({ route, isActive, isExactActive });

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }

  return pohon.value({ class: props.class, active, disabled: props.disabled });
}
</script>

<template>
  <NuxtLink
    v-slot="{ href, navigate, route: linkRoute, rel, target, isExternal, isActive, isExactActive }"
    v-bind="nuxtLinkProps"
    custom
  >
    <template v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          ...(exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {}),
          as,
          type,
          disabled,
          href,
          navigate,
          rel,
          target,
          isExternal,
          active: isLinkActive({ route: linkRoute, isActive, isExactActive }),
        }"
      />
    </template>

    <PLinkBase
      v-else
      v-bind="{
        ...$attrs,
        ...(exact && isExactActive ? { 'aria-current': props.ariaCurrentValue } : {}),
        as,
        type,
        disabled,
        href,
        navigate,
        rel,
        target,
        isExternal,
      }"
      :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
    >
      <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
    </PLinkBase>
  </NuxtLink>
</template>
