<script setup lang="ts">
import { useRouter } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'

const categoryWidthRef = ref<HTMLElement | null>(null)
const selectRef = ref<HTMLElement | null>(null)

const router = useRouter()

// Søketekst
const searchQuery = ref('')

// Valgt kategori
const selectedCategory = ref('All')

// Liste over tilgjengelige kategorier
const categories = ['All', 'House', 'Car', 'Electronics', 'AAAAAAAAAAAAAAAAAAAAA']

// Oppdater bredden basert på valgt kategori
function updateSelectWidth() {
  if (categoryWidthRef.value && selectRef.value) {
    const width = categoryWidthRef.value.offsetWidth + 40 // padding-buffer
    selectRef.value.style.width = `${width}px`
  }
}

onMounted(() => nextTick(updateSelectWidth))
watch(selectedCategory, () => nextTick(updateSelectWidth))

// Ved søk: naviger med søkestreng og kategori
function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: {
        q: searchQuery.value.trim(),
        category: selectedCategory.value
      }
    })
  }
}
</script>

<template>
  <!-- Usynlig måleelement for dynamisk bredde -->
  <span ref="categoryWidthRef" class="invisible-text">{{ selectedCategory }}</span>

  <form class="search-form" @submit.prevent="performSearch">
    <!-- Kategorivelger -->
    <select
      ref="selectRef"
      v-model="selectedCategory"
      class="search-category"
    >
      <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
    </select>

    <!-- Søkefelt -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      name="findigo-search"
      autocomplete="off"
    />

    <!-- Søkeknapp -->
    <button type="submit">
      <i class="fa fa-search"></i>
    </button>
  </form>
</template>

<style scoped>
.search-form {
  display: flex;
  width: 100%;
  max-width: 650px;
  border: 1px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  background: #f1f1f1;
}

/* Kategori-dropdown */
.search-category {
  border: none;
  padding: 10px 10px 10px 20px;
  background: #e6e6e6;
  font-size: 16px;
  border-right: 1px solid #ccc;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Søke-input */
.search-form input[type="text"] {
  flex: 1;
  padding: 10px;
  font-size: 17px;
  border: none;
  background: #f1f1f1;
  outline: none;
}

/* Søkeknapp */
.search-form button {
  padding: 0 20px;
  background: #2196f3;
  color: white;
  font-size: 17px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

.search-form button:hover {
  background: #0b7dda;
}

/* Usynlig måleelement */
.invisible-text {
  position: absolute;
  visibility: hidden;
  white-space: nowrap;
  font-size: 16px;
  padding: 10px 10px 10px 20px;
  font-family: inherit;
}
</style>
