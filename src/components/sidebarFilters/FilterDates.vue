<template>
  <div class="filter-dates">
    <h3>{{ $t('Dates') }}</h3>
    <div class="dates-inputs">
      <input type="date" v-model="startDate" :placeholder="$t('Published From')" />
      <button class="apply-button" @click="updateDates">{{ $t('Search') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const startDate = ref<string | null>(null)

function updateDates() {
  const query = { ...route.query }
  if (startDate.value) query.dateFrom = startDate.value
  else delete query.dateFrom
  router.replace({ query })
}
</script>

<style scoped>
.filter-dates h3 {
  font-size: 1.03rem;
}

.dates-inputs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  flex-wrap: nowrap;
}

.dates-inputs input[type="date"] {
  flex: 1 1 auto;
  min-width: 70px;
}

.apply-button {
  flex: 0 0 auto;
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

/* Responsive: stack in a column on small screens */
@media (max-width: 480px) {
  .dates-inputs {
    flex-direction: column;
  }
  .dates-inputs input[type="date"],
  .apply-button {
    width: 100%;
  }
}
</style>
