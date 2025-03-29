<template>
  <div class="map-page">
    <MapSidebar @updateCategory="updateCategory" />
    <MapWrapper :center="center" :zoom="zoom" :selectedCategory="selectedCategory" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapWrapper from '@/components/map/Map.vue'
import MapSidebar from '@/components/map/MapSidebar.vue'

// Sett et senter for kartet, for eksempel Oslo
const center = ref({ lat: 61.3, lng: 9.5 })
const zoom = ref(5.8)

// Legger til filtervariabelen med standard 'Alle'
const selectedCategory = ref('Alle')

// Oppdaterer filteret når MapSidebar emitter et event
const updateCategory = (cat: string) => {
  selectedCategory.value = cat
}
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
