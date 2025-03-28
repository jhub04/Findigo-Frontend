<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import authApi from '@/services/authApi.ts'

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const register = async () => {
  try {
    const response = await authApi.registerUser(username.value, password.value);
    if (response) {
      successMessage.value = "Registration successful! You can now log in.";
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } else {
      errorMessage.value = "Registration failed. Try again.";
    }
  } catch (error) {
    errorMessage.value = `An error occurred: ${error}`;
  }
};
</script>

<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Username:</label>
      <input v-model="username" type="text" required />

      <label>Password:</label>
      <input v-model="password" type="password" required />

      <button type="submit">Register</button>
    </form>

    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>Already have an account? <router-link to="/login">Login here</router-link></p>
  </div>
</template>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
</style>

