// useImages.ts
import { ref } from 'vue'
import noImage from '@/assets/no-image.jpg'
import { getImageByIndex } from '@/services/imageApi'
import type { ListingResponse } from '@/types/dto.ts'

export function useImages() {
  const images = ref<string[]>([])
  const imageMap = ref<Record<number, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetches all images for a specific listing
  const fetchImagesForListing = async (listingId: number, count: number) => {
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

  // Fetches only the first image for all listings. Used on the homepage for listing previews/thumbnails
  const fetchFirstImageForListings = async (listings: ListingResponse[]) => {
    loading.value = true
    error.value = null
    for (const listing of listings) {
      if (listing.numberOfImages > 0) {
        try {
          const blob = await getImageByIndex(listing.id, 0)
          imageMap.value[listing.id] = URL.createObjectURL(blob)
        } catch (e) {
          console.error(`Failed to load image for listing ${listing.id}`, e)
          imageMap.value[listing.id] = noImage
        }
      } else {
        imageMap.value[listing.id] = noImage
      }
    }
    loading.value = false
  }

  return {
    images,
    imageMap,
    loading,
    error,
    fetchImagesForListing,
    fetchFirstImageForListings,
  }
}
