<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const appConfig = useAppConfig();
const mode = useColorMode();

appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000,
});

const router = useRouter();

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button',
  'button-group',
  'card',
  'calendar',
  'carousel',
  'checkbox',
  'chip',
  'collapsible',
  'color-picker',
  'context-menu',
  'command-palette',
  'drawer',
  'dropdown-menu',
  'form',
  'form-field',
  'input',
  'input-menu',
  'input-number',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'pin-input',
  'popover',
  'progress',
  'radio-group',
  'select',
  'select-menu',
  'separator',
  'shortcuts',
  'skeleton',
  'slideover',
  'slider',
  'stepper',
  'switch',
  'tabs',
  'table',
  'textarea',
  'toast',
  'tooltip',
  'tree',
];

// const items = components.map((component) => ({ label: upperName(component), to: `/components/${component}` }));

// function upperName(name: string) {
//   return splitByCase(name).map((p) => upperFirst(p)).join('');
// }

// const isCommandPaletteOpen = ref(false);

// function onSelect(item: any) {
//   router.push(item.to);
// }

// defineShortcuts({
//   meta_k: () => {
//     isCommandPaletteOpen.value = true;
//   },
// });
</script>

<template>
  <div :toaster="appConfig.toaster as any">
    <div
      class="h-screen w-screen overflow-hidden flex min-h-0 bg-$pohon-bg"
      akar-drawer-wrapper
    >
      <PNavigationMenu
        :items="items"
        orientation="vertical"
        class="hidden lg:flex border-e border-(--ui-border) overflow-y-auto w-48 p-4"
      />
      <PNavigationMenu
        :items="items"
        orientation="horizontal"
        class="lg:hidden border-b border-(--ui-border) [&>div]:min-w-min overflow-x-auto"
      />

      <div class="fixed top-15 lg:top-3 right-4 flex items-center gap-2">
        <PButton
          :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          :aria-label="`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        />
      </div>

      <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-14 px-4">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
    </div>

    <!-- <PModal
      v-model:open="isCommandPaletteOpen"
      class="sm:h-96"
    >
      <template #content>
        <PCommandPalette
          placeholder="Search a component..."
          :groups="[{ id: 'items', items }]"
          :fuse="{ resultLimit: 100 }"
          @update:model-value="onSelect"
          @update:open="value => isCommandPaletteOpen = value"
        />
      </template>
    </PModal> -->
  </div>
</template>
