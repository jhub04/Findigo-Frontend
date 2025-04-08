import type { CategoryResponse } from '@/types/dto.ts'
import apiClient from '@/services/apiClient.ts'

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await apiClient.get<CategoryResponse[]>('/categories')
    return response.data || []
  } catch (error) {
    console.error(`Failed to fetch categories: ${error}`)
    return []
  }
}

export const getCategoryById = async (categoryId: number): Promise<CategoryResponse | null> => {
  try {
    const response = await apiClient.get<CategoryResponse>(`/categories/${categoryId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch category ${categoryId}: ${error}`)
    return null
  }
}
