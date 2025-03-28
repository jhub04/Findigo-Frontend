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
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            required 
            placeholder="Choose a username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="Create a strong password"
          />
        </div>

        <button type="submit" class="submit-btn">Register</button>
      </form>

      <p 
        v-if="successMessage" 
        class="success-message"
      >
        {{ successMessage }}
      </p>

      <p 
        v-if="errorMessage" 
        class="error-message"
      >
        {{ errorMessage }}
      </p>

      <p class="login-link">
        Already have an account? 
        <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}

.register-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #218838;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 15px;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 15px;
}

.login-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9em;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>