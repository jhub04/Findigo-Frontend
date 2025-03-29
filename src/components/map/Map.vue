<template>
  <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef">
    <GMapMarker
      v-for="listing in allListings"
      :key="listing.id"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
      @click="onMarkerClick(listing)"
    />
  </GMapMap>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllListings } from '@/services/listingApi'
import type { ListingResponse } from '@/types/dto'

// Example fallback image
import noImage from '@/assets/no-image.jpg'

const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

const mapRef = ref<any>(null)            // Reference to GMapMap component
const infoWindow = ref<any>(null)        // Will store the google.maps.InfoWindow instance
const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)

const router = useRouter()

onMounted(async () => {
  allListings.value = await getAllListings()
})

function onMarkerClick(listing: ListingResponse) {
  selectedListing.value = listing

  // If the map is loaded and the "google" object is available
  if (mapRef.value && window.google) {
    // Close an existing InfoWindow before creating a new one
    if (infoWindow.value) {
      infoWindow.value.close()
    }

    // 1) Create container DIV
    const content = document.createElement('div')
    content.className = 'info-window' // We'll style this in <style> below

    // 2) Create a title (h3)
    const title = document.createElement('h3')
    title.textContent = listing.briefDescription || 'No title'
    content.appendChild(title)

    // 3) Create an image wrapper
    const imageWrapper = document.createElement('div')
    imageWrapper.className = 'image-wrapper'

    // 4) Create an img element
    const img = document.createElement('img')
    // If listing.imageUrls exists, show first image; otherwise show fallback
    img.src = (listing.imageUrls && listing.imageUrls[0]) || noImage
    img.alt = 'Listing image'
    img.className = 'listing-image'

    // Optionally handle image errors
    img.onerror = () => {
      img.src = noImage
    }

    // Append the image to the wrapper
    imageWrapper.appendChild(img)
    // Then append imageWrapper to content
    content.appendChild(imageWrapper)

    // 5) Create a "Go to listing" button
    const button = document.createElement('button')
    button.textContent = 'Go to listing'
    button.onclick = () => goToListing(listing.id)
    content.appendChild(button)

    // 6) Create new InfoWindow
    infoWindow.value = new window.google.maps.InfoWindow({
      content,
      maxWidth: 400 // Adjust to make it bigger
    })

    // 7) Open the InfoWindow on the map at the marker’s coordinates
    const mapObject = mapRef.value.$mapObject // The raw Google Map instance
    infoWindow.value.setPosition({ lat: listing.latitude, lng: listing.longitude })
    infoWindow.value.open(mapObject)

    // 8) Listen for the close click
    infoWindow.value.addListener('closeclick', () => {
      selectedListing.value = null
    })
  }
}

function goToListing(id: number) {
  router.push(`/listing/${id}`)
}
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* InfoWindow content container */
.info-window {
  /* Adjust width/height or use max-width, etc. */
  width: 300px;          /* or auto */
  max-width: 400px;      /* see also the 'maxWidth' in InfoWindow options */
  padding: 12px;
  font-family: sans-serif;
}

/* Title in the InfoWindow */
.info-window h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

/* Image wrapper so we can style it (optional) */
.image-wrapper {
  margin-bottom: 0.5rem; /* spacing below image */
}

/* The actual listing image */
.listing-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
  max-height: 200px; /* or whatever you prefer */
}

/* The “Go to listing” button styles */
.info-window button {
  display: inline-block;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
</style>
