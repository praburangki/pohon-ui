<script setup lang="ts">
import type { AvatarProps, InputMenuItem } from '@nuxt/ui';

import type { User } from '~/types';
import theme from '#build/pohon/input-menu';
import { refDebounced } from '@vueuse/core';
import { upperFirst } from 'scule';

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>;
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>;

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple'];
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek'];

const items = [[{ label: 'Fruits', type: 'label' as const }, ...fruits], [{ label: 'Vegetables', type: 'label' as const }, ...vegetables]];
const selectedItems = ref([fruits[0]!, vegetables[0]!]);

const statuses = [{
  label: 'Backlog',
  icon: 'i-lucide-circle-help',
}, {
  label: 'Todo',
  icon: 'i-lucide-circle-plus',
}, {
  label: 'In Progress',
  icon: 'i-lucide-circle-arrow-up',
}, {
  label: 'Done',
  icon: 'i-lucide-circle-check',
}, {
  label: 'Canceled',
  icon: 'i-lucide-circle-x',
}] satisfies Array<InputMenuItem>;

const searchTerm = ref('');
const searchTermDebounced = refDebounced(searchTerm, 200);

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  params: { q: searchTermDebounced },
  transform: (data: Array<User>) => {
    return data?.map((user) => ({ id: user.id, label: user.name, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || [];
  },
  lazy: true,
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UInputMenu
        :items="items"
        autofocus
        placeholder="Search..."
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="neutral"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputMenu
        v-for="variant in variants"
        :key="variant"
        :items="items"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="error"
        highlight
        class="w-48"
      />
    </div>
    <div class="flex flex-col gap-4 w-48">
      <UInputMenu
        :items="items"
        placeholder="Disabled"
        disabled
      />
      <UInputMenu
        :items="items"
        placeholder="Required"
        required
      />
      <UInputMenu
        v-model="selectedItems"
        :items="items"
        placeholder="Multiple"
        multiple
      />
      <UInputMenu
        :items="items"
        loading
        placeholder="Search..."
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        placeholder="Search..."
        :size="size"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="statuses"
        placeholder="Search status..."
        icon="i-lucide-search"
        trailing-icon="i-lucide-chevrons-up-down"
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UIcon
            v-if="modelValue?.icon"
            :name="modelValue.icon"
            :class="ui.leadingIcon()"
          />
        </template>
      </UInputMenu>
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        v-model:search-term="searchTerm"
        :items="users || []"
        :loading="status === 'pending'"
        ignore-filter
        icon="i-lucide-user"
        placeholder="Search users..."
        :size="size"
        class="w-48"
      >
        <template #leading="{ modelValue, ui }">
          <UAvatar
            v-if="modelValue?.avatar"
            :size="ui.itemLeadingAvatarSize() as AvatarProps['size']"
            v-bind="modelValue.avatar"
          />
        </template>
      </UInputMenu>
    </div>
    <div class="flex items-center gap-4">
      <UInputMenu
        v-for="size in sizes"
        :key="size"
        :items="items"
        :model-value="[fruits[0]!]"
        multiple
        icon="i-lucide-search"
        placeholder="Search..."
        :size="size"
        class="w-48"
      />
    </div>
  </div>
</template>
