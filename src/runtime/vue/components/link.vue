<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue';
import type { RouteLocationRaw, RouterLinkProps } from 'vue-router';
import { isString } from '@vinicunca/perkakas';

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

export interface LinkProps extends NuxtLinkProps {
  /**
   * The element or component this component should render as when not a link.
   * @defaultValue 'button'
   */
  as?: any;
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
  /** Will only be active if the current route query is an exact match. */
  exactQuery?: boolean | 'partial';
  /** Will only be active if the current route hash is an exact match. */
  exactHash?: boolean;
  /** The class to apply when the link is inactive. */
  inactiveClass?: string;
  custom?: boolean;
  /** When `true`, only styles from `class`, `activeClass`, and `inactiveClass` will be applied. */
  raw?: boolean;
  class?: any;
}

export interface LinkSlots {
  default: (props: { active: boolean }) => any;
}
</script>

<script lang="ts" setup>
import type { AppConfig } from '@nuxt/schema';
import appConfig_ from '#build/app.config';
import linkTheme from '#build/pohon/link';
import { useRoute } from '#imports';
import { reactiveOmit } from '@vueuse/core';
import { diff, isEqual } from 'ohash';
import { useForwardProps } from 'reka-ui';
import { hasProtocol } from 'ufo';
import { uv } from 'unocss-variants';
import { computed, getCurrentInstance } from 'vue';
import { RouterLink } from 'vue-router';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<LinkProps>(),
  {
    as: 'button',
    type: 'button',
    active: undefined,
    activeClass: '',
    inactiveClass: '',
  },
);

defineSlots<LinkSlots>();

const appConfigLink = appConfig_ as AppConfig & { pohon: { link: Partial<typeof linkTheme> } };

const linkUv = uv({
  extend: uv(linkTheme),
  ...(appConfigLink.pohon?.link || {}),
});

// Check if vue-router is available by checking for the injection key
const hasRouter = computed(() => {
  const app = getCurrentInstance()?.appContext.app;
  return !!(app?.config?.globalProperties?.$router);
});

// Only try to get route if router exists
const route = computed(() => {
  if (!hasRouter.value) {
    return null;
  }
  try {
    return useRoute();
  } catch {
    return null;
  }
});

const routerLinkProps = useForwardProps(
  reactiveOmit(props, 'as', 'type', 'disabled', 'active', 'exact', 'exactQuery', 'exactHash', 'activeClass', 'inactiveClass', 'to', 'raw', 'class'),
);

const pohon = computed(() => uv({
  extend: linkUv,
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
      filtered.push(q.key);
    }
    return filtered;
  }, [] as Array<string>);

  return isEqual(item1, item2, { excludeKeys: (key) => diffedKeys.includes(key) });
}

const isExternal = computed(() => {
  if (!props.to) {
    return false;
  }

  return isString(props.to) && hasProtocol(props.to, { acceptRelative: true });
});

function isLinkActive({ route: linkRoute, isActive, isExactActive }: any) {
  if (props.active !== undefined) {
    return props.active;
  }

  if (!props.to || !route.value) {
    return false;
  }

  if (props.exactQuery === 'partial') {
    if (!isPartiallyEqual(linkRoute.query, route.value.query)) {
      return false;
    }
  } else if (props.exactQuery === true) {
    if (!isEqual(linkRoute.query, route.value.query)) {
      return false;
    }
  }

  if (props.exactHash && linkRoute.hash !== route.value.hash) {
    return false;
  }

  if (props.exact && isExactActive) {
    return true;
  }

  return !props.exact && isActive;
}

function resolveLinkClass({ route, isActive, isExactActive }: any = {}) {
  const active = isLinkActive({ route, isActive, isExactActive });

  if (props.raw) {
    return [props.class, active ? props.activeClass : props.inactiveClass];
  }

  return pohon.value({ class: props.class, active, disabled: props.disabled });
}
</script>

<template>
  <template v-if="hasRouter && !isExternal">
    <RouterLink
      v-slot="{ href, navigate, route: linkRoute, isActive, isExactActive }"
      v-bind="routerLinkProps"
      :to="to || '#'"
      custom
    >
      <template v-if="custom">
        <slot
          v-bind="{
            ...$attrs,
            as,
            type,
            disabled,
            href: to ? href : undefined,
            navigate,
            active: isLinkActive({ route: linkRoute, isActive, isExactActive }),
          }"
        />
      </template>

      <PLinkBase
        v-else
        v-bind="{
          ...$attrs,
          as,
          type,
          disabled,
          href: to ? href : undefined,
          navigate,
        }"
        :class="resolveLinkClass({ route: linkRoute, isActive, isExactActive })"
      >
        <slot :active="isLinkActive({ route: linkRoute, isActive, isExactActive })" />
      </PLinkBase>
    </RouterLink>
  </template>

  <template v-else>
    <template v-if="custom">
      <slot
        v-bind="{
          ...$attrs,
          as,
          type,
          disabled,
          href: to,
          target: isExternal ? '_blank' : undefined,
          active: false,
        }"
      />
    </template>

    <PLinkBase
      v-else
      v-bind="{
        ...$attrs,
        as,
        type,
        disabled,
        href: (to as string),
        target: isExternal ? '_blank' : undefined,
      }"
      :is-external="isExternal"
      :class="resolveLinkClass()"
    >
      <slot :active="false" />
    </PLinkBase>
  </template>
</template>
