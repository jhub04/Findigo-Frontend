<template>
  <div class="sidebar">
    <FilterCategories/>
    <div class = "filter-price-date">
    <FilterPrice />
    <FilterDates />
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterCategories from '@/components/sidebarFilters/FilterCategories.vue'
import FilterPrice from '@/components/sidebarFilters/FilterPrice.vue'
import FilterDates from '@/components/sidebarFilters/FilterDates.vue'

</script>

<style scoped>

.sidebar {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  height: 100vh;
  width: auto;
}

.sidebar a {
  color: #2563eb;
  font-size: 0.95rem;
  margin: 0.4rem 0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.filter-price-date {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}
</style>
