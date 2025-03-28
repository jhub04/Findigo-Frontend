<template>
  <GMapMap class="google-map" :center="center" :zoom="zoom" />
</template>

<script setup lang="ts">
const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px; /* valgfritt, for penere utseende */
}
</style>
