<template>
  <div class="search-container">
    <!-- Input for search query. Emits 'search' on Enter -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search for listing ..."
      class="search-input"
      @keyup.enter="performSearch"
    />

    <!-- Icon that also triggers the search manually when clicked -->
    <div class="search-icon" @click="performSearch">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * SearchBox component for entering listing queries.
 * Emits the search input both on change and on explicit submit (Enter or icon click).
 */

import { defineEmits, ref, watch } from 'vue'

/**
 * Emits the 'search' event to parent component when the input changes or is submitted.
 */
const emit = defineEmits(['search'])

/**
 * Reactive value for the current search input.
 */
const searchQuery = ref('')

/**
 * Automatically emits 'search' on each keystroke for live filtering.
 * @param newValue The updated input string
 */
watch(searchQuery, (newValue) => {
  emit('search', newValue.trim().toLowerCase())
})

/**
 * Manually emits the current query (used for Enter key or search icon click).
 */
const performSearch = () => {
  emit('search', searchQuery.value.trim().toLowerCase())
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 88.3%;
  margin: 10px 0px;
}

.search-input {
  width: 93%;
  padding: 0.6rem;
  padding-right: 2.5rem; /* Make space for search icon */
  font-size: 1rem;
  display: block;
  border-radius: 5px;
}

.search-icon {
  position: absolute;
  right: -23px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
}
</style>
