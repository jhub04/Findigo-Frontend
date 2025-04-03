<template>
  <div class="filter-container">
    <div class="categories">
      <h3>Categories</h3>
      <ul class="list-none p-0">
        <li
          v-for="category in categories"
          :key="category.id"
          class="category-options"
        >
          <a
            href="#"
            @click.prevent="selectCategory(category.id)"
            :class="[
              'no-underline text-blue-600 hover-font-semibold',
              selectedCategory === category.id ? 'font-semibold' : ''
            ]"
          >
            {{ category.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {getAllCategories} from '@/services/categoryApi.ts'
import type { CategoryResponse } from '@/types/dto.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

const categories = ref<CategoryResponse[]>([])
const route = useRoute()

const selectedCategory = computed<"all" | number>(() => {
  const c = route.query.category
  if (!c || Array.isArray(c) || c === 'all') return 'all'
  const n = Number(c)
  return isNaN(n) ? 'all' : n
})

const selectCategory = (categoryId: number) => {
  const currentQuery = { ...route.query }
  currentQuery.category =
    selectedCategory.value === categoryId ? 'all' : String(categoryId)

  router.push({ query: currentQuery })
}


onMounted(async () => {
  try {
    categories.value = await getAllCategories()
  } catch (err: any) {
    console.error(err)
  }
})

</script>

<style scoped>
.categories {
  margin-left: 1.5rem;
}


.category-options {
  margin-bottom: 0.5rem;
  padding: 1px 1px 1px 1px;
  list-style: none;
}
.category-options a {
  text-decoration: none;
}

</style>
