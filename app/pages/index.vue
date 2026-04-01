<script setup lang="ts">
const url = useRequestURL()

useSeoMeta({
  title: 'Show TN — Chicago Live Music This Week',
  description: 'Find live music events and shows happening this week across Chicago venues. Your guide to Chicago nightlife, concerts, and events.',
  ogTitle: 'Show TN — Chicago Live Music This Week',
  ogDescription: 'Find live music events and shows happening this week across Chicago venues. Your guide to Chicago nightlife, concerts, and events.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: 'Show TN',
  twitterCard: 'summary',
  twitterTitle: 'Show TN — Chicago Live Music This Week',
  twitterDescription: 'Find live music events and shows happening this week across Chicago venues. Your guide to Chicago nightlife, concerts, and events.',
  keywords: 'chicago live music, what to do in chicago, nightlife in chicago, music in chicago, events in chicago, chicago concerts, chicago shows this week, chicago venues, Beat Kitchen, Thalia Hall, The Hideout, Sleeping Village, Coles Bar, Dorians, Aragon Ballroom, Chop Shop, Bottom Lounge, The Whistler, California Clipper, SmartBar, Gman Tavern, Podlasie Club, Lemon Chicago, Book Club Chicago, The Salt Shed, Clara Chicago, Smoke and Mirrors Chicago, Avondale Music Hall, Cobra Lounge, Lincoln Hall, Schubas Tavern, SubT, Empty Bottle, Park West Chicago, The Vic Chicago, The Riviera Chicago',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Show TN',
        url: url.origin,
        description: 'Find live music events and shows happening this week across Chicago venues.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${url.origin}/chicago`,
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})

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
    title="support the Chicago scene."
    description="Aren't you tired of missing all your favorite bands? Bored on a Wednesday night? Want to switch it up from hitting the bars in Wrigley and Logan? Get cultured now. Here is a list of shows & events happening this week in Chicago:"
    :links="links"
    />
</template>