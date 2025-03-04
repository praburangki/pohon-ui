<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { reactive } from 'vue';

const appConfig = useAppConfig();
const mode = useColorMode();

appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000,
});
</script>

<template>
  <div :toaster="appConfig.toaster as any">
    <div
      class="h-screen w-screen overflow-hidden flex min-h-0 bg-$pohon-bg"
      vaul-drawer-wrapper
    >
      <!-- <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="hidden lg:flex border-e border-(--ui-border) overflow-y-auto w-48 p-4"
      />
      <UNavigationMenu
        :items="items"
        orientation="horizontal"
        class="lg:hidden border-b border-(--ui-border) [&>div]:min-w-min overflow-x-auto"
      /> -->

      <div class="fixed top-15 lg:top-3 right-4 flex items-center gap-2">
        <button
          :class="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          :aria-label="`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        />
      </div>

      <!-- <div class="fixed top-15 lg:top-3 right-4 flex items-center gap-2">
        <UButton
          :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          :aria-label="`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        />
      </div> -->

      <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-14 px-4">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
    </div>

    <!-- <UModal
      v-model:open="isCommandPaletteOpen"
      class="sm:h-96"
    >
      <template #content>
        <UCommandPalette
          placeholder="Search a component..."
          :groups="[{ id: 'items', items }]"
          :fuse="{ resultLimit: 100 }"
          @update:model-value="onSelect"
          @update:open="value => isCommandPaletteOpen = value"
        />
      </template>
    </UModal> -->
  </div>
</template>
