// useImages.ts
import { ref } from 'vue'
import noImage from '@/assets/no-image.jpg'
import { getImageByIndex } from '@/services/imageApi'

export function useImages() {
  const images = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchImages = async (listingId: number, count: number) => {
    loading.value = true
    error.value = null
    const fetched: string[] = []
    for (let i = 0; i < count; i++) {
      try {
        const blob = await getImageByIndex(listingId, i)
        fetched.push(URL.createObjectURL(blob))
      } catch (e) {
        console.error(`Failed to load image at index ${i}`, e)
        fetched.push(noImage)
      }
    }
    images.value = fetched
    loading.value = false
  }

  return {
    images,
    loading,
    error,
    fetchImages,
  }
}
