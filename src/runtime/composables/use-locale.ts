import type { InjectionKey, Ref } from 'vue';
import type { Locale, Messages } from '../types/type.locale';
import { createSharedComposable } from '@vueuse/core';
import { computed, inject, toRef } from 'vue';
import en from '../locale/en';
import { buildLocaleContext } from '../utils/util.locale';

export const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>> = Symbol.for('pohon-ui.locale-context');

function _useLocale(localeOverrides?: Ref<Locale<Messages> | undefined>) {
  const locale = localeOverrides || toRef(inject<Locale<Messages>>(localeContextInjectionKey));

  return buildLocaleContext<Messages>(computed(() => locale.value || en));
}

export const useLocale = /* @__PURE__ */ createSharedComposable(_useLocale);
