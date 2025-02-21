import type { Component, InjectionKey, ShallowRef } from 'vue';
import type { SlideoverProps } from '../types';

export interface SlideoverState {
  component: Component | string;
  props: SlideoverProps;
}

export const slideoverInjectionKey: InjectionKey<ShallowRef<SlideoverState>> = Symbol('nuxt-pohon.slideover');
