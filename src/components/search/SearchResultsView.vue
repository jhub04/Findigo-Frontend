<template>
  <div class='temporary'>
    <FilterSideBar navbar-height=""/>
    <SearchListings/>
  </div>
</template>

<script setup lang="ts">
import FilterSideBar from '@/components/search/SearchSideBar.vue'
import SearchListings from '@/components/search/SearchResults.vue'
</script>

<style scoped>
.temporary {
  display: flex;
  flex-direction: row;
  gap: 1px;
}

@media (max-width: 768px) {
  .temporary {
    flex-direction: column;
  }
}
</style>


