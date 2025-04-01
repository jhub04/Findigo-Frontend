import apiClient from './apiClient'

// Upload a single image for a listing
export const uploadImageToListing = async (listingId: number, file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  await apiClient.post(`/images/upload/${listingId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
};

// Get all image URLs for a listing
export const getImagesFromListing = async (listingId: number): Promise<string[]> => {
  const response = await apiClient.get<string[]>(`/images/download/${listingId}`)
  return response.data
};
