<script setup lang="ts"> 
  import { defineProps } from 'vue';
  const props = defineProps({
    show:{}
  });
  </script>

<template>
    <div class="border-b-red-200 border-b">
    <p class="text-xs">{{ props.show?.header }}</p>
    <h1 class="text-2xl">{{ props.show?.title }}</h1>
    <p class="text-xs">{{ props.show?.support }}</p>
    <p class="text-md">{{ props.show?.venue }}</p>
    <p class="text-sm">{{ props.show?.parsedDate.toDateString() }}</p>
    <p class="text-xs">{{ props.show?.showTime }}</p>
    <p class="text-xs">{{ props.show?.doorsTime }}</p>
    <p class="text-xs">{{ props.show?.age }}</p>



    </div>
 </template>