<script setup lang="ts">
import theme from '#build/pohon/avatar';

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>;
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="flex items-center gap-1.5">
      <PAvatar
        v-for="size in sizes"
        :key="size"
        src="https://github.com/praburangki.png"
        alt="Benjamin Canac"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <PAvatar
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-image"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <PAvatar
        v-for="size in sizes"
        :key="size"
        alt="Benjamin Canac"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <PAvatar
        v-for="size in sizes"
        :key="size"
        :text="size"
        :size="size"
      />
    </div>

    <div class="flex items-center gap-1.5">
      <PAvatarGroup
        v-for="size in sizes"
        :key="size"
        :size="size"
        :max="2"
      >
        <PChip
          inset
          text="1"
        >
          <PAvatar
            src="https://github.com/praburangki.png"
            alt="Benjamin Canac"
          />
        </PChip>
        <PAvatar
          src="https://github.com/romhml.png"
          alt="Romain Hamel"
        />
        <PAvatar
          src="https://github.com/noook.png"
          alt="Neil Richter"
        />
      </PAvatarGroup>
    </div>
    <div class="flex items-center gap-1.5">
      <PAvatarGroup
        v-for="size in sizes"
        :key="size"
        :size="size"
        :max="4"
      >
        <PAvatar
          src="https://github.com/praburangki.png"
          alt="Benjamin Canac"
        />
        <PAvatar
          src="https://github.com/romhml.png"
          alt="Romain Hamel"
        />
        <PAvatar
          src="https://github.com/noook.png"
          alt="Neil Richter"
        />
      </PAvatarGroup>
    </div>
  </div>
</template>
