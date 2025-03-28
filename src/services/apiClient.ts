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
  console.error('Request error:', error);
  // Optional: Sentry.captureException(error);
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      // Håndter autorisasjonsfeil (401, 403)
      if (status === 401 || status === 403) {
        console.error(`Authorization error (${status}). Logging out user.`);
        const tokenStore = useTokenStore();
        tokenStore.logout();
        window.location.href = '/login';
      }
      // Håndter serverfeil (500+): Implementer retry med eksponentiell backoff
      else if (status >= 500) {
        const config = error.config;
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount < 3) {
          config.__retryCount++;
          const delay = Math.pow(2, config.__retryCount) * 1000;
          console.warn(`Server error (${status}). Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return apiClient(config);
        }
      }
      // Andre klientfeil
      else {
        console.error(
          `Client error (${status}):`,
          error.response.data?.message || error.response.statusText
        );
      }
    }
    // Ingen respons mottatt: Nettverksfeil
    else if (error.request) {
      console.error('Network error or no response received:', error.request);
    }
    // Feil i oppsettet av forespørselen
    else {
      console.error('Error setting up request:', error.message);
    }
    // Optional: Send feilen til en ekstern loggtjeneste (f.eks. Sentry)
    // Sentry.captureException(error);
    return Promise.reject(error);
  }
);

export default apiClient;
