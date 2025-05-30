<template>
  <div class="map-container">
    <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef" :options="mapOptions">
      <GMapMarker
        v-for="listing in uniqueListings"
        :key="`${listing.latitude}-${listing.longitude}`"
        :position="{ lat: listing.latitude, lng: listing.longitude }"
        data-testid="map-marker"
        @click="onMarkerClick(listing.latitude, listing.longitude)"
      />
    </GMapMap>
  </div>
  <div v-if="error" data-testid="error-box">{{ error }}</div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAllListings, getFilteredListings } from '@/services/listingApi'
import { getAllCategories } from '@/services/categoryApi'
import noImage from '@/assets/no-image.jpg'
import { navigateToListing } from '@/utils/navigationUtil'
import type { CategoryResponse, ListingResponse } from '@/types/dto'
import { useI18n } from 'vue-i18n'
import { useImages } from '@/composables/useImages'

const { firstImage, fetchFirstImageForListing } = useImages()

const { t } = useI18n()
const route = useRoute()
const mapOptions = { mapTypeControl: false }
const mapRef = ref<any>(null)
const infoWindow = ref<any>(null)

const allListings = ref<ListingResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const props = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

const listingsByPosition = computed(() => {
  const map = new Map<string, ListingResponse[]>()
  allListings.value.forEach(listing => {
    const key = `${listing.latitude},${listing.longitude}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push(listing)
  })
  return map
})

const uniqueListings = computed(() => {
  return Array.from(listingsByPosition.value.values()).map(group => group[0])
})

onMounted(async () => {
  categories.value = await getAllCategories()
  allListings.value = await getAllListings()
})

watch(
  () => route.query,
  async () => {
    try {
      loading.value = true
      error.value = null

      const q = typeof route.query.q === 'string' ? route.query.q : null
      const c = route.query.category
      const pF = route.query.priceFrom ? Number(route.query.priceFrom) : null
      const pT = route.query.priceTo ? Number(route.query.priceTo) : null
      const dF = route.query.dateFrom ? String(route.query.dateFrom) : null
      const categoryId = !c || Array.isArray(c) || c === 'all' ? null : Number(c)

      const response = await getFilteredListings({
        query: q,
        categoryId,
        fromPrice: pF,
        toPrice: pT,
        fromDate: dF
      })

      allListings.value = response
    } catch (err: any) {
      error.value = err.message || t('Failed to fetch listings')
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

function onMarkerClick(lat: number, lng: number) {
  const key = `${lat},${lng}`
  const group = listingsByPosition.value.get(key)
  if (!group || group.length === 0) return

  let index = 0

  const updateInfoWindow = async () => {
    const listing = group[index]
    const content = document.createElement('div')
    content.style.cssText = `
      width: 200px;
      background-color: #fff;
      padding: 0px 8px 8px 8px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `

    const title = document.createElement('h3')
    title.textContent = listing.briefDescription || t('No title')
    title.style.cssText = `
      font-size: 1.1rem;
      margin: 0;
      padding: 0;
      font-weight: 600;
      line-height: 1.2;
    `
    content.appendChild(title);

    const img = document.createElement('img');
    await fetchFirstImageForListing(listing);
    img.src = firstImage.value
    img.alt = t('Listing image')
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
      nextBtn.textContent = t('Next')
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
    goToBtn.textContent = t('Go to listing')
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
        titleEl.textContent = group[index].briefDescription || t('No title')
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

.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.map-container > div {
  width: 100%;
  height: 100%;
}
</style>
