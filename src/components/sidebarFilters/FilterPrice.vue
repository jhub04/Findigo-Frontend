<template>
  <div class="filter-price">
    <h3> {{ $t('Price')}}</h3>
    <div class="price-inputs">
      <input
        type="number"
        :placeholder="$t('min')"
        v-model.number="min"
      />
      <input
        type="number"
        :placeholder="$t('max')"
        v-model.number="max"
      />
      <button class="apply-button" @click="updatePrice">{{ $t('Search') }}</button>
    </div>
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
  router.replace({ query })
}
</script>

<style scoped>
.filter-price h3 {
  font-size: 1.03rem;
}

.price-inputs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  flex-wrap: nowrap; /* Prevent wrapping until mobile breakpoint */
}

input[type="number"] {
  flex: 1 1 auto;      /* Allow inputs to shrink */
  min-width: 70px;      /* Set a minimum width */
  appearance: textfield;
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.apply-button {
  flex: 0 0 auto;      /* Button doesn't shrink */
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.apply-button:hover {
  background-color: #0056b3;
}

/* Responsivt: på små skjermer vis inputs i kolonne */
@media (max-width: 480px) {
  .price-inputs {
    flex-direction: column;
  }
  input[type="number"],
  .apply-button {
    width: 100%;
  }
}
</style>
