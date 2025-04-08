<template>
  <div
    class="map-page"
    :style="{ top: navbarHeight + 'px' }"
  >
    <!-- Sidebar -->
    <MapSidebar :navbar-height="navbarHeight" />

    <!-- Kartet -->
    <Map :center="center" :zoom="zoom" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Map from '@/components/map/Map.vue'
import MapSidebar from '@/components/map/MapSidebar.vue'

const center = ref({ lat: 63.5, lng: 11 })
const zoom = ref(5.2)
const navbarHeight = ref(0)

function updateNavbarHeight() {
  const navbar = document.getElementById('main-navbar')
  if (navbar) navbarHeight.value = navbar.offsetHeight
}

onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})
</script>

<style scoped>
.map-page {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.map-wrapper {
  flex: 1;
  position: relative;
  height: 100%;
}
</style>
