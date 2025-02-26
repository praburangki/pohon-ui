<script lang="ts">
</script>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue';

export interface IconProps {
  name: string;
}

defineProps<IconProps>();
</script>

<template>
  <IconifyIcon :icon="name.replace(/^i-/, '')" />
</template>
