import type { FilterRequest, ListingRequest } from '@/types/dto.ts'
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
export const deleteListingById = async (listingId: number): Promise<string> => {
  const response = await apiClient.delete<string>(`/listings/${listingId}`)
  return response.data
}

// Get all a page of recommended listings
export const getRecommendedListingsPage = async (pageNumber:number) => {
  const response = await apiClient.get(`/listings/recommended/${pageNumber}`);
  console.log(response.data)
  return response.data;
}

export const getFilteredListingsPage = async (filter: FilterRequest,
                                              pageNumber: number) => {
  const response = await apiClient.post(`/listings/all/${pageNumber}`, filter);
  return response.data;
}

export const getFilteredListings = async (filter: FilterRequest): Promise<ListingResponse[]> => {
  const response = await apiClient.post('/listings/all', filter)
  return response.data
}
