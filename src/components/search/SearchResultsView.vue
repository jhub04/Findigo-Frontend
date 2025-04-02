<template>
  <div class='temporary'>
    <FilterSideBar v-model:selectedCategory="selectedCategory" v-model:searchQuery="searchQuery" />
    <SearchListings :selectedCategory="selectedCategory" :searchQuery="searchQuery" />
  </div>

</template>

<script setup lang="ts">
import {ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FilterSideBar from '@/components/search/FilterSideBar.vue'
import SearchListings from '@/components/search/SearchListings.vue'

const route = useRoute()
const selectedCategory = ref<number | 'all'>('all')
const searchQuery = ref('')

watch(
  () => route.query,
  (query) => {
    const c = query.category
    if (!c || Array.isArray(c) || c === 'all') {
      selectedCategory.value = 'all'
    } else {
      const n = Number(c)
      selectedCategory.value = isNaN(n) ? 'all' : n
    }

    const q = query.q
    searchQuery.value = typeof q === 'string' ? q : ''
  },
  { immediate: true }
)


</script>

<style scoped>
.temporary {
  display: flex;
  flex-direction: row;
  gap: 200px;
}
</style>


