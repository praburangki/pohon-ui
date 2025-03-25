<script setup lang="ts">
import theme from '#build/pohon/badge';
import { toCapitalCase } from '@vinicunca/perkakas';

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>;
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>;
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <PBadge class="uno-layer-pohon:font-bold">
        Badge
      </PBadge>
    </div>
    <div class="flex items-center gap-2">
      <PBadge
        v-for="variant in variants"
        :key="variant"
        icon="i-lucide-rocket"
        :label="toCapitalCase(variant.toString())"
        :variant="variant"
      />
    </div>
    <div class="flex items-center gap-2">
      <PBadge
        v-for="variant in variants"
        :key="variant"
        icon="i-lucide-rocket"
        :label="toCapitalCase(variant.toString())"
        :variant="variant"
        color="neutral"
      />
    </div>
    <div class="flex items-center gap-2">
      <PBadge
        v-for="variant in variants"
        :key="variant"
        :avatar="{ src: 'https://github.com/praburangki.png' }"
        :label="toCapitalCase(variant.toString())"
        :variant="variant"
        color="neutral"
      />
    </div>
    <div class="flex items-center gap-2 ms-[-56px]">
      <PBadge
        v-for="size in sizes"
        :key="size"
        label="Badge"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-2 ms-[-86px]">
      <PBadge
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-rocket"
        label="Badge"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-2 ms-[-86px]">
      <PBadge
        v-for="size in sizes"
        :key="size"
        :avatar="{ src: 'https://github.com/praburangki.png' }"
        label="Badge"
        :size="size"
      />
    </div>
  </div>
</template>
