<script setup lang="ts">
import { useCurrentUser } from '@/utils/useCurrentUser.ts';
import { useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token.ts';

const { user, isLoading, error } = useCurrentUser();
const tokenStore = useTokenStore();
const router = useRouter();

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
