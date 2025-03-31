import type { ListingRequest } from '@/types/dto.ts'
import type { ListingResponse } from '@/types/dto.ts'
import { useTokenStore } from '@/stores/token.ts'
import apiClient from '@/services/apiClient.ts'

export const addListing = async(data: ListingRequest): Promise<ListingResponse> => {
  const response = await apiClient.post<ListingResponse>(`/listings`, data);
  return response.data;
}

export const getAllListings = async(): Promise<ListingResponse[]> => {
  try {
    const response = await apiClient.get<ListingResponse[]>('/listings');
    return response.data || [];
  } catch (error) {
    console.log(`Failed to fetch all listings: ${error}`);
    return [];
  }
}

export const getListingById = async (id: number): Promise<ListingResponse | null> => {
  try {
    const response = await apiClient.get<ListingResponse>(`/listings/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch listing: ${error} `);
    return null;
  }
}
