<script setup lang="ts">
import { useCurrentUser } from '@/composables/useCurrentUser'
import { onMounted, ref } from 'vue'
import type { ListingResponse } from '@/types/dto.ts'
import noImage from '@/assets/no-image.jpg'
import { getMyListings } from '@/services/userApi.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import ListingCard from '../ListingCard.vue'

const { user, isLoading, error } = useCurrentUser()
const listings = ref<ListingResponse[]>([])
const loading = ref(true)

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = noImage
}

onMounted(async () => {
  try {
    listings.value = await getMyListings()
  } catch (e: any) {
    error.value = e.message || 'Failed to fetch listings'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <header class="userdetails">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-if="user">
        <h3>{{ user.username }}</h3>
        <!-- Implement when userDto is complete-->
        <p>User email</p>
      </div>
      <div v-else-if="error">
        <p>Error loading user data.</p>
      </div>
      <div v-else>
        <p>Unauthorized</p>
      </div>
    </div>
  </header>
  <main>
    <div class="mylistings-container">
      <h4>My Listings</h4>
      <div v-if="loading">Loading listings...</div>
      <div v-else-if="error">Error: {{ error }}</div>

      <div class="listing-grid">
        <ListingCard v-for="listing in listings" :key="listing.id" :listing="listing" />
      </div>

      <p v-if="listings.length === 0">You have no listings yet.</p>
    </div>
  </main>
</template>

<style scoped>
.mylistings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

h2 {
  margin-top: 1rem;
}

ul {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.75rem;
}

.mylistings-container h4 {
  margin-top: 2rem;
  font-size: 1.3rem;
}

.listing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  justify-items: center;
}
</style>
