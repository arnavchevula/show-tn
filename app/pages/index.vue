<script setup lang="ts">
const links = ref([
  {
    label: 'Learn More',
    to: '/about',
    icon: 'i-lucide-square-play'
  },
  {
    label: 'Live Show Listings',
    to: '/chicago',
    color: 'neutral',
    variant: 'subtle',
    trailingIcon: 'i-lucide-arrow-right'
  }
])

</script>

<template>
  <UPageHero
    title="Support your local scene."
    description="Aren't you tired of missing all your favorite bands? Bored on a Wednesday night? Want to switch it up from hitting the bars in Wrigley and Logan? Get cultured now. Here is a list of shows & events happening this week in Chicago"
    :links="links"
  />
</template>