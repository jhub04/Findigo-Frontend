<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCurrentUser } from '@/utils/useCurrentUser.ts';
import { getUserListings } from '@/services/listingApi.ts'; // juster path hvis den er annerledes
import type { ListingResponse } from '@/types/dto.ts';

const { user, isLoading, error } = useCurrentUser();

const listings = ref<ListingResponse[]>([]);
const listingsLoading = ref(true);
const listingsError = ref<string | null>(null);

onMounted(async () => {
  try {
    listings.value = await getUserListings();
    console.log(listings.value);
  } catch (err: any) {
    listingsError.value = err.message || 'Failed to load listings';
  } finally {
    listingsLoading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="isLoading">Loading user...</div>

    <div v-else>
      <div v-if="user">
        <h2>Welcome, {{ user.username }}</h2>

        <div v-if="listingsLoading">Loading listings...</div>
        <div v-else-if="listingsError">Error: {{ listingsError }}</div>
        <div v-else-if="listings.length === 0">You have no listings yet.</div>
        <ul v-else>
          <li v-for="listing in listings" :key="listing.id">
            <strong>{{ listing.briefDescription }}</strong><br />
            {{ listing.fullDescription }}
          </li>
        </ul>
      </div>

      <div v-else>
        <h2 v-if="error">Error loading user</h2>
        <h2 v-else>Unauthorized!</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>