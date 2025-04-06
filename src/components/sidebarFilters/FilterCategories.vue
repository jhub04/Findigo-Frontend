<template>
  <div class="filter-container">
    <div class="categories">
      <h3>Categories</h3>
      <ul class="list-none p-0">
        <li class="category-options">
          <a
            href="#"
            @click.prevent="selectCategory('all')"
            :class="['category-link', selectedCategory === 'all' ? 'selected-category' : '']"
          >
            All
          </a>
        </li>
        <li
          v-for="category in categories"
          :key="category.id"
          class="category-options"
        >
          <a
            href="#"
            @click.prevent="selectCategory(category.id)"
            :class="[
              'category-link',
              selectedCategory === category.id ? 'selected-category' : ''
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
import { computed, onMounted, ref, watch } from 'vue'
import {getAllCategories} from '@/services/categoryApi.ts'
import type { CategoryResponse } from '@/types/dto.ts'
import router from '@/router'
import { useRoute } from 'vue-router'

const categories = ref<CategoryResponse[]>([])

import { useSelectedCategory } from '@/composables/useSelectedCategory'
const { selectedCategory, updateCategory } = useSelectedCategory()

const selectCategory = updateCategory

onMounted(async () => {
  try {
    categories.value = await getAllCategories()
  } catch (err: any) {
    console.error(err)
  }
})

</script>

<style scoped>

.category-options {
  margin-bottom: 0.7rem;
  padding: 1px 1px 1px 1px;
  list-style: none;
  margin-left: -25px;
}
.category-options a {
  text-decoration: none;
}

.category-link {
  text-decoration: none;
  color: #007bff;      /* blue text */
  padding: 4px 8px;    /* add padding to show the background */
  border-radius: 4px;
  transition: background-color 0.2s, font-weight 0.2s;
}

.category-link:hover {
  font-weight: bold;
}

.selected-category {
  background-color: #ebf8ff;  /* faint blue background */
  font-weight: bold;
}

.categories h3 {
  font-size: 1.03rem; /* Adjust the value as needed */
}



</style>
