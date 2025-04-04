<template>
  <div class="map-container">
    <GMapMap :center="center" :zoom="zoom" class="google-map" ref="mapRef"
      :options="mapOptions">
      <GMapMarker
        v-for="listing in uniqueListings"
        :key="`${listing.latitude}-${listing.longitude}`"
        :position="{ lat: listing.latitude, lng: listing.longitude }"
        @click="onMarkerClick(listing.latitude, listing.longitude)"
      />
    </GMapMap>
  </div>
  </template>

  <script setup lang="ts">
  /**
   * Displays a Google Map with interactive markers for listings.
   * Markers are filtered by category and query. Clicking a marker opens an info window.
   */

  import { ref, onMounted, computed, watch } from 'vue'
  import { getAllListings } from '@/services/listingApi'
  import { getAllCategories } from '@/services/categoryApi'
  import type { CategoryResponse, ListingResponse } from '@/types/dto'
  import { getListingsByCategory } from '@/services/listingApi'
  import noImage from '@/assets/no-image.jpg'
  import { navigateToListing } from '@/utils/navigationUtil.ts'
  import { useRoute, } from 'vue-router'

  const route = useRoute()

  const mapOptions = {
    mapTypeControl: false // ← fjerner "Kart / Satellitt"-knappen
  }

  const mapRef = ref<never>(null)
  const infoWindow = ref<never>(null)


  // Listings and category state
  const allListings = ref<ListingResponse[]>([])
  const categories = ref<CategoryResponse[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const results = ref<ListingResponse[]>([])

  const props = defineProps<{
    center: { lat: number; lng: number }
    zoom: number
  }>()


  /**
   * Group listings by lat/lng to avoid overlapping markers.
   */
  const listingsByPosition = computed(() => {
    const map = new Map<string, ListingResponse[]>()
    allListings.value.forEach(listing => {
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
   * Load categories and listings when the map component is mounted.
   */
  onMounted(async () => {
    categories.value = await getAllCategories()
    allListings.value = await getAllListings()
  })

  /**
   * Watch selectedCategory and refetch listings when it changes.
   */
  watch(
    () => route.query,
    async (query) => {
      try {
        console.log('query changed', query)
        loading.value = true
        error.value = null

        const q = typeof query.q === 'string' ? query.q : ''
        const c = query.category
        const pF = query.priceFrom ? Number(query.priceFrom) : null
        const pT = query.priceTo ? Number(query.priceTo) : null

        const category = !c || Array.isArray(c) || c === 'all' ? 'all' : Number(c)

        let results: ListingResponse[] = []
        if (category === 'all') {
          results = await getAllListings()
        } else {
          try {
            results = await getListingsByCategory(category)
          } catch (e) {
            results = []
          }
        }

        let filtered = q
          ? results.filter(l => l.briefDescription.toLowerCase().includes(q.toLowerCase()))
          : results

        if (pF != null && !isNaN(pF)) {
          filtered = filtered.filter(l => l.price >= pF)
        }
        if (pT != null && !isNaN(pT)) {
          filtered = filtered.filter(l => l.price <= pT)
        }
        if (pF !== null && pT !== null && !isNaN(pF) && !isNaN(pT)) {
          filtered = filtered.filter(l => l.price >= pF && l.price <= pT)
        }
        allListings.value = filtered
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch listings'
      } finally {
        loading.value = false
      }
    },
    { immediate: true }
  )


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

  .map-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; /* Hindrer scroll */
  }
  .map-container > div {
    width: 100%;
    height: 100%;
  }



  </style>
