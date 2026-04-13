<script setup lang="ts">
import Header from './header.vue'
import Footer from './footer.vue'

const id = useRoute().params.id
const { data: post } = await useAsyncData(`blog-${id}`, () => {
  return queryCollection('content').where('path', '=', `/${id}`).first()
})
console.log(post);
</script>
<template>
  <div class="container mx-auto px-4 mt-4">
    <template v-if="post">
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
    </template>
    <div v-else>Article not found</div>
  </div>
</template>