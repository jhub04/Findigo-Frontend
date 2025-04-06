<template>
  <div class="search-results">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="listings.length === 0" class="no-results">No results found.</div>

    <div class="grid-container">
      <ListingCard
        v-for="listing in listings"
        :key="listing.id"
        :listing="listing"
        :image-url="imageMap[listing.id] || ''"
      />
    </div>

    <div class="pagination-controls" v-if="totalPages > 1">
      <p>Page {{ pageNumber }} of {{ totalPages }}</p>
      <button @click="prevPage" :disabled="pageNumber === 1">Previous</button>
      <button @click="nextPage" :disabled="pageNumber === totalPages">Next</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { getFilteredListingsPage } from '@/services/listingApi.ts'
import ListingCard from '@/components/ListingCard.vue'
import type { ListingResponse } from '@/types/dto.ts'
import { useImages } from '@/composables/useImages'
import { useFavorites } from '@/composables/useFavorites'

const route = useRoute()
const listings = ref<ListingResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const pageNumber = ref(1)
const totalPages = ref(1)

const { firstImage, fetchFirstImageForListing } = useImages()
const { fetchFavorites } = useFavorites()

const imageMap = ref<Record<number, string>>({})
const fetchFirstImageForListings = async (listingList: ListingResponse[]) => {
  imageMap.value = {}
  await Promise.all(listingList.map(async (listing) => {
    await fetchFirstImageForListing(listing)
    imageMap.value[listing.id] = firstImage.value
  }))
}

const fetchFiltered = async () => {
  loading.value = true
  error.value = null

  try {
    const query = route.query
    const q = typeof query.q === 'string' ? query.q : null
    const c = query.category
    const pF = query.priceFrom ? Number(query.priceFrom) : null
    const pT = query.priceTo ? Number(query.priceTo) : null
    const dF = query.dateFrom ? String(query.dateFrom) : null

    const categoryId = !c || Array.isArray(c) || c === 'all' ? null : Number(c)

    const response = await getFilteredListingsPage({
      query: q,
      categoryId,
      fromPrice: pF,
      toPrice: pT,
      fromDate: dF
    }, pageNumber.value)

    listings.value = response.content
    totalPages.value = response.totalPages

    await fetchFavorites()
    await fetchFirstImageForListings(listings.value)

  } catch (err: any) {
    error.value = err.message || 'Could not fetch listings'
  } finally {
    loading.value = false
  }
}

const nextPage = async () => {
  if (pageNumber.value < totalPages.value) {
    pageNumber.value++
    await fetchFiltered()
  }
}

const prevPage = async () => {
  if (pageNumber.value > 1) {
    pageNumber.value--
    await fetchFiltered()
  }
}

watch(() => route.query, async () => {
  pageNumber.value = 1
  await fetchFiltered()
}, { immediate: true })
</script>

<style scoped>
.search-results {
  padding: 2rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.grid-container > * {
  margin: 0;
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
.pagination-controls {
  margin-top: 2rem;
  text-align: center;
}
.pagination-controls button {
  margin: 0 10px;
  padding: 0.5rem 1rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
