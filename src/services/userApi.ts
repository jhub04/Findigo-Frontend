import apiClient from '@/services/apiClient.ts'
import type { ListingResponse, UserResponse } from '@/types/dto.ts'
import type { UserRequest } from '@/types/adminDto.ts'

// Get current user profile
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/users/profile')
  return response.data
}

// Edit current user's profile
export const editMyProfile = async (data: UserRequest): Promise<string> => {
  const response = await apiClient.put<string>('/users/me/edit', data)
  return response.data
}

// Get active listings of the current user
export const getMyActiveListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>('/users/me/activeListings')
  return response.data
}

// Get archived listings of the current user
export const getMyArchivedListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>('/users/me/archivedListings')
  return response.data
}

// Get sold listings of the current user
export const getMySoldListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>('/users/me/soldListings')
  return response.data
}

// Add new favorite. Returns a listingResponse
export const addFavorite = async (listingId: number): Promise<ListingResponse> => {
  const response = await apiClient.post<ListingResponse>(`/users/favorites/${listingId}`)
  return response.data
} 

// Removes a favorite. Returns the deleted listingResponse
export const removeFavorite = async (listingId: number): Promise<ListingResponse> => {
  const response = await apiClient.delete<ListingResponse>(`/users/favorites/${listingId}`);
  return response.data;
}

// Gets all the users favorite listings. Return a list of listresponses 
export const getFavorites = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>(`/users/favorites`);
  return response.data;
}
