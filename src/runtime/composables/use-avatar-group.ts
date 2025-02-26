import type { ComputedRef, InjectionKey } from 'vue';
import type { AvatarGroupProps } from '../types';
import { computed, inject, provide } from 'vue';

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<{ size: AvatarGroupProps['size'] }>> = Symbol('nuxt-pohon.avatar-group');

export function useAvatarGroup(props: { size: AvatarGroupProps['size'] }) {
  const avatarGroup = inject(avatarGroupInjectionKey, undefined);

  const size = computed(() => props.size ?? avatarGroup?.value.size);
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })));

  return {
    size,
  };
}
