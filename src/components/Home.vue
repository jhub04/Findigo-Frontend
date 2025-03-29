<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCurrentUser } from '@/utils/useCurrentUser.ts';
import { getUserListings } from '@/services/listingApi.ts'; // juster path hvis den er annerledes
import { getAllCategories } from '@/services/categoryApi';
import type { CategoryResponse, ListingResponse } from '@/types/dto.ts';

const { user, isLoading, error } = useCurrentUser();

const listings = ref<ListingResponse[]>([]);
const categories = ref<CategoryResponse[]>([]);
const listingsLoading = ref(true);
const listingsError = ref<string | null>(null);

onMounted(async () => {
  try {
    listings.value = await getUserListings();
    console.log(listings.value);
    categories.value = await getAllCategories();
    console.log(categories.value);
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

        <div v-if="categories.length > 0" class="category-buttons">
          <h3>Select Category</h3>
          <div class="category-grid">
            <button v-for="category in categories" :key="category.id" class="category-button">
              {{ category.name }}
            </button>
          </div>
        </div>
        <div v-else>No categories exist</div>

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

.category-buttons {
  margin-top: 2rem;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;
}

.category-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.category-button:hover {
  background-color: #0056b3;
}
</style>