import { ref, onMounted } from 'vue';
import type { UserResponse } from '@/types/dto.ts';
import { getCurrentUser } from '@/services/userApi.ts'

export function useCurrentUser() {
  const user = ref<UserResponse | null>(null);
  const isLoading = ref(true);
  const error = ref(false);

  const fetchUser = async () => {
    try {
      const userInfo = await getCurrentUser();
      user.value = userInfo;
    } catch (e) {
      error.value = true;
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
