<script setup lang="ts">
import type { Overlay } from '../composables/use-overlay';
import { computed } from 'vue';
import { useOverlay } from '../composables/use-overlay';

const { overlays, unMount, close } = useOverlay();

const mountedOverlays = computed(() => overlays.filter((overlay: Overlay) => overlay.isMounted));

function onAfterLeave(id: symbol) {
  close(id);
  unMount(id);
}

function onClose(id: symbol, value: any) {
  close(id, value);
}
</script>

<template>
  <component
    :is="overlay.component"
    v-for="overlay in mountedOverlays"
    :key="overlay.id"
    v-bind="overlay.props"
    v-model:open="overlay.modelValue"
    @close="(value:any) => onClose(overlay.id, value)"
    @after:leave="onAfterLeave(overlay.id)"
  />
</template>
