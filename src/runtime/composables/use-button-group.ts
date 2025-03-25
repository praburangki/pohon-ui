import type { ComputedRef, InjectionKey } from 'vue';
import type { ButtonGroupProps } from '../components/button-group.vue';
import type { GetObjectField } from '../types/type.utils';
import { computed, inject } from 'vue';

interface Props<T> {
  size?: GetObjectField<T, 'size'>;
}

export const buttonGroupInjectionKey: InjectionKey<ComputedRef<{
  size: ButtonGroupProps['size'];
  orientation: ButtonGroupProps['orientation'];
}>>
= Symbol('pohon-ui.button-group');

export function useButtonGroup<T>(props: Props<T>) {
  const buttonGroup = inject(buttonGroupInjectionKey, undefined);

  return {
    orientation: computed(() => buttonGroup?.value.orientation),
    size: computed(() => props.size ?? buttonGroup?.value.size),
  };
}
