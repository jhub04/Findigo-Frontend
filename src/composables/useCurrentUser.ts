import { ref, onMounted } from 'vue';
import type { UserResponse } from '@/types/dto.ts';
import { getCurrentUser } from '@/services/userApi.ts';
import { useUserStore } from '@/stores/user.ts';

export function useCurrentUser() {
  const user = ref<UserResponse | null>(null);
  const isLoading = ref(true);
  const error = ref(false);

  const userStore = useUserStore();

  const fetchUser = async () => {
    if (!userStore.authenticated) {
      isLoading.value = false;
      return;
    }

    try {
      const userInfo = await getCurrentUser();
      user.value = userInfo;
    } catch (e) {
      error.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchUser);

  return {
    user,
    isLoading,
    error,
    refreshUser: fetchUser
  };
}
