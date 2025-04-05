import axios from 'axios'
import { useUserStore } from '@/stores/user'

const apiClient = axios.create({
  baseURL: 'https://localhost:8443/api',
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios Interceptors for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const userStore = useUserStore();

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Unauthorized or forbidden, logging out');
      await userStore.logout();
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
);

export default apiClient;
