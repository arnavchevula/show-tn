<script setup lang="ts">
import { divIcon } from 'leaflet'

const props = defineProps<{ lat: number; lng: number }>()

const markerIcon = divIcon({
  className: '',
  html: `<div style="width:12px;height:12px;border-radius:50%;background:#f97316;border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 8px rgba(249,115,22,0.7)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})
</script>

<template>
  <div class="w-full rounded-xl overflow-hidden" style="height:300px">
    <LMap :zoom="15" :center="[props.lat, props.lng]">
      <LTileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        layer-type="base"
        name="CartoDB Dark Matter"
      />
      <LMarker :lat-lng="[props.lat, props.lng]" :icon="markerIcon" />
    </LMap>
  </div>
</template>
