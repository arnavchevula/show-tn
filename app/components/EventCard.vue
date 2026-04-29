<script setup lang="ts">
  import { defineProps } from 'vue';
  const props = defineProps({
    show:{}
  });

  const displayDate = computed(() => {
    const d = props.show?.parsedDate;
    if (!d) return '';
    if (d instanceof Date) return d.toDateString();
    return new Date(d + 'T00:00:00').toDateString();
  });
  </script>

<template>
    <div class="border-b-red-200 border-b pb-4 mb-4">
    <p class="text-xs">{{ props.show?.header }}</p>
    <h1 class="text-2xl">{{ props.show?.title }}</h1>
    <p class="text-xs">{{ props.show?.support }}</p>
    <span class="flex items-center gap-x-1 ">
      <UIcon name="i-lucide-map-pin" class="size-4 text-rose-200" />
      <p class="text-md">{{ props.show?.venue }}</p>
    </span>
    <span class="flex items-center gap-x-1 ">
      <UIcon name="i-lucide-calendar-days" class="size-4 text-rose-200" />
      <p class="text-sm">{{ displayDate }}</p>
    </span>
    <span v-if = "props.show?.showTime" class="flex items-center gap-x-1 mb-1 mt-1">
      <UIcon name="i-lucide-clock" class="size-4 text-rose-200" />
      <p class="text-xs">{{ props.show?.showTime }}</p>
    </span>
    <span v-if="props.show?.doorsTime !== props.show?.showTime && props.show?.doorsTime" class="flex items-center gap-x-1 mb-1">
      <UIcon name="i-lucide-door-open" class="size-4 text-rose-200" />
      <p class="text-xs">{{ props.show?.doorsTime }}</p>
    </span>
    <span v-if="props.show?.age" class="flex items-center gap-x-1 ">
      <UIcon name="i-lucide-user" class="size-4 text-rose-200" />
      <p class="text-xs">{{ props.show?.age }}</p>
    </span>

    <div class="flex flex-wrap gap-2 mt-2">
      <UButton v-if="props.show?.url" icon="i-lucide-ticket" size="md" color="neutral" variant="outline">
        <a :href="props.show?.url" target="_blank" rel="noopener nofollow" @click.stop>
          Tickets
        </a>
      </UButton>
      <UButton v-if="props.show?.secondaryUrl" icon="i-lucide-circle-arrow-out-up-right" size="md" color="neutral" variant="outline">
        <a :href="props.show?.secondaryUrl" target="_blank" rel="noopener nofollow">
          Learn More
        </a>
      </UButton>
    </div>
    <div @click.stop class="mt-2">
      <AddToCalendar :show="props.show" />
    </div>


    </div>
 </template>