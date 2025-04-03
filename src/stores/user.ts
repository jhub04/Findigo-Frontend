import { defineStore } from "pinia";
import { ref } from "vue";
import { login, clearCookie } from '@/services/authApi.ts';

export const useUserStore = defineStore("token", () => {
  const loggedInUser = ref<string | null>(sessionStorage.getItem("loggedInUser"));

  const loginAndSaveUser = async (username: string, password: string) => {
    await login(username, password); //This can throw error
    loggedInUser.value = username;
    sessionStorage.setItem("loggedInUser", username);
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
    loggedInUser.value = null;
    sessionStorage.clear();
  };

  return { loggedInUser, loginAndSaveUser, logout };
});
