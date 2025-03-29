<template>
  <div class="sidebar">
    <SearchBox />
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

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBox from '@/components/map/SearchBox.vue'

const categories = ['Søk Adresser', 'Filtrer Kategorier',]
const selectedCategory = ref('Alle')


const selectCategory = (cat: string) => {
  selectedCategory.value = cat
  // Du kan bruke emit her senere for å trigge nytt API-kall
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
  width: 390px;
  height: 130px;
  font-family: sans-serif;
  border: 2.5px solid #ccc; /* ← Dette gir en lett grå kant */

}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  padding: 8px 0px 10px 0px; /* top right bottom left */
}

.filters button {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 1.039rem;
}

.filters button.active {
  background-color: #007bff;
  color: white;
}
</style>
