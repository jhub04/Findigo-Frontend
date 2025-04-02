<template>
  <div class='temporary'>
    <FilterSideBar v-model:selectedCategory="selectedCategory" v-model:searchQuery="searchQuery" />
    <SearchListings :selectedCategory="selectedCategory" :searchQuery="searchQuery" />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'

import FilterSideBar from '@/components/search/FilterSideBar.vue'
import SearchListings from '@/components/search/SearchListings.vue'


const selectedCategory = ref<number | 'all'>('all')
const searchQuery = ref('')


</script>

<style scoped>
.temporary {
  display: flex;
  flex-direction: row;
  gap: 500px;
}
</style>


