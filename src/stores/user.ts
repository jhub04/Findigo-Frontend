import { defineStore } from "pinia";
import { ref } from "vue";
import { login, clearCookie, isAuthenticated } from '@/services/authApi.ts';

export const useUserStore = defineStore("token", () => {
  const loggedInUser = ref<string | null>(sessionStorage.getItem("loggedInUser"));
  const authenticated = ref(false);

  const initializeAuthStatus = async () => {
    authenticated.value = await isAuthenticated();
  };

  initializeAuthStatus();

  const loginAndSaveUser = async (username: string, password: string) => {
    await login(username, password); //This can throw error
    loggedInUser.value = username;
    sessionStorage.setItem("loggedInUser", username);
    authenticated.value = await isAuthenticated();
  };

  const logout = async () => {
    try {
      await clearCookie();
    } catch (error) {
      console.error("Error during logout:", error);
      return;
    }
  
    // After logout request, redirect to login page
    window.location.href = "/login";
    authenticated.value = false;
    loggedInUser.value = null;
    sessionStorage.clear();
  };

  return { loggedInUser, authenticated, loginAndSaveUser, logout };
});
