<template>
  <div>
    <FilterCategories/>
    <FilterPrice />
    <FilterDates />

  </div>
</template>

<script setup lang="ts">
import FilterCategories from '@/components/search/sidebar/FilterCategories.vue'
import FilterPrice from '@/components/search/sidebar/FilterPrice.vue'
import FilterDates from '@/components/search/sidebar/FilterDates.vue'

</script>

<style scoped>

</style>
