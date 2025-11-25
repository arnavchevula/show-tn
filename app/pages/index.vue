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
    title="Let's go to a show!"
    description="Looking for live music in Chicago? Here is a list of events this week collected from all the venues across the city. Whether you want to see a DIY punk show or an arena size pop tour, we have it all!"
    :links="links"
  />
</template>