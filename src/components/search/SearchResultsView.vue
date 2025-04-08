<template>
  <div class='temporary'>
    <FilterSideBar :navbarHeight="navbarHeight" />
    <SearchListings/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FilterSideBar from '@/components/search/SearchSideBar.vue'
import SearchListings from '@/components/search/SearchResults.vue'

const navbarHeight = ref(0)

onMounted(() => {
  const el = document.getElementById('main-navbar')
  if (el) {
    navbarHeight.value = el.offsetHeight
  }
})
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


