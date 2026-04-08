<script setup lang="ts">
const url = useRequestURL()

useSeoMeta({
  title: 'Opener.fm | Chicago Shows This Week',
  description: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogTitle: 'Opener.fm | Chicago Shows This Week',
  ogDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: 'Opener.fm',
  ogImage: 'https://opener.fm/og-image.png',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://opener.fm/og-image.png',
  twitterTitle: 'Opener.fm | Chicago Shows This Week',
  twitterDescription: 'Browse all live music events happening this week in Chicago. Shows at Beat Kitchen, Empty Bottle, Lincoln Hall, Thalia Hall, SmartBar, Salt Shed, and more.',
  keywords: 'chicago live music this week, chicago shows, chicago concerts, events in chicago, what to do in chicago tonight, chicago nightlife, Beat Kitchen shows, Thalia Hall shows, The Hideout Chicago, Sleeping Village Chicago, Coles Bar Chicago, Dorians Chicago, Aragon Ballroom shows, Chop Shop Chicago, Bottom Lounge Chicago, The Whistler Chicago, California Clipper Chicago, SmartBar Chicago, Gman Tavern Chicago, Podlasie Club Chicago, Lemon Chicago, Book Club Chicago, The Salt Shed Chicago, Clara Chicago, Smoke and Mirrors Chicago, Avondale Music Hall Chicago, Cobra Lounge Chicago, Lincoln Hall Chicago, Schubas Tavern Chicago, SubT Chicago, Empty Bottle Chicago, Park West Chicago, The Vic Chicago, The Riviera Chicago',
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