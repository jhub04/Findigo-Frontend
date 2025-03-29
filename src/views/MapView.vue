<template>
  <div class="map-page">
    <MapSidebar />
    <MapWrapper :center="center" :zoom="zoom" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapWrapper from '@/components/map/MapWrapper.vue'
import MapSidebar from '@/components/map/MapSidebar.vue'

// Sett et senter for kartet, for eksempel Oslo
const center = ref({ lat: 61.3, lng: 9.5 })
const zoom = ref(5.8)
</script>

<style scoped>
.map-page {
  width: 100%;
  height: 100vh;
  padding: 1rem;
}

.map-page > *:first-child {
  margin-top: 69px;
}
</style>
