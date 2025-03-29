<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserListings } from '@/services/listingApi.ts';
import type { ListingResponse } from '@/types/dto.ts';

const listings = ref<ListingResponse[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    listings.value = await getUserListings();
  } catch (e: any) {
    error.value = e.message || 'Failed to fetch listings';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="mylistings-container">
    <h4>My Listings</h4>
    <div v-if="loading">Loading listings...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else-if="listings.length">
      <li v-for="listing in listings" :key="listing.id">
        <strong>{{ listing.briefDescription }}</strong><br />
        {{ listing.fullDescription }}
      </li>
    </ul>
    <p v-else>You have no listings yet.</p>
  </div>
</template>

<style scoped>
.mylistings-container {
  margin-top: 20px;
}
li {
  margin-bottom: 1rem;
}
</style>
