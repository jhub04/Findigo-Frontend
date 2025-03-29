import type { CategoryResponse } from '@/types/dto.ts'
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