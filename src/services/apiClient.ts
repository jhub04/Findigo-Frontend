import axios from 'axios'
import { useTokenStore } from '@/stores/token.ts'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const tokenStore = useTokenStore();
  console.log("JWT Token:", tokenStore.jwtToken);
  if (tokenStore.jwtToken) {
    config.headers.Authorization = `Bearer ${tokenStore.jwtToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios Interceptors for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const tokenStore = useTokenStore();

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Unauthorized or forbidden, logging out');
      tokenStore.logout();
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
);

export default apiClient;
