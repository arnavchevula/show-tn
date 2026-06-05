<script setup lang="ts">
const { data: home } = await useAsyncData(() =>
  queryCollection("content").all(),
);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
});
console.log(home);
</script>

<template>
  <div class="container mx-auto px-4 sm:px-0 mt-4">
    <div
      class="border-b border-(--ui-border) pb-6 mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end"
    >
      <div>
        <p class="text-sm text-neutral-400 uppercase tracking-wide">
          opener.fm
        </p>
        <h1 class="text-5xl font-bold">Editorial</h1>
        <p class="text-slate-400 text-sm mt-1">
          Read about Chicago's music scene and more.
        </p>
      </div>
      <div>
        <p class="text-2xl font-semibold text-slate-200">{{ home?.length }}</p>
        <p class="text-xs text-slate-500 uppercase tracking-wide">articles</p>
      </div>
    </div>

    <NuxtLink
      v-for="article in home"
      :key="article.stem"
      :to="`/content/${article.stem}`"
      class="flex flex-col gap-1 py-4 border-b border-(--ui-border) last:border-b-0 hover:bg-neutral-800 rounded-md px-2 transition-colors"
    >
      <div class="flex items-center gap-x-2 text-xs text-slate-500">
        <span>{{ article.meta.author }}</span>
        <span>·</span>
        <span>{{ article.meta.date }}</span>
        <span>·</span>
        <span>{{ article.meta.length }} min read</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-semibold">{{ article.title }}</h2>
      <p class="text-sm text-slate-400 leading-5">{{ article.description }}</p>
    </NuxtLink>
  </div>
</template>
