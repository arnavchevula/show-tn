<script setup lang="ts"> 
  import { defineProps } from 'vue';
  const props = defineProps({
    show:{}
  });
  const authors = ref([
  {
    name: props.show?.venue,
    description: props.show?.age,
    avatar: {
      src: props.show.image
    },
    to: props.show?.url || 'https://github.com/antfu',
    target: '_blank'
  }
])
  </script>

<template>
  <UBlogPost
    :title="props.show?.title"
    :description="props.show.support || props.show.subtitle || props.show.headliners"
    :image="props.show.image || 'https://placehold.co/256'"
    :date="props.show?.parsedDate"
    :authors="authors"
    :ui="{image: 'h-64 w-full'}"
  />
 </template>