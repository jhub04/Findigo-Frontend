<script lang="ts" setup>

import { useTokenStore } from '@/stores/token.ts'
import { onMounted, ref } from 'vue';
import userApi from '@/services/userApi.ts'
import type { User } from '@/types/CalculationDTO.ts'

const tokenStore = useTokenStore();
const user = ref<User | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<boolean>(false);

onMounted(async () => {
  if (tokenStore.jwtToken) {
    try {
      const userInfo = await userApi.getCurrentUser();
      if (userInfo) {
        user.value = userInfo;
      }
    } catch (e) {
      error.value = true;
    }
  }
  isLoading.value = false;
});

</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div v-if="user">
        <h2>Welcome, {{user.username}}</h2>
      </div>
      <div v-else>
        <h2 v-if="error">Error</h2>
        <h2 v-else>Unauthorized!</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
