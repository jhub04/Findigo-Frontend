<template>
  <div class="search-results">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="listings.length === 0" class="no-results">No results</div>
    <div v-else>
      <div
        class="listing"
        v-for="listing in listings"
        :key="listing.id"
        @click="navigateToListing(listing)"
        style="cursor: pointer"
      >
        <p>{{ listing.briefDescription }}</p><br />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Displays search results based on URL query parameters (?q= and ?category=).
 * Fetches listings via API, applies local filtering, and handles error or empty states.
 */

import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { getAllListings } from '@/services/listingApi.ts'
import { getListingsByCategory } from '@/services/listingApi.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import type { ListingResponse } from '@/types/dto.ts'

const route = useRoute()

// Reactive state
const listings = ref<ListingResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/**
 * Fetches all listings from the backend.
 * TODO: Create a function that retrieves lsitings from backend based on category and query directly.
 */
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
      console.log('Filtered listings:', filtered)
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch listings'
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)
</script>

