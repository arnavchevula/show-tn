<script setup lang="ts"> 
  import { defineProps } from 'vue';
  const props = defineProps({
    show:{}
  });

  </script>

<template>
    <div class="border-b-red-200 border-b pb-4 mb-4">
    <p class="text-xs">{{ props.show?.header }}</p>
    <h1 class="text-2xl">{{ props.show?.title }}</h1>
    <p class="text-xs">{{ props.show?.support }}</p>
    <p class="text-md">{{ props.show?.venue }}</p>
    <p class="text-sm">{{ props.show?.parsedDate.toDateString() }}</p>
    <p class="text-xs">{{ props.show?.showTime }}</p>
    <p v-if="props.show?.doorsTime !== props.show?.showTime" class="text-xs">{{ props.show?.doorsTime }}</p>
    <p class="text-xs">{{ props.show?.age }}</p>
    <div class="flex w-full gap-2 mt-2">
      <UButton v-if="props.show?.url" icon="i-lucide-ticket" size="md" color="neutral" variant="outline">
        <a :href="props.show?.url" target="_blank" rel="noopener nofollow">
          Tickets
        </a>
      </UButton>
      <UButton v-if="props.show?.secondaryUrl" icon="i-lucide-circle-arrow-out-up-right" size="md" color="neutral" variant="outline">
        <a :href="props.show?.secondaryUrl" target="_blank" rel="noopener nofollow">
          Learn More
        </a>
      </UButton>
    </div>


    </div>
 </template>