<template>
  <div>
    <button
      class="filter-toggle"
      @click="toggleSidebar"
      v-if="isMobile && !showSidebar"
      aria-label="Open filters"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
        <path d="M3 5h18v3H3V5zm4 7h10v3H7v-3zm4 7h2v3h-2v-3z"/>
      </svg>
    </button>

    <div
      class="sidebar"
      :class="{ open: showSidebar, mobile: isMobile }"
    >
      <SearchBox @search="onSearch" />
      <div class="filters-container">
        <FilterCategories />
        <div class="filter-price-and-dates">
          <FilterPrice />
          <FilterDates />
        </div>
        <button v-if="isMobile" class="close-btn" @click="toggleSidebar">Close Filters</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBox from '@/components/map/MapSearchBar.vue'
import FilterCategories from '@/components/sidebarFilters/FilterCategories.vue'
import FilterPrice from '@/components/sidebarFilters/FilterPrice.vue'
import FilterDates from '@/components/sidebarFilters/FilterDates.vue'

defineProps<{ navbarHeight: number }>()

const emit = defineEmits(['updateCategory', 'search'])
const onSearch = (query: string) => emit('search', query)

const showSidebar = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}


onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style scoped>
.sidebar {
  position: absolute;
  left: 0;
  z-index: 1000;
  background: white;
  border-radius: 0 10px 10px 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 20vw;
  min-width: 240px;
  max-width: 320px;
  transition: transform 0.3s ease;
}

.sidebar.mobile {
  position: fixed;
  transform: translateX(-100%);
}

.sidebar.mobile.open {
  transform: translateX(0);
}

.filter-toggle {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1100;
  background: white;
  border: none;
  padding: 1rem;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.filter-toggle:hover {
  background-color: #e8e8e8;
  transform: scale(1.1);
}




.close-btn {
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .sidebar {
    width: 80vw;
    max-width: none;
  }
}
</style>
