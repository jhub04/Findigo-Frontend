import type { CategoryResponse, ListingResponse } from '@/types/dto.ts'
import apiClient from '@/services/apiClient.ts'

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await apiClient.get<CategoryResponse[]>('/categories');
    return response.data || [];
  } catch (error) {
    console.error(`Failed to fetch categories: ${error}`);
    return [];
  }
};

//api/categories/{categoryId}
export const getListingsByCategory = async (categoryId: number): Promise<ListingResponse[]> => {
    try {
      const response = await apiClient.get<ListingResponse[]>(`/categories/${categoryId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch listings for category ${categoryId}:`, error);
      return [];
    }
  };