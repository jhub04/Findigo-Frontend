<template>
  <div class="sidebar">
    <SearchBox />
    <div class="filters">
      <!-- Øverste knapp -->
    </div>
    <div class="filters">
      <!-- Hus og Bil under -->
      <button
        :class="{ active: selectedCategory === 'All' }"
        @click="selectCategory('All')"
      >
        All
      </button>
      <button
        v-for="cat in ['Car', 'House']"
        :key="cat"
        :class="{ active: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import SearchBox from '@/components/map/MapSearchBar.vue'

// Kun tillegg: event for å sende valgt kategori oppover
const emit = defineEmits(['updateCategory'])
const selectedCategory = ref('All')

const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  emit('updateCategory', cat)
}
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 0.62rem;
  left: 1.02rem;
  z-index: 1000;
  background: white;
  border-radius: 0 10px 10px 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  height: 220px;
  font-family: sans-serif;
  border: 2.5px solid #ccc;
}

.filters {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  padding-bottom: 10px;
}

.filters button {
  display: inline-block;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 2px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
}

.filters button:hover {
  background-color: #0056b3;
}

.filters button.active {
  background-color: #007bff;
  color: white;
}
</style>
y
