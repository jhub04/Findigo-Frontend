import { defineStore } from "pinia";
import { ref } from "vue";
import { login, clearCookie, isAuthenticated } from '@/services/authApi.ts';
import type { AuthRequest, UserResponse } from '@/types/dto.ts'
import { getCurrentUser } from '@/services/userApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'

export const useUserStore = defineStore("token", () => {
  const authenticated = ref(false);
  const currentUser = ref<UserResponse | null>(null);

  const initializeAuthStatus = async () => {
    authenticated.value = await isAuthenticated();
    if (authenticated.value) {
      currentUser.value = await getCurrentUser();
    }
  };

  const loginAndSaveUser = async (data: AuthRequest) => {
    await login(data);
    authenticated.value = await isAuthenticated();
    currentUser.value = await getCurrentUser();
  };

  const logout = async () => {
    try {
      await clearCookie();
    } catch (error) {
      console.error("Error during logout:", error);
      handleApiError(error)
      return;
    }

    window.location.href = "/login";
    authenticated.value = false;
    currentUser.value = null;
  };

  const isAdmin = () => {
    return currentUser.value?.roles.includes('ROLE_ADMIN') ?? false;
  };

  return { authenticated, currentUser, loginAndSaveUser, logout, initializeAuthStatus, isAdmin };
});

