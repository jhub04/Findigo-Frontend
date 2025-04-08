<template>
  <div class="sidebar-container">
    <button
      v-if="isMobile && !showSidebar"
      class="toggle-btn clean-toggle"
      :style="toggleButtonStyle"
      @click="toggleSidebar"
      aria-label="Open filters"
    >
      <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <circle cx="10" cy="6" r="2"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <circle cx="14" cy="12" r="2"/>
        <line x1="4" y1="18" x2="20" y2="18"/>
        <circle cx="8" cy="18" r="2"/>
      </svg>
      <span class="filter-text">Filters</span>
    </button>

    <div class="sidebar" :class="{ mobile: isMobile, open: showSidebar }" :style="sidebarStyle">
      <template v-if="isMobile">
        <SearchBar/>
      </template>
      <FilterCategories />
      <div class="filter-price-date">
        <FilterPrice />
        <FilterDates />
      </div>
      <button v-if="isMobile" class="close-btn" @click="toggleSidebar">
        Close Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FilterCategories from '@/components/sidebarFilters/FilterCategories.vue'
import FilterPrice from '@/components/sidebarFilters/FilterPrice.vue'
import FilterDates from '@/components/sidebarFilters/FilterDates.vue'
import SearchBar from '@/components/search/SearchBar.vue'

const props = defineProps<{ navbarHeight: number }>()

const showSidebar = ref(true)
const isMobile = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const sidebarStyle = computed(() => ({
  top: `${props.navbarHeight}px`
}))

const toggleButtonStyle = computed(() => ({
  top: `${props.navbarHeight}px`,
  left: '50%',
  transform: 'translateX(-50%)'
}))

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
    if (!isMobile.value) showSidebar.value = true
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.clean-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 9999px;
  padding: 8px 25px;
  margin-top: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 1100;
  cursor: pointer;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.clean-toggle:hover {
  background-color: #f0f4f8;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.filter-icon {
  width: 24px;
  height: 24px;
  stroke: #1F7A8C;
}

.filter-text {
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
}

.sidebar {
  position: absolute;
  left: 0;
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar.mobile {
  position: fixed;
  transform: translateX(-100%);
}

.sidebar.mobile.open {
  transform: translateX(0);
}

.close-btn {
  margin-top: 1rem;
  background-color: #28a745;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.filter-price-date {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (min-width: 769px) {
  .sidebar {
    position: fixed;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-container {
    display: flex;
    flex-direction: row;
  }

  .toggle-btn {
    display: none;
  }
}
</style>
