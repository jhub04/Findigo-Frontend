<template>
  <div class="sidebar">
      <SearchBox @search="onSearch" />
    <div class = filters-container>
      <FilterCategories/>
      <div class = "filter-price-and-dates">
      <FilterPrice />
      <FilterDates />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Sidebar component for filtering listings.
 * Provides a search box and category buttons.
 * Emits selected search query and category to parent view.
 */

import { ref, defineEmits, onMounted } from 'vue'
import { getAllCategories } from '@/services/categoryApi.ts'
import SearchBox from '@/components/map/MapSearchBar.vue'
import FilterSideBar  from '@/components/search/SearchSideBar.vue'
import FilterCategories from '@/components/sidebarFilters/FilterCategories.vue'
import FilterPrice from '@/components/sidebarFilters/FilterPrice.vue'
import FilterDates from '@/components/sidebarFilters/FilterDates.vue'
/**
 * Emits events to parent component:
 * - 'updateCategory': when a new category is selected
 * - 'search': when a query is entered into the search box
 */
const emit = defineEmits(['updateCategory', 'search'])

/**
 * Emits search query to parent when triggered by SearchBox.
 * @param query The search input from the user
 */
const onSearch = (query: string) => {
  emit('search', query)
}

/**
 * Holds the currently selected category.
 * Used for active button highlighting and emitting state to parent.
 */
const selectedCategory = ref<number | 'All'>('All')

/**
 * Called when a category button is clicked.
 * Updates local selectedCategory and emits to parent.
 * @param cat The category ID or 'All'
 */
const selectCategory = (cat: number | 'All') => {
  selectedCategory.value = cat
  emit('updateCategory', cat)
}

/**
 * Reactive list of categories fetched from API.
 * Used to dynamically render category filter buttons.
 */
const categories = ref<any[]>([])

/**
 * Fetch all categories on component mount.
 */
onMounted(async () => {
  categories.value = await getAllCategories()
})
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 0rem;
  z-index: 1000;
  background: white;
  border-radius: 0 10px 10px 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: auto;
  height: auto;
  border: 2.5px solid #ccc;
}

.filters-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-price-and-dates {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


.filters button {
  display: inline-block;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 2px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
}

.filters button:hover {
  background-color: #0056b3;
}

.filters button.active {
  background-color: #007bff;
  color: white;
}
</style>
