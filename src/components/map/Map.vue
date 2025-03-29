<template>
  <GMapMap :center="center" :zoom="zoom" class="google-map">
    <GMapMarker
      v-for="listing in allListings"
      :key="listing.id"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
      @click="onMarkerClick(listing)"
    />

    <GMapInfoWindow
      v-if="selectedListing"
      :options="{ maxWidth: 300 }"
      :position="{ lat: selectedListing.latitude, lng: selectedListing.longitude }"
      @closeclick="onInfoWindowClose"
    >
      <div class="info-window">
        <h3>{{ selectedListing.briefDescription }}</h3>
        <button @click="goToListing(selectedListing.id)">Go to listing</button>
      </div>
    </GMapInfoWindow>
  </GMapMap>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllListings } from '@/services/listingApi'
import type { ListingResponse } from '@/types/dto'

const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)
const router = useRouter()

function onMarkerClick(listing: ListingResponse) {
  // First close any existing window to reset state
  if (selectedListing.value) {
    selectedListing.value = null
    // Use nextTick or setTimeout to ensure DOM updates before reopening
    setTimeout(() => {
      selectedListing.value = listing
    }, 10)
  } else {
    selectedListing.value = listing
  }
}

function onInfoWindowClose() {
  selectedListing.value = null
}

function goToListing(id: number) {
  router.push(`/listing/${id}`)
}

onMounted(async () => {
  allListings.value = await getAllListings()
})
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.info-window {
  max-width: 200px;
  padding: 8px;
  font-family: sans-serif;
}
.info-window h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
