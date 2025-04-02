<template>
  <div class="map-page">
    <!-- Sidebar for search and category filter -->
    <MapSidebar
      @updateCategory="updateCategory"
      @search="updateSearch"
    />

    <!-- Main map display with current filter and search state -->
    <Map
      :center="center"
      :zoom="zoom"
      :selectedCategory="selectedCategory"
      :searchQuery="searchQuery"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Root view for the map page.
 * Holds state for selected category and search query, passed to child components.
 */

import { ref } from 'vue'
import Map from '@/components/map/Map.vue'
import MapSidebar from '@/components/map/MapSidebar.vue'

/**
 * Default center of the map (mid-Norway).
 */
const center = ref({ lat: 63.5, lng: 11 })

/**
 * Initial zoom level of the map.
 */
const zoom = ref(5.2)

/**
 * Current selected category ('All' by default).
 */
const selectedCategory = ref<'All' | number>('All')

/**
 * Current search query (initially empty).
 */
const searchQuery = ref('')

/**
 * Update selected category from child component.
 * @param cat Category ID or 'All'
 */
const updateCategory = (cat: number | 'All') => {
  selectedCategory.value = cat
}

/**
 * Update search query from child component.
 * @param query Search string
 */
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
