<template>
  <div class="sidebar">
    <h2>Søk</h2>
    <div class="filters">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="{ active: selectedCategory === cat }"
        @click="selectCategory(cat)"
      >
        {{ cat }}
      </button>
    </div>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Søk..."
      class="search-input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const categories = ['Søk Adresser', 'Filtrer Kategorier',]
const searchQuery = ref('')
const selectedCategory = ref('Alle')


const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  // Du kan bruke emit her senere for å trigge nytt API-kall
}
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: white;
  border-radius: 0 10px 10px 10px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 260px;
  height: 120px;
  font-family: sans-serif;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 0.7rem;
  margin-top: 0.4rem;
}

.search-input {
  width: 95%;
  padding: 0.5rem 0.6rem;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1rem;
  display: block;
  border-radius: 5px;
}


.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.filters button {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 0.85rem;
}

.filters button.active {
  background-color: #007bff;
  color: white;
}
</style>
