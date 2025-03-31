<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCurrentUser } from '@/utils/useCurrentUser.ts'
import { getAllListings } from '@/services/listingApi.ts' // juster path hvis den er annerledes
import { getAllCategories, getListingsByCategory } from '@/services/categoryApi'
import type { CategoryResponse, ListingResponse } from '@/types/dto.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'

const { user, isLoading, error } = useCurrentUser()

const listings = ref<ListingResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const selectedCategory = ref<number | null>(null)
const categoryListings = ref<ListingResponse[] | null>(null)
const listingsLoading = ref(true)
const listingsError = ref<string | null>(null)

const handleCategoryClick = async (categoryId: number) => {
  selectedCategory.value = categoryId
  listingsLoading.value = true
  listingsError.value = null

  try {
    categoryListings.value = await getListingsByCategory(categoryId)
  } catch (err: any) {
    listingsError.value = err.message || 'Failed to load listings by category'
    categoryListings.value = null
  } finally {
    listingsLoading.value = false
  }
}

onMounted(async () => {
  try {
    listings.value = await getAllListings()
    console.log(listings.value)
    categories.value = await getAllCategories()
    console.log(categories.value)
  } catch (err: any) {
    listingsError.value = err.message || 'Failed to load listings'
  } finally {
    listingsLoading.value = false
  }
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading user...</div>

    <div v-else>
      <div v-if="user">
        <h2>Welcome, {{ user.username }}</h2>

        <!-- Category Buttons -->
        <div v-if="categories.length > 0" class="category-buttons">
          <h3>Categories</h3>
          <div class="button-grid">
            <button
              v-for="category in categories"
              :key="category.id"
              class="category-button"
              @click="handleCategoryClick(category.id)"
              :class="{ selected: selectedCategory === category.id }"
            >
              {{ category.name }}
            </button>
            <!-- Optional "All Categories" button -->
            <button
              v-if="selectedCategory !== null"
              class="category-button"
              @click="selectedCategory = null"
            >
              Show All
            </button>
          </div>
        </div>

        <!-- Listings Section -->
        <div>
          <h3>
            {{ selectedCategory ? 'Listings in Selected Category' : 'All Listings' }}
          </h3>

          <div v-if="listingsLoading">Loading listings...</div>
          <div v-else-if="listingsError">Error: {{ listingsError }}</div>
          <div
            v-else-if="
              (selectedCategory && categoryListings?.length === 0) ||
              (!selectedCategory && listings.length === 0)
            "
          >
            No listings found.
          </div>
          <ul v-else>
            <li
              v-for="listing in selectedCategory ? categoryListings : listings"
              :key="listing.id"
              @click="navigateToListing(listing)"
              style="cursor: pointer"
            >
              <strong>{{ listing.briefDescription }}</strong><br />
              {{ listing.fullDescription }} <br /> <br />
              Eier: {{listing.user.username}}
            </li>
          </ul>
        </div>
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

.category-button.selected {
  background-color: #0056b3;
}
</style>
