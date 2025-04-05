<template>
  <div class="nav-search">
    <!-- Hidden element used to calculate dynamic width for the dropdown -->
    <span ref="categoryWidthRef" class="invisible-text">
      {{
        selectedCategory === 'all'
          ? 'All'
          : categories.find(cat => cat.id === selectedCategory)?.name || ''
      }}
    </span>

    <!-- Main search form -->
    <form class="search-form" @submit.prevent="performSearch">

      <!-- Dropdown category selector -->
      <select
        ref="selectRef"
        v-model="selectedCategory"
        class="search-category"
      >
        <option :value="'all'">All</option>
        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>

      <!-- Text input for query -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        name="findigo-search"
        autocomplete="off"
      />

      <!-- Button triggers performSearch() on click -->
      <button type="submit">
        <i class="fa fa-search"></i>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { getAllCategories } from '@/services/categoryApi.ts'
import type { CategoryResponse } from '@/types/dto.ts'

// Used to calculate the width of the category <select> to avoid layout shift
const categoryWidthRef = ref<HTMLElement | null>(null)
const selectRef = ref<HTMLElement | null>(null)

// Programmatic navigation
const router = useRouter()

// Search input state
const searchQuery = ref('')

// All fetched categories shown in dropdown
const categories = ref<CategoryResponse[]>([])

// ID of selected category; 'all' means no filter
const selectedCategory = ref<number | 'all'>('all')

// Dynamically resize the select to match label width (for better UI alignment)
function updateSelectWidth() {
  if (categoryWidthRef.value && selectRef.value) {
    const width = categoryWidthRef.value.offsetWidth + 40 // + buffer for padding
    selectRef.value.style.width = `${width}px`
  }
}

// Fetch category list on mount and resize select accordingly
onMounted(async () => {
  try {
    const fetched = await getAllCategories()
    categories.value = fetched
  } catch (err) {
    console.error('Failed to load categories', err)
  } finally {
    // Resize dropdown to fit content text
    await nextTick(updateSelectWidth)
  }
})

// Recalculate select width whenever a new category is selected
watch(selectedCategory, () => nextTick(updateSelectWidth))

// Called when user submits the form (Enter or button)
// Navigates to SearchResultsView, passing query and category as URL params
function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'SearchResultsView',
      query: {
        q: searchQuery.value.trim(),
        category: selectedCategory.value
      }
    })
  }
}
</script>

<style scoped>
.search-form {
  display: flex;
  width: 100%;
  max-width: 650px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background: #f1f1f1;
}

.search-category {
  border: none;
  padding: 10px 10px 10px 20px;
  background: #e6e6e6;
  font-size: 16px;
  border-right: 1px solid #ccc;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-form input[type="text"] {
  flex: 1;
  padding: 10px;
  font-size: 17px;
  border: none;
  background: #f1f1f1;
  outline: none;
}

.nav-search {
  width: 100%;
}

.search-form button {
  padding: 0 20px;
  background: #2196f3;
  color: white;
  font-size: 17px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

.search-form button:hover {
  background: #0b7dda;
}

.invisible-text {
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  font-size: 16px;
  padding: 10px 10px 10px 20px;
}
</style>
