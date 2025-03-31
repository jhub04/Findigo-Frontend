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

const userApi = {
  getCurrentUser,
}

export default userApi
