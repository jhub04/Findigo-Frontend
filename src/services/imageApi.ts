import apiClient from './apiClient'

// Upload a single image for a listing
export const uploadImageToListing = async (listingId: number, file: File): Promise<number> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post(`/images/upload/${listingId}`, formData);
  return response.data;
};

// Gets image from listingId with given imageIndex 
export const getImageByIndex = async (listingId: number, imageIndex:number) => {
  const response = await apiClient.get(`/images/download/${listingId}/${imageIndex}`, {
    responseType:"blob",
  });
  return response.data
};
