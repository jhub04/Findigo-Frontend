<template>
  <div class="map-page">
    <!-- Sidebar for search and category filter -->
    <MapSidebar/>

    <!-- Main map display with current filter and search state -->
    <Map
      :center="center"
      :zoom="zoom"
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

</script>

<style scoped>
.map-page {
  display: flex;
  position: absolute;
  top: 69px; /* Account for navbar height */
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
}

.map-wrapper {
  flex: 1;
  position: relative;
  height: 100%;
}
</style>
