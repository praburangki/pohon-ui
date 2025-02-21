import type { Component, InjectionKey, ShallowRef } from 'vue';
import type { DialogProps } from '../types';

export interface DialogState {
  component: Component | string;
  props: DialogProps;
}

export const dialogInjectionKey: InjectionKey<ShallowRef<DialogState>> = Symbol('nuxt-pohon.dialog');
