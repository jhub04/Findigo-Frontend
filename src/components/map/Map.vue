<template>
  <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef">
    <!-- Bruker filteredListings i stedet for allListings -->
    <GMapMarker
      v-for="listing in filteredListings"
      :key="listing.id"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
      @click="onMarkerClick(listing)"
    />
  </GMapMap>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllListings } from '@/services/listingApi'
import { getListingsByCategory } from '@/services/categoryApi'
import type { ListingResponse } from '@/types/dto'
import noImage from '@/assets/no-image.jpg'

const props = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
  selectedCategory?: string // 'All', 'House', 'Car'
}>()

const mapRef = ref<any>(null)
const infoWindow = ref<any>(null)
const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)
const router = useRouter()
const categoryNameToId = {
  House: 1,
  Car: 2
}

watch(() => props.selectedCategory, async (newCategory) => {
  allListings.value = []
  selectedListing.value = null

  if (!newCategory || newCategory === 'All') {
    allListings.value = await getAllListings()
  } else {
    const categoryId = categoryNameToId[newCategory]
    if (categoryId) {
      allListings.value = await getListingsByCategory(categoryId)
    } else {
      console.error(`Unknown category: ${newCategory}`)
    }
  }

  logListings(allListings.value)
})


onMounted(async () => {
  allListings.value = await getAllListings()
  logListings(allListings.value)
})

function logListings(listings: ListingResponse[]) {
  console.log('📍 Listings loaded:')
  listings.forEach(l => {
    console.log(`[ID ${l.id}] ${l.briefDescription} → lat: ${l.latitude}, lng: ${l.longitude}`)
  })
}




// Kun nødvendig endring: filtrerer listings basert på listing.category.name
const filteredListings = computed(() => {
  console.log('All listings:', allListings.value.map(l => l.category.name))
  console.log('Selected category:', props.selectedCategory)

  if (!props.selectedCategory || props.selectedCategory === 'All') {
    return allListings.value
  }

  return allListings.value.filter(
    listing => listing.category.name === props.selectedCategory
  )
})




function onMarkerClick(listing: ListingResponse) {
  selectedListing.value = listing

  if (mapRef.value && window.google) {
    if (infoWindow.value) {
      infoWindow.value.close()
    }

    const content = document.createElement('div')
    content.style.cssText = `
      width: 310px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-family: sans-serif;
      background-color: #fff;
      padding: 10px;
    `

    const title = document.createElement('h3')
    title.textContent = listing.briefDescription || 'No title'
    title.style.cssText = `
      font-size: 1.1rem;
      margin: 0 0 8px;
      font-weight: 600;
    `
    content.appendChild(title)

    const imageWrapper = document.createElement('div')
    imageWrapper.style.cssText = `margin-bottom: 8px;`

    const img = document.createElement('img')
    img.src = (listing.imageUrls && listing.imageUrls[0]) || noImage
    img.alt = 'Listing image'
    img.onerror = () => { img.src = noImage }
    img.style.cssText = `
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 4px;
      max-height: 180px;
    `
    imageWrapper.appendChild(img)
    content.appendChild(imageWrapper)

    const button = document.createElement('button')
    button.textContent = 'Go to listing'
    button.onclick = () => goToListing(listing.id)
    button.style.cssText = `
      display: inline-block;
      padding: 8px 16px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      margin-top: 8px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: #fff;
    `
    button.onmouseenter = () => button.style.backgroundColor = '#0056b3'
    button.onmouseleave = () => button.style.backgroundColor = '#007bff'
    content.appendChild(button)

    infoWindow.value = new window.google.maps.InfoWindow({
      content,
      maxWidth: 400
    })

    const mapObject = mapRef.value.$mapObject
    mapObject.panTo({ lat: listing.latitude, lng: listing.longitude })
    infoWindow.value.setPosition({ lat: listing.latitude, lng: listing.longitude })
    infoWindow.value.open(mapObject)

    infoWindow.value.addListener('closeclick', () => {
      selectedListing.value = null
    })
  }
}

function goToListing(id: number) {
  router.push(`/listing/${id}`)
}
</script>


<style>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
