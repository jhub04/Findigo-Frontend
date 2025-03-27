<script setup lang="ts">
import { ref } from "vue";
import { useTokenStore } from "../stores/token";
import { useRouter } from "vue-router";

const tokenStore = useTokenStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const loginStatus = ref("");

const handleLoginClick = async () => {
  await tokenStore.getTokenAndSaveInStore(username.value, password.value);
  if (tokenStore.jwtToken) {
    await router.push("/home");
  } else {
    loginStatus.value = "Login failed!";
  }
};
</script>

<template>
  <div>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="handleLoginClick">
        <label>Username:</label>
        <input v-model="username" type="text" required />

        <label>Password:</label>
        <input v-model="password" type="password" required />

        <button type="submit">Login</button>
      </form>

      <p v-if="loginStatus" class="error">{{ loginStatus }}</p>

      <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
    </div>
  </div>
</template>
