<template>
  <div class="map-page">
    <MapWrapper :center="center" :zoom="zoom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapWrapper from '@/components/MapWrapper.vue'

// Sett et senter for kartet, for eksempel Oslo
const center = ref({ lat: 59.9139, lng: 10.7522 })
const zoom = ref(12)
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  padding: 1rem;
}
</style>
