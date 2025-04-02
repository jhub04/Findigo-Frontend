<script setup lang="ts">
import FilterCategory from '@/components/search/FilterCategory.vue'
import SearchResults from '@/components/search/SearchListings.vue'
</script>

<template>
  <div class='temporary'>
    <FilterCategory />
    <SearchResults />
  </div>

</template>

<style scoped>
.temporary {
  display: flex;
  flex-direction: row;
  gap: 100px;
}
</style>


