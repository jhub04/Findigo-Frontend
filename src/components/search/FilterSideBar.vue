<template>
  <div>
    <FilterCategories
      :selectedCategory="selectedCategory"
      :searchQuery="searchQuery"
      @update:selectedCategory="($event) => emit('update:selectedCategory', $event)"
      @update:searchQuery="($event) => emit('update:searchQuery', $event)"
    />

  </div>
</template>

<script setup lang="ts">
import FilterCategories from '@/components/search/FilterCategories.vue'

const props = defineProps<{
  selectedCategory: number | 'all'
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value: number | 'all'): void
  (e: 'update:searchQuery', value: string): void
}>()

</script>

<style scoped>

</style>
