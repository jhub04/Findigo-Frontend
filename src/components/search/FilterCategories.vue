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
import {useRoute, useRouter} from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import {getAllCategories} from '@/services/categoryApi.ts'
import type { CategoryResponse, ListingResponse } from '@/types/dto.ts'

const categories = ref<CategoryResponse[]>([])
const route = useRoute()
const router = useRouter()

const props = defineProps<{
  selectedCategory: number | 'all'
  searchQuery: string
}>()

const selectCategory = (categoryId: number) => {
  const currentQuery = { ...route.query }

  if (props.selectedCategory === categoryId) {
    currentQuery.category = 'all'
  } else {
    currentQuery.category = categoryId
  }

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
