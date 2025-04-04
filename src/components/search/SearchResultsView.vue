<template>
  <div class='temporary'>
    <FilterSideBar/>
    <SearchListings/>
  </div>
</template>

<script setup lang="ts">
import FilterSideBar from '@/components/search/SearchSideBar.vue'
import SearchListings from '@/components/search/SearchListings.vue'
</script>

<style scoped>
.temporary {
  display: flex;
  flex-direction: row;
  gap: 200px;
}
</style>


