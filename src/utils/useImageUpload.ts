import { ref } from 'vue'
import { uploadImageToListing } from '@/services/imageApi'

export function useImageUpload() {
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)
  const numImagesUploaded = ref(0)

  const uploadImages = async (listingId: number, files: FileList) => {
    isUploading.value = true
    uploadError.value = null
    let uploadedCount = 0
    for (const file of Array.from(files)) {
      try {
        uploadedCount = await uploadImageToListing(listingId, file)
      } catch (e) {
        uploadError.value = `Error uploading ${file.name}`
        console.error(e)
      }
    }
    numImagesUploaded.value = uploadedCount
    isUploading.value = false
    return uploadedCount
  }

  return {
    isUploading,
    uploadError,
    numImagesUploaded,
    uploadImages,
  }
}
