<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').all())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
console.log(home)
</script>

<template>
  <h1 class="text-3xl mb-2 p-2 text-center font-bold">Editorial</h1>
  <hr class="border-t border-(--ui-border) mb-1" />
      <div v-for="article in home">
        <div class="py-2 px-2">
          <NuxtLink :to="`/content/${article.stem}`">
            <p class="text-xs text-slate-500 mb-1">{{ article.meta.length }} minute read</p>
            <h2 class="text-xl sm:text-2xl">{{ article.title }}</h2>
            <p class="text-sm text-slate-400 mb-1">{{ article.description }}</p>
            <div class="flex items-center gap-x-2 text-xs sm:text-sm">
              <span class="font-medium text-slate-200">{{ article.meta.author }}</span>
              <span class="text-slate-600">·</span>
              <span class="text-slate-500">{{ article.meta.date }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

</template>