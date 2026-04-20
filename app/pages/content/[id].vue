<script setup lang="ts">
import Header from './header.vue'
import Footer from './footer.vue'

const id = useRoute().params.id
const { data: post } = await useAsyncData(`blog-${id}`, () => {
  return queryCollection('content').where('path', '=', `/${id}`).first()
})

const tocLinks = computed(() => post.value?.body?.toc?.links ?? [])
</script>
<template>
  <div class="container mx-auto px-4 mt-4 max-w-5xl">
    <NuxtLink to="/content" class="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-rose-200 hover:text-rose-100 transition-colors mb-6">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      View All Articles
    </NuxtLink>
    <template v-if="post">
      <div class="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
        <article>
          <Header
            :title="post.title"
            :author="post.meta?.author"
            :description="post.description"
            :date="post.meta.date"
          />
          <ContentRenderer :value="post" />
          <Footer
            :title="post.title"
            :author="post.meta?.author"
            :bio="post.meta?.bio"
            :urls="post.meta.urls"
          />
        </article>
        <aside v-if="tocLinks.length" class="hidden lg:block">
          <nav class="sticky top-6 text-sm">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">On this page</p>
            <ul class="space-y-2">
              <li v-for="link in tocLinks" :key="link.id">
                <a :href="`#${link.id}`" class="text-slate-400 hover:text-rose-200 transition-colors">{{ link.text }}</a>
                <ul v-if="link.children?.length" class="mt-2 ml-3 space-y-2">
                  <li v-for="child in link.children" :key="child.id">
                    <a :href="`#${child.id}`" class="text-slate-500 hover:text-rose-200 transition-colors">{{ child.text }}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </template>
    <div v-else>Article not found</div>
  </div>
</template>