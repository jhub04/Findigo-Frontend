import type { ListingRequest } from '@/types/dto.ts'
import type { ListingResponse } from '@/types/dto.ts'
import { useTokenStore } from '@/stores/token.ts'
import apiClient from '@/services/apiClient.ts'

export const addListing = async(data: ListingRequest): Promise<ListingResponse> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;

  const response = await apiClient.post<ListingResponse>(`/listings/${username}`, data);
  return response.data;
}

export const getUserListings = async(): Promise<ListingResponse[]> => {
  const tokenStore = useTokenStore();
  const username = tokenStore.loggedInUser;
  const jwtToken = tokenStore.jwtToken;

  if (!username || !jwtToken) {
    throw new Error("User is not logged in or token is missing.");
  }

  try {
    const response = await apiClient.get<ListingResponse[]>(`/listings/${username}`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    return response.data || [];
  } catch (error) {
      console.error(`Failed to fetch listings: ${error} `);
      return [];
  }
};
