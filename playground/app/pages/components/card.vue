<script setup lang="ts">
import theme from '#build/pohon/card';
import { ref } from 'vue';
import PlayPlaceholder from '../../components/play-placeholder.vue';

const variants = Object.keys(theme.variants.variant);

const variant = ref(theme.defaultVariants.variant);
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- <USelect v-model="variant" :items="variants" /> -->

    <PCard
      :variant="variant"
      class="w-96"
    >
      <template #header>
        <PlayPlaceholder class="h-8" />
      </template>

      <PlayPlaceholder class="h-32" />

      <template #footer>
        <PlayPlaceholder class="h-8" />
      </template>
    </PCard>
  </div>
</template>
