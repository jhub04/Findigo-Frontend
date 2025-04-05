<template>
  <div class="search-results">
    <div v-if="loading" class="loading">Laster inn...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="listings.length === 0" class="no-results">Ingen resultater</div>
    <div class="grid-container">
      <ListingCard
        v-for="listing in listings"
        :key="listing.id"
        :listing="listing"
        :image-url="imageMap[listing.id] || noImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { getAllListings, getListingsByCategory } from '@/services/listingApi.ts'
import ListingCard from '@/components/search/ListingCard.vue'
import type { ListingResponse } from '@/types/dto.ts'
import { useImages } from '@/utils/useImages'
import noImage from '@/assets/no-image.jpg'

const { imageMap, fetchFirstImageForListings } = useImages()

onMounted(async () => {
  listings.value = await getAllListings()
  await fetchFirstImageForListings(listings.value)
})

const route = useRoute()
const listings = ref<ListingResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

watch(
  () => route.query,
  async (query) => {
    try {
      loading.value = true
      error.value = null

      const q = typeof query.q === 'string' ? query.q : ''
      const c = query.category
      const pF = query.priceFrom ? Number(query.priceFrom) : null
      const pT = query.priceTo ? Number(query.priceTo) : null

      const category = !c || Array.isArray(c) || c === 'all' ? 'all' : Number(c)
      const results = category === 'all'
        ? await getAllListings()
        : await getListingsByCategory(category)

      let filtered = q
        ? results.filter(l => l.briefDescription.toLowerCase().includes(q.toLowerCase()))
        : results

      if (pF !== null && pT !== null && !isNaN(pF) && !isNaN(pT)) {
        filtered = filtered.filter(l => l.price >= pF && l.price <= pT)
      }

      listings.value = filtered
    } catch (err: any) {
      error.value = err.message || 'Kunne ikke hente annonser'
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

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

/* Hvis bredde er under 768px */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Eksempel: Hvis du vil ha 1 kolonne på veldig smal skjerm (under 480px) */
@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
</style>
