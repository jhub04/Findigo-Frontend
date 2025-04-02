import apiClient from './apiClient'

// Upload a single image for a listing
export const uploadImageToListing = async (listingId: number, file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)

  await apiClient.post(`/images/upload/${listingId}`, formData)
};

// Get all image URLs for a listing
export const getImagesFromListing = async (listingId: number) => {
  const response = await apiClient.get(`/images/download/${listingId}`, {
    responseType:"blob",
  });
  return response.data
};
