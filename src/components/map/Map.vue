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
import { ref, onMounted, computed, watch } from 'vue'
import { getAllListings } from '@/services/listingApi'
import { getAllCategories, getListingsByCategory } from '@/services/categoryApi'
import type { CategoryResponse, ListingResponse } from '@/types/dto'
import noImage from '@/assets/no-image.jpg'
import {navigateToListing} from '@/utils/navigationUtil.ts'

const props = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
  selectedCategory?: number | 'All'
  searchQuery?: string
}>()

const mapRef = ref<any>(null)
const infoWindow = ref<any>(null)
const allListings = ref<ListingResponse[]>([])
const selectedListing = ref<ListingResponse | null>(null)
const categories = ref<CategoryResponse[]>([])

const filteredListings = computed(() => {
  let listings = allListings.value

  if (props.selectedCategory && props.selectedCategory !== 'All') {
    const categoryId = Number(props.selectedCategory)
    listings = listings.filter(l => l.category.id === categoryId)

  }

  if (props.searchQuery && props.searchQuery.trim() !== '') {
    const query = props.searchQuery.toLowerCase()
    listings = listings.filter(
      l => l.briefDescription?.toLowerCase().includes(query)
    )
  }

  return listings
})



const listingsByPosition = computed(() => {
  const map = new Map<string, ListingResponse[]>()
  filteredListings.value.forEach(listing => {
    const key = `${listing.latitude},${listing.longitude}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push(listing)
  })
  return map
})

const uniqueListings = computed(() => {
  return Array.from(listingsByPosition.value.values()).map(group => group[0])
})


watch(() => props.selectedCategory, async (newCategory) => {
  allListings.value = []
  selectedListing.value = null

  if (!newCategory || newCategory === 'All') {
    allListings.value = await getAllListings()
    console.log('All listings:', allListings.value)
  } else {
    const categoryId = Number(newCategory)
    if (categoryId) {
      allListings.value = await getListingsByCategory(categoryId)
      logListings(allListings.value)
    } else {
      console.error(`Unknown category: ${newCategory}`)
    }
  }

})


onMounted(async () => {
  categories.value = await getAllCategories()
  allListings.value = await getAllListings()
})

function logListings(listings: ListingResponse[]) {
  console.log('📍 Listings loaded:')
  listings.forEach(l => {
    console.log(`[ID ${l.id}] ${l.briefDescription} → lat: ${l.latitude}, lng: ${l.longitude}`)
  })
}

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
    padding: 0px 8px 8px 8px; /* ← Top-padding satt til 0 */
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    margin: 0;
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
    img.src = (listing.imageUrls && listing.imageUrls[0]) || noImage
    img.alt = 'Listing image'
    img.onerror = () => { img.src = noImage }
    img.style.cssText = `
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 4px;
      max-height: 130px;
    `
    content.appendChild(img)

    const buttonContainer = document.createElement('div')
    const nextBtn = document.createElement('button')
    nextBtn.textContent = 'Next'
    nextBtn.style.cssText = `
      display: inline-block;
      margin-top: 8px;
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
    if (group.length > 1) {
      buttonContainer.appendChild(nextBtn)
    }

    const goToBtn = document.createElement('button')
    goToBtn.textContent = 'Go to listing'
    goToBtn.onclick = () => navigateToListing(listing)
    goToBtn.style.cssText = `
      display: inline-block;
      margin-top: 8px;
      margin-left: 0px;
      padding: 6px 10px;
      font-size: 0.9rem;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    `
    buttonContainer.appendChild(goToBtn)
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    `

    content.appendChild(buttonContainer)

    if (infoWindow.value) infoWindow.value.close()

    infoWindow.value = new window.google.maps.InfoWindow({
      content,
      maxWidth: 400
    })

    const mapObject = mapRef.value.$mapObject
    mapObject.panTo({ lat, lng })
    infoWindow.value.setPosition({ lat, lng })
    infoWindow.value.open(mapObject)

    infoWindow.value.open(mapObject)

    setTimeout(() => {
      const header = document.querySelector('.gm-style-iw-chr')
      if (header) {
        header.style.height = '20px'
        header.style.display = 'flex'
        header.style.alignItems = 'center'
        header.style.justifyContent = 'space-between'

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
