<script setup lang="ts">
const open = ref(false);
const inset = ref(false);
</script>

<template>
  <div class="flex flex-col gap-2">
    <USwitch
      v-model="inset"
      label="Inset"
      class="mb-4"
    />

    <UDrawer
      v-model:open="open"
      title="Drawer with v-model"
      description="This is useful to control the state yourself."
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open with v-model"
      />

      <template #body>
        <Placeholder class="h-48 w-full" />
      </template>

      <template #footer>
        <UButton
          label="Submit"
          color="neutral"
          class="justify-center"
        />
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          class="justify-center"
          @click="open = false"
        />
      </template>
    </UDrawer>

    <UDrawer
      should-scale-background
      title="Drawer with `should-scale-background`"
      description="You need to add the `data-vaul-drawer-wrapper` directive to your content to make it work."
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open with scale"
      />

      <template #body>
        <Placeholder class="h-screen w-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer with bottom direction"
      direction="bottom"
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open on bottom"
      />

      <template #body>
        <Placeholder class="h-96 w-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer with left direction"
      direction="left"
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open on left"
      />

      <template #body>
        <Placeholder class="w-96 h-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer with top direction"
      direction="top"
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open on top"
      />

      <template #body>
        <Placeholder class="h-96 w-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer with right direction"
      direction="right"
      :inset="inset"
    >
      <UButton
        color="neutral"
        variant="outline"
        label="Open on right"
      />

      <template #body>
        <Placeholder class="w-96 h-full" />
      </template>
    </UDrawer>
  </div>
</template>
