<template>
  <div class="map-page">
    <MapSidebar
      @updateCategory="updateCategory"
      @search="updateSearch"
    />
    <Map
      :center="center"
      :zoom="zoom"
      :selectedCategory="selectedCategory"
      :searchQuery="searchQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Map from '@/components/map/Map.vue'
import MapSidebar from '@/components/map/MapSidebar.vue'

const center = ref({ lat: 63.5, lng: 11 })
const zoom = ref(5.2)
const selectedCategory = ref('All')
const searchQuery = ref('')

const updateCategory = (cat: number | 'All') => {
  selectedCategory.value = cat
}

const updateSearch = (query: string) => {
  searchQuery.value = query
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
