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
import { computed, onMounted, ref, watch } from 'vue'
import { getAllListings } from '@/services/listingApi.ts'
import { getListingsByCategory } from '@/services/categoryApi.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import type { ListingResponse } from '@/types/dto.ts'

const route = useRoute()

/**
 * Extracts the search query (?q=...) from the route.
 */
const searchQuery = computed(() => {
  const q = route.query.q
  return Array.isArray(q) ? q[0] : q || ''
})

/**
 * Extracts the selected category (?category=...) from the route.
 * Defaults to 'all' if not present.
 */
const selectedCategory = computed<"all" | number>(() => {
  const c = route.query.category
  if (Array.isArray(c)) return "all"
  if (c === undefined || c === null || c === "all") return "all"

  const num = Number(c)
  return isNaN(num) ? "all" : num
})


/**
 * Filters a list of listings based on a case-insensitive search in briefDescription.
 * @param listings Full list of listings
 * @param query Search string
 * @returns Listings that match the query
 */
function filterListingsByQuery(listings: ListingResponse[], query: string): ListingResponse[] {
  const lowerQuery = query.toLowerCase()
  return listings.filter(listing =>
    listing.briefDescription.toLowerCase().includes(lowerQuery)
  )
}

// Reactive state
const listings = ref<ListingResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

/**
 * Called on component mount to fetch and filter listings.
 */
onMounted(async () => {
  try {
    loading.value = true
    if (searchQuery.value) {
      listings.value = selectedCategory.value === 'all'
        ? await getAllListings()
        : await getListingsByCategory(selectedCategory.value)

      listings.value = filterListingsByQuery(listings.value, searchQuery.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load search results'
  } finally {
    loading.value = false
  }
})

/**
 * Watches for changes in query or category and refetches data.
 */
watch([searchQuery, selectedCategory], async () => {
  try {
    loading.value = true
    if (searchQuery.value) {
      listings.value = selectedCategory.value === 'all'
        ? await getAllListings()
        : await getListingsByCategory(selectedCategory.value)

      listings.value = filterListingsByQuery(listings.value, searchQuery.value)
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load search results'
  } finally {
    loading.value = false
  }
})
</script>

