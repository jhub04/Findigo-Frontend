<template>
  <div class="homepage-container">
    <div v-if="isLoading">{{ $t('Loading user...') }}</div>
    <div v-else>
      <div v-if="user">
        <h2>{{ $t('Welcome') }} {{ userStore.currentUser?.username }}</h2>
        <p v-if="user.roles.includes('ROLE_ADMIN')">You have admin claim</p>
      </div>

      <!-- Category Buttons -->
      <div v-if="categories.length > 0" class="category-buttons">
        <div class="button-grid">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-button"
            @click="handleCategoryClick(category.id)"
            :class="{ selected: selectedCategory === category.id }"
            :aria-pressed="selectedCategory === category.id"
            :title="
              selectedCategory === category.id
                ? $t('Click to clear filter')
                : $t('Filter by') + ' ' + category.name
            "
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Listings Section -->
      <div>
        <div v-if="listingsLoading">{{ $t('Loading listings...') }}</div>
        <div v-else-if="listingsError">{{ $t('Error:') }} {{ listingsError }}</div>
        <div
          v-else-if="
            (selectedCategory && categoryListings?.length === 0) ||
            (!selectedCategory && listings.length === 0)
          "
        >
          {{ $t('No listings found') }}
        </div>

        <div class="listing-grid">
          <ListingCard
            v-for="listing in selectedCategory ? categoryListings : listings"
            :key="listing.id"
            :listing="listing"
            class="listing-card"
          />
        </div>

        <p v-if="listings.length === 0">{{ $t('You have no listings yet.') }}</p>
      </div>

    <div v-if="selectedCategory && categoryTotalPages > 1" class="pagination-controls">
      <p>
        {{ $t('Current Page:') }} {{ categoryPage }}, {{ $t('Total pages:') }} {{ categoryTotalPages }}
      </p>
      <button @click="prevCategoryPage" :disabled="categoryPage === 1">{{ $t('Previous') }}</button>
      <button @click="nextCategoryPage" :disabled="categoryPage === categoryTotalPages">{{ $t('Next') }}</button>
    </div>

    <div v-else-if="!selectedCategory && totalPages > 1" class="pagination-controls">
      <p>
        {{ $t('Current Page:') }} {{ pageNumber }}, {{ $t('Total pages:') }} {{ totalPages }}
      </p>
      <button @click="prevPage" :disabled="pageNumber === 1">{{ $t('Previous') }}</button>
      <button @click="nextPage" :disabled="pageNumber === totalPages">{{ $t('Next') }}</button>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { getAllCategories } from '@/services/categoryApi'
import {
  getListingsByCategoryPaginated,
  getPublicListingsPage,
  getRecommendedListingsPage
} from '@/services/listingApi.ts'
import { useFavorites } from '@/composables/useFavorites'
import type { CategoryResponse, ListingResponse } from '@/types/dto.ts'
import ListingCard from '@/components/ListingCard.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { user, isLoading } = useCurrentUser()

const listings = ref<ListingResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const selectedCategory = ref<number | null>(null)
const categoryListings = ref<ListingResponse[] | null>(null)
const listingsLoading = ref(true)
const listingsError = ref<string | null>(null)
const pageNumber = ref(1)
const totalPages = ref<number>(1)
const categoryPage = ref(1)
const categoryTotalPages = ref(1)
const { fetchFavorites } = useFavorites()

const fetchListings = async () => {
  listingsLoading.value = true
  listingsError.value = null

  try {
    const listingsPage = userStore.currentUser
      ? await getRecommendedListingsPage(pageNumber.value)
      : await getPublicListingsPage(pageNumber.value)

    listings.value = listingsPage.content
    totalPages.value = listingsPage.totalPages
  } catch (err: any) {
    listingsError.value = err.message || t('Failed to load listings')
  } finally {
    listingsLoading.value = false
  }
}

const loadCategoryListings = async () => {
  if (!selectedCategory.value) return
  listingsLoading.value = true
  listingsError.value = null

  try {
    const page = await getListingsByCategoryPaginated(selectedCategory.value, categoryPage.value)
    categoryListings.value = page.content
    categoryTotalPages.value = page.totalPages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err: any) {
    listingsError.value = err.message || t('Failed to load listings by category')
    categoryListings.value = []
  } finally {
    listingsLoading.value = false
  }
}
async function nextCategoryPage() {
  if (categoryPage.value < categoryTotalPages.value) {
    categoryPage.value++
    await loadCategoryListings()
  }
}

async function prevCategoryPage() {
  if (categoryPage.value > 1) {
    categoryPage.value--
    await loadCategoryListings()
  }
}

async function nextPage() {
  if (pageNumber.value < totalPages.value) {
    console.log('Getting page ' + (pageNumber.value + 1))
    pageNumber.value++
    await fetchListings()
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

async function prevPage() {
  if (pageNumber.value > 1) {
    console.log('Getting page ' + (pageNumber.value - 1))
    pageNumber.value--
    await fetchListings()
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const handleCategoryClick = async (categoryId: number) => {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null
    categoryListings.value = null
    return
  }

  selectedCategory.value = categoryId
  categoryPage.value = 1
  await loadCategoryListings()
}

onMounted(async () => {
  await fetchListings()
  await fetchFavorites()
  categories.value = await getAllCategories()
})

// Hvis bruker logger inn etter å ha åpnet siden, vil den reacte:
watch(user, async () => {
  pageNumber.value = 1
  await fetchListings()
})
</script>

<style scoped>
.homepage-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

/*
   listing-grid:
   - 3 kolonner fra 992px og opp
   - 2 kolonner under 992px (aldri 1 kolonne)
*/
.listing-grid {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

/* Fra 992px og opp: 3 kolonner. Sentrer ved å gi maks bredde. */
@media (min-width: 992px) {
  .listing-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 900px;  /* juster til ønsket bredde per kolonne */
    margin: 0 auto;
  }
}

/* Under 992px: 2 kolonner uansett hvor smalt. */
@media (max-width: 991px) {
  .listing-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 650px; /* litt mindre totalbredde, men du kan justere */
    margin: 0 auto;
  }
}

/* Eventuelt kan du la .listing-card ha en minbredde
   om du er redd for at de blir *for* smale.
   .listing-card { min-width: 220px; }
   men da vil gridet muligens få scrollbar i stedet.
*/

/* Kategori-knapper, paginering, etc. */
.category-buttons {
  margin-top: 2rem;
}
.button-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 1rem;
}

.category-button {
  border: none;
  outline: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: #f4f4f4;
  color: #022b3a;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
}

.category-button:hover {
  background-color: #022b3a;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.category-button.selected {
  background-color: #022b3a;
  color: white;
  font-weight: bold;
  box-shadow: inset 0 0 0 2px white;
}

.paginationControls {
  margin-top: 2rem;
}

.pagination-controls {
    margin-top: 2rem;
    text-align: center;
  }
  .pagination-controls button {
    margin: 0 10px;
    padding: 0.5rem 1rem;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

</style>
