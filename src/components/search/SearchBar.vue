<template>
  <div class="scalable-wrapper">
    <div class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('Search for listing ...')"
        class="search-input"
        @keyup.enter="performSearch"
      />
      <div class="search-icon" @click="performSearch">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')

const performSearch = () => {
  const trimmed = searchQuery.value.trim()
  const newQuery = { ...route.query }
  if (trimmed) newQuery.q = trimmed
  else delete newQuery.q
  router.replace({ query: newQuery })
}
</script>

<style scoped>
.scalable-wrapper {

  width: 650px;

  max-width: 100%;
  margin: 0 auto;
  transform-origin: top left;
  overflow: visible;
}

@media (max-width: 650px) {
  .scalable-wrapper {
    transform: scale(calc(100vw / 650));
  }
}

.search-container {
  position: relative;
  display: flex;
  width: 100%;
  margin: 10px 0;
  box-sizing: border-box;
}

.search-input {
  width: 100%;
  padding: 0.6rem;
  padding-right: 2.5rem;
  font-size: 1rem;
  display: block;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

.search-icon {
  position: absolute;

  right: 0.6rem;

  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
}



</style>
