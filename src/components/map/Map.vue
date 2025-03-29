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
      :key="infoWindowKey"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllListings } from '@/services/listingApi'
import type { ListingResponse } from '@/types/dto'

const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)
const infoWindowKey = ref<number>(0)

const router = useRouter()

function onMarkerClick(listing: ListingResponse) {
  selectedListing.value = listing
  // Oppdater nøkkel for å tvinge ny re-mount
  infoWindowKey.value = Date.now()
}

function onInfoWindowClose() {
  // Lukk infovinduet
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
