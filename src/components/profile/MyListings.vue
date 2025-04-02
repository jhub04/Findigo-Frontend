<script setup lang="ts">
import { useCurrentUser } from '@/utils/useCurrentUser.ts'
import { onMounted, ref } from 'vue'
import { getUserListings } from '@/services/listingApi.ts'
import type { ListingResponse } from '@/types/dto.ts'
import noImage from '@/assets/no-image.jpg'
import { getMyListings } from '@/services/userApi.ts'

const { user, isLoading, error } = useCurrentUser()
const listings = ref<ListingResponse[]>([])
const loading = ref(true)

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = noImage;
};

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
        <div v-for="listing in listings" :key="listing.id" class="listing-card">
          <div class="image-wrapper">
            <img :src="listing.imageUrls[0] || noImage"  @error="handleImageError" alt="Listing image" class="listing-image" />
            <!-- Add price overlay-->
          </div>
          <div class="listing-info">
            <h5>{{ listing.briefDescription }}</h5>
          </div>
        </div>
      </div>

      <p v-if="listings.length === 0">You have no listings yet.</p>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}
.mylistings-container {
  margin-top: 20px;
}
li {
  margin-bottom: 1rem;
}
</style>
