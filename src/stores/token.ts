import { defineStore } from "pinia";
import { ref } from "vue";
import { getJwtToken } from '@/services/authApi.ts';
import type { TokenResponse } from '@/types/dto.ts';

export const useTokenStore = defineStore("token", () => {
  const jwtToken = ref<string | null>(sessionStorage.getItem("jwtToken"));
  const loggedInUser = ref<string | null>(sessionStorage.getItem("loggedInUser"));

  const getTokenAndSaveInStore = async (username: string, password: string) => {
    const tokenResponse: TokenResponse | null = await getJwtToken(username, password);
    if (tokenResponse) {
      jwtToken.value = tokenResponse.token;
      loggedInUser.value = username;

      sessionStorage.setItem("jwtToken", tokenResponse.token);
      sessionStorage.setItem("loggedInUser", username);
    } else {
      console.error("Failed to get JWT token");
    }
  };

  const logout = () => {
    jwtToken.value = null;
    loggedInUser.value = null;
    sessionStorage.clear();
  };

  return { jwtToken, loggedInUser, getTokenAndSaveInStore, logout };
});
