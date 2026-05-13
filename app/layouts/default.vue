<script setup lang="ts">
import Header from "../components/Header.vue"
import Footer from "../components/Footer.vue"
import { useAuth } from '~/composables/useAuth'
const { init, user } = useAuth();
const { loadFavorites, mergeAndMigrate, favorites } = useFavorites();

const loginOpen = ref(false)

onMounted(() => {
  init()
  loadFavorites()
})

watch(user, (newUser, oldUser) => {
  if (newUser && newUser.id !== oldUser?.id) {
    mergeAndMigrate()
  } else if (!newUser) {
    favorites.value = []
  }
})
</script>
<template>
    <div class="container mx-auto">
      <Header @login="loginOpen = true"/>
      <slot />
      <LoginModal :open="loginOpen" @close="loginOpen = false"/>                                        
      <Footer /> 
    </div>
  </template>

