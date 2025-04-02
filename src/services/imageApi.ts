import apiClient from './apiClient'

// Upload a single image for a listing
export const uploadImageToListing = async (listingId: number, file: File): Promise<number> => {
  const formData = new FormData()
  formData.append('file', file)

  return (await apiClient.post(`/images/upload/${listingId}`, formData)).data;
};

// Get all image URLs for a listing
export const getImagesFromListing = async (listingId: number, imageIndex:number) => {
  const response = await apiClient.get(`/images/download/${listingId}/${imageIndex}`, {
    responseType:"blob",
  });
  return response.data
};
