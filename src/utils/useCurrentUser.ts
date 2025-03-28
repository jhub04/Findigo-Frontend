import { ref, onMounted } from 'vue';
import userApi from '@/services/userApi.ts';
import type { UserResponse } from '@/types/dto.ts';
import { useTokenStore } from '@/stores/token.ts';

export function useCurrentUser() {
  const user = ref<UserResponse | null>(null);
  const isLoading = ref(true);
  const error = ref(false);
  const tokenStore = useTokenStore();

  const fetchUser = async () => {
    if (tokenStore.jwtToken) {
      try {
        const userInfo = await userApi.getCurrentUser();
        user.value = userInfo;
      } catch (e) {
        error.value = true;
      }
    }
    isLoading.value = false;
  };

  onMounted(fetchUser);

  return {
    user,
    isLoading,
    error,
    refreshUser: fetchUser
  };
}
