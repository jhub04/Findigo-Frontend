<script setup lang="ts">
import { useRouter } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { getAllCategories } from '@/services/categoryApi.ts'

const categoryWidthRef = ref<HTMLElement | null>(null)
const selectRef = ref<HTMLElement | null>(null)

const router = useRouter()

const searchQuery = ref('')

const categories = ref<CategoryResponse[]>([])
const selectedCategory = ref<number | 'all'>('all')

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
    await nextTick(updateSelectWidth)
  }
})

watch(selectedCategory, () => nextTick(updateSelectWidth))
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

<template>
  <div class = "nav-search">
  <span ref="categoryWidthRef" class="invisible-text">
    {{
      selectedCategory === 'all'
        ? 'All'
        : categories.find(cat => cat.id === selectedCategory)?.name || ''
    }}
  </span>

  <form class="search-form" @submit.prevent="performSearch">
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

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      name="findigo-search"
      autocomplete="off"
    />

    <button type="submit">
      <i class="fa fa-search"></i>
    </button>
  </form>
  </div>
</template>

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
  font-family: inherit;
}
</style>
