import apiClient from '@/services/apiClient.ts'
import type { AuthRequest } from '@/types/dto.ts'
import { handleApiError } from '@/utils/handleApiError.ts'

export const registerUser = async (data: AuthRequest) => {
  try {
    const response = await apiClient.post(`/auth/register`, data);
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    return null;
  }
};

export const login = async (data: AuthRequest) => {
  try {
    await apiClient.post<string>("/auth/login", data);
    //Hvis ikke noe returneres og bare 200 OK er login successfull og jwt lagres som cookie, ikke tilgjengleoig fra JS
  } catch (error) {
    //Hvis creds er feil
    console.error("Login failed", error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  let response;
  try {
    response = await apiClient.get("/auth/auth-status");
    return response.data.authenticated === true;
  } catch (error) {
    handleApiError(error)
    return false;
  }
}

export const clearCookie = async () => {
  await apiClient.post("auth/logout");
}


const authApi = {
  registerUser,
  login,
  isAuthenticated,
  clearCookie
};

export default authApi;
