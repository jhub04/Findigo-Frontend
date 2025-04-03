import type { ListingRequest } from '@/types/dto.ts'
import type { ListingResponse } from '@/types/dto.ts'
import apiClient from '@/services/apiClient.ts'

// Add a new listing
export const addListing = async (data: ListingRequest): Promise<ListingResponse> => {
  const response = await apiClient.post<ListingResponse>('/listings', data)
  return response.data
}

// Get all listings in the system
export const getAllListings = async (): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>('/listings')
  return response.data
}

// Get listings by category
export const getListingsByCategory = async (categoryId: number): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>(`/listings/category/${categoryId}`)
  return response.data
}

// Get a specific listing by ID
export const getListingById = async (id: number): Promise<ListingResponse> => {
  const response = await apiClient.get<ListingResponse>(`/listings/${id}`)
  return response.data
}

// Edit an existing listing
export const editListing = async (listingId: number, data: ListingRequest): Promise<ListingResponse> => {
  const response = await apiClient.put<ListingResponse>(`/listings/edit/${listingId}`, data)
  return response.data
}

// Delete a listing
export const deleteListing = async (listingId: number): Promise<string> => {
  const response = await apiClient.delete<string>(`/listings/${listingId}`)
  return response.data
}
