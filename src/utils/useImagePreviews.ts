import { ref } from 'vue'
import noImage from '@/assets/no-image.jpg'
import { getImageByIndex } from '@/services/imageApi'

export function useImagePreviews() {
  const previews = ref<string[]>([])
  const loadingPreviews = ref(false)
  const previewError = ref<string | null>(null)

  const fetchPreviews = async (listingId: number, imageCount: number) => {
    loadingPreviews.value = true
    previewError.value = null
    const fetched: string[] = []
    for (let i = 0; i < imageCount; i++) {
      try {
        const blob = await getImageByIndex(listingId, i)
        fetched.push(URL.createObjectURL(blob))
      } catch (e) {
        console.error(`Error fetching preview for image ${i}:`, e)
        fetched.push(noImage)
      }
    }
    previews.value = fetched
    loadingPreviews.value = false
  }

  return {
    previews,
    loadingPreviews,
    previewError,
    fetchPreviews,
  }
}
