import apiClient from '@/services/apiClient.ts'
import type { TokenResponse } from '@/types/CalculationDTO.ts'

// Registrerer en ny bruker i backend
export const registerUser = async (username: string, password: string) => {
  //try catch kun i controller
  try {
    const response = await apiClient.post(`/auth/register`, { username, password }, {
      headers: { Authorization: "" },
    });
    return response.data; // Returnerer brukerdata ved suksess
  } catch (error) {
    console.error("Registration failed", error);
    return null;
  }
};

// Takes username and password as parameters,
// sends HTTP post request to the server,
// and in response gets a JWT token from server
export const getJwtToken = async (username: string, password: string): Promise<TokenResponse | null> => {
  try {
    const response = await apiClient.post<TokenResponse>("/auth/login", { username, password }, {
      headers: { Authorization: "" },
    });

    return response.data; // Forventer at serveren returnerer JWT-token
  } catch (error) {
    console.error("Login failed", error);
    return null;
  }
};

const authApi = {
  registerUser,
  getJwtToken,
};

export default authApi;
