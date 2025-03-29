<template>
  <GMapMap class="google-map" :center="center" :zoom="zoom">
    <GMapMarker
      v-for="listing in allListings"
      :key="listing.id"
      :position="{ lat: listing.latitude, lng: listing.longitude }"
    />
  </GMapMap>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllListings } from '@/services/listingApi.ts'
import type { ListingResponse } from '@/types/dto.ts'

const { center, zoom } = defineProps<{
  center: { lat: number; lng: number }
  zoom: number
}>()

const allListings = ref<ListingResponse[]>([])
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    allListings.value = await getAllListings()
    console.log(allListings.value)
  } catch (err: never) {
    error.value = err.message || 'Failed to load listings'
  }
})
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
