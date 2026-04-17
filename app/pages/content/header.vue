<script setup lang="ts">
  const props = defineProps({
    title: String,
    author: String,
    description: String,
    date: String
  });
</script>
<template>
    <h2 class="text-4xl mb-2">{{ props.title }}</h2>
    <p class="text-sm leading-6 text-slate-500 tracking-tight">{{props.description }}</p>
        <span class="flex items-end gap-x-2 mt-2 mb-2 pb-2">
            <UAvatar :alt="props.author" size="lg" />
            <div class="flex flex-col items-start">
                <p class="text-xs mb-2">{{ props.author }}</p>
                <p class="text-xs text-slate-500">{{ props.date }}</p>
            </div>
        </span>
</template>