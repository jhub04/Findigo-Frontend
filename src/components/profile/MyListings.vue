<script setup lang="ts">
import { useCurrentUser } from '@/utils/useCurrentUser.ts'
import { onMounted, ref } from 'vue'
import { getUserListings } from '@/services/listingApi.ts'
import type { ListingResponse } from '@/types/dto.ts'

const { user, isLoading, error } = useCurrentUser()
const listings = ref<ListingResponse[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    listings.value = await getUserListings()
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
      <ul v-else-if="listings.length">
        <li v-for="listing in listings" :key="listing.id">
          <strong>{{ listing.briefDescription }}</strong
          ><br />
          {{ listing.fullDescription }}
        </li>
      </ul>
      <p v-else>You have no listings yet.</p>
    </div>
  </main>
</template>

<style scoped>
.mylistings-container {
  margin-top: 20px;
}
li {
  margin-bottom: 1rem;
}
</style>
