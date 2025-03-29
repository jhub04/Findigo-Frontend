<template>
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Search for listing ..."
    class="search-input"
  />
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')

// Emit søkestrengen hver gang den endres
watch(searchQuery, (newValue) => {
  emit('search', newValue.trim().toLowerCase())
})
</script>

<style scoped>
.search-input {
  width: 95%;
  padding: 0.6rem;
  margin: 0 auto 1rem;
  display: block;
  border-radius: 5px;
}
</style>
