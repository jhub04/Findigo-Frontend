<template>
  <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef">
    <GMapMarker
      v-for="listing in allListings"
      :key="listing.id"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
      @click="onMarkerClick(listing)"
      ref="markers"
    />
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
const mapRef = ref(null)
const infoWindow = ref(null)
const router = useRouter()

function onMarkerClick(listing: ListingResponse) {
  selectedListing.value = listing

  // If the map and google are available
  if (mapRef.value && window.google) {
    // Create infoWindow content
    const content = document.createElement('div')
    content.className = 'info-window'

    const title = document.createElement('h3')
    title.textContent = listing.briefDescription
    content.appendChild(title)

    const button = document.createElement('button')
    button.textContent = 'Go to listing'
    button.onclick = () => goToListing(listing.id)
    content.appendChild(button)

    // Close existing infoWindow if it exists
    if (infoWindow.value) {
      infoWindow.value.close()
    }

    // Create a new infoWindow instance every time
    infoWindow.value = new window.google.maps.InfoWindow({
      content: content,
      maxWidth: 300
    })

    // Get the Google Maps instance and open the infoWindow
    const map = mapRef.value.$mapObject
    infoWindow.value.setPosition({ lat: listing.latitude, lng: listing.longitude })
    infoWindow.value.open(map)

    // Add close event listener
    infoWindow.value.addListener('closeclick', () => {
      selectedListing.value = null
    })
  }
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
