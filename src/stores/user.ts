import { defineStore } from "pinia";
import { ref } from "vue";
import { login } from '@/services/authApi.ts';

export const useUserStore = defineStore("token", () => {
  const loggedInUser = ref<string | null>(sessionStorage.getItem("loggedInUser"));

  const loginAndSaveUser = async (username: string, password: string) => {
    await login(username, password); //This can throw error
    loggedInUser.value = username;
    sessionStorage.setItem("loggedInUser", username);
  };

  const logout = () => {
    //TODO api call to backend to log out
    loggedInUser.value = null;
    sessionStorage.clear();
  };

  return { loggedInUser, loginAndSaveUser, logout };
});
