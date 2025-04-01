<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { getAllListings} from '@/services/listingApi.ts'
import type { ListingResponse } from '@/types/dto.ts'
import { getListingsByCategory } from '@/services/categoryApi.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
const route = useRoute()

const searchQuery = computed(() => {
  const q = route.query.q
  return Array.isArray(q) ? q[0] : q || ''
})

const selectedCategory = computed(() => {
  const c = route.query.category
  console.log(Array.isArray(c) ? c[0] : c || 'all')
  return Array.isArray(c) ? c[0] : c || 'all'
})

function filterListingsByQuery(listings: ListingResponse[], query: string): ListingResponse[] {
  const lowerQuery = query.toLowerCase()
  return listings.filter(listing =>
    listing.briefDescription.toLowerCase().includes(lowerQuery)
  )
}

const listings = ref<ListingResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    if (searchQuery.value) {
      if (selectedCategory.value === 'all') {
        listings.value = await getAllListings()
        listings.value = filterListingsByQuery(listings.value, searchQuery.value)
        console.log(listings.value)
      } else {
        listings.value = await getListingsByCategory(selectedCategory.value)
        listings.value = filterListingsByQuery(listings.value, searchQuery.value)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load search results'
  } finally {
    loading.value = false
  }
})

watch([searchQuery, selectedCategory], async () => {
  try {
    loading.value = true
    if (searchQuery.value) {
      if (selectedCategory.value === 'all') {
        listings.value = await getAllListings()
        listings.value = filterListingsByQuery(listings.value, searchQuery.value)
      } else {
        listings.value = await getListingsByCategory(selectedCategory.value)
        listings.value = filterListingsByQuery(listings.value, searchQuery.value)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load search results'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="search-results">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="listings.length === 0" class="no-results">No results</div>
    <div v-else>
      <div class="listing"
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
