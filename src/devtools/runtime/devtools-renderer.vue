<script setup lang="ts">
import { defineAsyncComponent, useRoute } from '#imports';
import { toPascalCase } from '@vinicunca/perkakas';
import { useColorMode } from '@vueuse/core';
import { onMounted, onUnmounted, reactive } from 'vue';

const route = useRoute();
const component = route.query?.example
  ? defineAsyncComponent(() => import(`./examples/${route.query.example}.vue`))
  : route.params?.slug && defineAsyncComponent(() => import(`../../runtime/components/${toPascalCase(route.params.slug as string)}.vue`));

const state = reactive<{ slots?: any; props?: any }>({});

function onUpdateRenderer(event: Event & { data?: any }) {
  state.props = { ...event.data.props };
  state.slots = { ...event.data.slots };
}

const mode = useColorMode();
function setColorMode(event: Event & { isDark?: boolean }) {
  mode.value = event.isDark ? 'dark' : 'light';
}

onMounted(() => {
  window.parent.addEventListener('nuxt-pohon-devtools:update-renderer', onUpdateRenderer);
  window.parent.addEventListener('nuxt-pohon-devtools:set-color-mode', setColorMode);
});

onUnmounted(() => {
  window.parent.removeEventListener('nuxt-pohon-devtools:update-renderer', onUpdateRenderer);
  window.parent.removeEventListener('nuxt-pohon-devtools:set-color-mode', setColorMode);
});

onMounted(async () => {
  const event: Event = new Event('nuxt-pohon-devtools:component-loaded');
  window.parent.dispatchEvent(event);
});

onMounted(() => {
});
</script>

<template>
  <div
    id="ui-devtools-renderer"
    class="nuxt-pohon-component-renderer"
  >
    <PApp :toaster="null">
      <component
        :is="component"
        v-if="component"
        v-bind="state.props"
        :class="state?.slots?.base"
        :ui="state.slots"
      />
    </PApp>
  </div>
</template>

<style>
.nuxt-pohon-component-renderer {
  position: 'relative';
  height: 100vh;
  width: 100vw;

  padding: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Cpath fill='none' stroke='hsla(0, 0%25, 98%25, 1)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}

.dark .nuxt-pohon-component-renderer {
background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='hsl(0, 0%25, 8.5%25)'/%3E%3Cpath fill='none' stroke='hsl(0, 0%25, 11.0%25)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}
</style>
