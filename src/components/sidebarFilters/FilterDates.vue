<template>
  <div class="filter-dates">
    <h3>{{ $t('Publish from') }}</h3>
    <div class="calendar-button">
      <input
        type="date"
        v-model="selectedDate"
        @change="validateDate"
        lang="en"
        :max="today"
      />
      <button
        @click.prevent="performDateFilter"
        :disabled="!isDateValid"
        class="apply-button"
      >
        {{ $t('Apply') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const today = new Date().toISOString().split('T')[0]
const router = useRouter()
const route = useRoute()
const selectedDate = ref<string | null>(null)
const isDateValid = ref(true)

function validateDate() {
  isDateValid.value = !!selectedDate.value
}

function performDateFilter() {
  const query = { ...route.query }
  if (selectedDate.value) query.dateFrom = selectedDate.value
  else delete query.dateFrom
  router.replace({ query })
}
</script>

<style scoped>
.calendar-button {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

input[type="date"] {
  width: 140px;
}

.apply-button {
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

.apply-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.filter-dates h3 {
  font-size: 1.03rem;
}

/* Responsivt: på små skjermer stables elementene */
@media (max-width: 480px) {
  .calendar-button {
    flex-direction: column;
  }
  input[type="date"] {
    width: 100%;
  }
  .apply-button {
    width: 100%;
  }
}
</style>
