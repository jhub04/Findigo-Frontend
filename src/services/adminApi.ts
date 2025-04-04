import type { AttributeResponse, CategoryResponse, ListingResponse, UserResponse } from '@/types/dto.ts'
import type { AttributeRequest, CategoryRequest, UserLiteResponse, UserRequest } from '@/types/adminDto.ts'
import apiClient from '@/services/apiClient.ts'

export const addCategory = async(data: CategoryRequest): Promise<CategoryResponse> => {
  const response = await apiClient.post<CategoryResponse>('/admin/categories', data);
  return response.data;
}

export const addAttribute = async(data: AttributeRequest): Promise<AttributeResponse> => {
  const response = await apiClient.post<AttributeResponse>('/admin/attributes', data);
  return response.data;
}

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const response = await apiClient.get<UserResponse[]>('/admin/users');
  return response.data;
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>(`/admin/users/${userId}`);
  return response.data;
};

export const getUserListings = async (userId: number): Promise<ListingResponse[]> => {
  const response = await apiClient.get<ListingResponse[]>(`/admin/users/${userId}/listings`);
  return response.data;
};

export const addUser = async (data: UserRequest): Promise<UserLiteResponse> => {
  const response = await apiClient.post<UserLiteResponse>('/admin/users', data);
  return response.data;
};

export const editUser = async (userId: number, data: UserRequest): Promise<string> => {
  const response = await apiClient.put<string>(`/admin/users/edit/${userId}`, data);
  return response.data;
};

export const editCategory = async (categoryId: number, data: CategoryRequest): Promise<string> => {
    const response = await apiClient.put(`/admin/categories/edit/${categoryId}`, data);
    return response.data;
};

export const deleteCategory = async (categoryId: number): Promise<string> => {
  const response = await apiClient.delete(`/admin/categories/${categoryId}`);
  return response.data;
}

export const editAttribute = async (attributeId: number, data: AttributeRequest): Promise<string> => {
  const response = await apiClient.put(`/admin/attributes/edit/${attributeId}`, data);
  return response.data;
};

export const deleteAttribute = async (attributeId: number): Promise<string> => {
  const response = await apiClient.delete(`/admin/attributes/${attributeId}`);
  return response.data;
};

export const getAllAttributes = async (): Promise<AttributeResponse[]> => {
  const response = await apiClient.get('/admin/attributes');
  return response.data;
};
