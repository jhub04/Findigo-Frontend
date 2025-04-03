import apiClient from '@/services/apiClient.ts'

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

export const login = async (username: string, password: string) => {
  try {
    await apiClient.post<String>("/auth/login", { username, password });
    //Hvis ikke noe returneres og bare 200 OK er login successfull og jwt lagres som cookie, ikke tilgjengleoig fra JS
  } catch (error) {
    //Hvis creds er feil
    console.error("Login failed", error);
    throw error;
  }
};

export const isAuthenticated = async () => {
  try {
    const response = await apiClient.get("/auth/auth-status");
    return response.data.authenticated === true;
  } catch (error) {
    //Not valid jwt token in cookie
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
