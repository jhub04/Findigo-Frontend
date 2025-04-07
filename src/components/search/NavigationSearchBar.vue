<template>
  <div class="nav-search">
    <!-- Hidden element used to calculate dynamic width for the dropdown -->
    <span ref="categoryWidthRef" class="invisible-text">
      {{
        selectedCategory === 'all'
          ? $t('All')
          : categories.find(cat => cat.id === selectedCategory)?.name || ''
      }}
    </span>

    <!-- Main search form -->
    <form class="search-form" @submit.prevent="performSearch">
      <!-- Dropdown category selector -->
      <select ref="selectRef" v-model="selectedCategory" class="search-category">
        <option :value="'all'">{{ $t('All') }}</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <!-- Text input for query -->
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('Search')"
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
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCategories } from '@/services/categoryApi'
import type { CategoryResponse } from '@/types/dto.ts'
import { useSelectedCategory } from '@/composables/useSelectedCategory'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const categoryWidthRef = ref<HTMLElement | null>(null)
const selectRef = ref<HTMLElement | null>(null)

const router = useRouter()

const searchQuery = ref('')

const categories = ref<CategoryResponse[]>([])
const { selectedCategory } = useSelectedCategory()

function updateSelectWidth() {
  if (categoryWidthRef.value && selectRef.value) {
    const width = categoryWidthRef.value.offsetWidth + 40 
    selectRef.value.style.width = `${width}px`
  }
}

onMounted(async () => {
  try {
    const fetched = await getAllCategories()
    categories.value = fetched
  } catch (err) {
    console.error('Failed to load categories', err)
  } finally {
    // Resize dropdown to fit content text after next tick
    await nextTick(updateSelectWidth)
  }
})

// Recalculate select width whenever the selected category changes
watch(selectedCategory, () => nextTick(updateSelectWidth))

// Perform search when form is submitted
function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'SearchResultsView',
      query: {
        q: searchQuery.value.trim(),
        category: selectedCategory.value,
      },
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
  background-color: #BFDBF7;
  margin: 0;
  padding: 0 20px;
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
