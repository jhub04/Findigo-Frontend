<script setup lang="ts">
import type { ListingResponse } from '@/types/dto'
import { onMounted, ref } from 'vue'
import { getFavorites } from '@/services/userApi'
import { useCurrentUser } from '@/composables/useCurrentUser'
import ListingCard from '../ListingCard.vue'

const favorites = ref<ListingResponse[]>([])
const { user, isLoading, error } = useCurrentUser()
const loading = ref(true)

onMounted(async () => {
  try {
    favorites.value = await getFavorites()
  } catch (error: any) {
    error.value = error.message || 'Failed to fetch favorites'
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
      <h4>My Favorites</h4>
      <div v-if="loading">Loading listings...</div>
      <div v-else-if="error">Error: {{ error }}</div>

      <div class="listing-grid">
        <ListingCard
              v-for="listing in favorites"
              :key="listing.id"
              :listing="listing"
            />
      </div>

      <p v-if="favorites.length === 0">You have no listings yet.</p>
    </div>
  </main>
</template>
