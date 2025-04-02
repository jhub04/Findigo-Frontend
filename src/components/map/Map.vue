<template>
  <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef">
    <GMapMarker
      v-for="listing in uniqueListings"
      :key="`${listing.latitude}-${listing.longitude}`"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
      @click="onMarkerClick(listing.latitude, listing.longitude)"
    />
  </GMapMap>
</template>

<script setup lang="ts">
/**
 * Displays a Google Map with interactive markers for listings.
 * Markers are filtered by category and query. Clicking a marker opens an info window.
 */

import { ref, onMounted, computed, watch } from 'vue'
import { getAllListings } from '@/services/listingApi'
import { getAllCategories, getListingsByCategory } from '@/services/categoryApi'
import type { CategoryResponse, ListingResponse } from '@/types/dto'
import { getListingsByCategory } from '@/services/listingApi'
import type { ListingResponse } from '@/types/dto'
import noImage from '@/assets/no-image.jpg'
import { navigateToListing } from '@/utils/navigationUtil.ts'

/**
 * Props passed from the MapView component.
 */
const props = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
  selectedCategory?: number | 'All'
  searchQuery?: string
}>()

// Map reference and InfoWindow state
const mapRef = ref<any>(null)
const infoWindow = ref<any>(null)

// Listings and category state
const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)
const categories = ref<CategoryResponse[]>([])

/**
 * Filtered listings based on selected category and search query.
 */
const filteredListings = computed(() => {
  let listings = allListings.value

  if (props.selectedCategory && props.selectedCategory !== 'All') {
    const categoryId = Number(props.selectedCategory)
    listings = listings.filter(l => l.category?.id === categoryId)
  }

  if (props.searchQuery && props.searchQuery.trim() !== '') {
    const query = props.searchQuery.toLowerCase()
    listings = listings.filter(l => l.briefDescription?.toLowerCase().includes(query))
  }

  return listings
})

/**
 * Group listings by lat/lng to avoid overlapping markers.
 */
const listingsByPosition = computed(() => {
  const map = new Map<string, ListingResponse[]>()
  filteredListings.value.forEach(listing => {
    const key = `${listing.latitude},${listing.longitude}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push(listing)
  })
  return map
})

/**
 * One unique marker per coordinate group.
 */
const uniqueListings = computed(() => {
  return Array.from(listingsByPosition.value.values()).map(group => group[0])
})

/**
 * Watch selectedCategory and refetch listings when it changes.
 */
watch(() => props.selectedCategory, async (newCategory) => {
  allListings.value = []
  selectedListing.value = null

  if (!newCategory || newCategory === 'All') {
    allListings.value = await getAllListings()
  } else {
    const categoryId = Number(newCategory)
    if (categoryId) {
      allListings.value = await getListingsByCategory(categoryId)
    } else {
      console.error(`Unknown category: ${newCategory}`)
    }
  }
})

/**
 * Load categories and listings when the map component is mounted.
 */
onMounted(async () => {
  categories.value = await getAllCategories()
  allListings.value = await getAllListings()
})

/**
 * Debug helper to log listings.
 */
function logListings(listings: ListingResponse[]) {
  console.log('📍 Listings loaded:')
  listings.forEach(l => {
    console.log(`[ID ${l.id}] ${l.briefDescription} → lat: ${l.latitude}, lng: ${l.longitude}`)
  })
}

/**
 * Handle marker click and show a styled info window with listing preview.
 * Supports cycling through overlapping listings using 'Next'.
 */
function onMarkerClick(lat: number, lng: number) {
  const key = `${lat},${lng}`
  const group = listingsByPosition.value.get(key)
  if (!group || group.length === 0) return

  let index = 0

  const updateInfoWindow = () => {
    const listing = group[index]
    const content = document.createElement('div')
    content.style.cssText = `
      width: 200px;
      font-family: sans-serif;
      background-color: #fff;
      padding: 0px 8px 8px 8px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `

    const title = document.createElement('h3')
    title.textContent = listing.briefDescription || 'No title'
    title.style.cssText = `
      font-size: 1.1rem;
      margin: 0;
      padding: 0;
      font-weight: 600;
      line-height: 1.2;
    `
    content.appendChild(title)

    const img = document.createElement('img')
    img.src = noImage // TODO: Fetch image
    img.alt = 'Listing image'
    img.style.cssText = `
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 4px;
      max-height: 130px;
    `
    content.appendChild(img)

    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    `

    if (group.length > 1) {
      const nextBtn = document.createElement('button')
      nextBtn.textContent = 'Next'
      nextBtn.style.cssText = `
        padding: 6px 10px;
        font-size: 0.9rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `
      nextBtn.onclick = () => {
        index = (index + 1) % group.length
        updateInfoWindow()
      }
      buttonContainer.appendChild(nextBtn)
    }

    const goToBtn = document.createElement('button')
    goToBtn.textContent = 'Go to listing'
    goToBtn.onclick = () => navigateToListing(listing)
    goToBtn.style.cssText = `
      padding: 6px 10px;
      font-size: 0.9rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `
    buttonContainer.appendChild(goToBtn)

    content.appendChild(buttonContainer)

    if (infoWindow.value) infoWindow.value.close()
    infoWindow.value = new google.maps.InfoWindow({ content })



    const mapObject = mapRef.value.$mapObject
    mapObject.panTo({ lat, lng })
    infoWindow.value.setPosition({ lat, lng })
    infoWindow.value.open(mapObject)

    setTimeout(() => {
      const header = document.querySelector('.gm-style-iw-chr')
      if (header) {

        const titleEl = document.createElement('span')
        titleEl.textContent = group[index].briefDescription || 'No title'
        titleEl.style.cssText = `
          font-size: 1rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `

        const closeBtn = document.querySelector('.gm-ui-hover-effect')
        if (closeBtn && !header.querySelector('span')) {
          header.insertBefore(titleEl, closeBtn)
        }
      }
    }, 0)
  }

  updateInfoWindow()
}
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
