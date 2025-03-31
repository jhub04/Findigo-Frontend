import apiClient from '@/services/apiClient.ts'
import type { ListingResponse } from '@/types/dto.ts'
import { useTokenStore } from '@/stores/token.ts'

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/users/profile')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch current user: ${error})`)
    return null
  }
};

/*
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
}; */

const userApi = {
  getCurrentUser,
}

export default userApi
