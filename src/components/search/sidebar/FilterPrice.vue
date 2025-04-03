<template>
  <div class="filter-price">
    <h3>Price</h3>
    <input
      type="number"
      placeholder="Min"
      v-model.number="min"
    />
    <input
      type="number"
      placeholder="Max"
      v-model.number="max"
    />
    <button class="search-button" @click="updatePrice">Search</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const min = ref<number | null>(null)
const max = ref<number | null>(null)

function updatePrice() {
  const query = { ...route.query }

  if (min.value != null) query.priceFrom = String(min.value)
  else delete query.priceFrom

  if (max.value != null) query.priceTo = String(max.value)
  else delete query.priceTo

  router.push({ query })
}
</script>

<style scoped>
.filter-price {
  margin-left: 1.5rem;
  border-radius: 70px;
}

input[type="number"] {
  width: 100px;
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.search-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
