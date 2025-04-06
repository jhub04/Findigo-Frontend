import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const selectedCategory = ref<number | 'all'>('all')

export function useSelectedCategory() {
  const route = useRoute()
  const router = useRouter()

  watch(
    () => route.query.category,
    (newVal) => {
      if (!newVal || Array.isArray(newVal) || newVal === 'all') {
        selectedCategory.value = 'all'
      } else {
        const n = Number(newVal)
        selectedCategory.value = isNaN(n) ? 'all' : n
      }
    },
    { immediate: true }
  )

  function updateCategory(category: number | 'all') {
    const currentQuery = { ...route.query }
    currentQuery.category = selectedCategory.value === category ? 'all' : String(category)
    router.replace({ query: currentQuery })
  }

  return {
    selectedCategory,
    updateCategory,
  }
}
