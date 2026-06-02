<script setup lang="ts">
const props = defineProps({
  title: String,
  author: String,
  description: String,
  date: String,
  image: String,
});
</script>
<template>
  <h2 class="text-4xl mb-2">{{ props.title }}</h2>
  <p class="text-sm leading-6 text-slate-500 tracking-tight">
    {{ props.description }}
  </p>
  <span class="flex items-end gap-x-2 mt-2 mb-6 pb-2 border-b border-(--ui-border)">
    <UAvatar :alt="props.author" size="lg" />
    <div class="flex flex-col items-start">
      <p class="text-xs mb-2">{{ props.author }}</p>
      <p class="text-xs text-slate-500">{{ props.date }}</p>
    </div>
  </span>
  <NuxtImg
    v-if="image"
    :src="image"
    class="rounded-xl w-full object-cover aspect-[16/9] mb-8"
  />
</template>
