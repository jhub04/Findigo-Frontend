<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from '@/stores/user'
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const loginStatus = ref("");

const handleLoginClick = async () => {
  try {
    await userStore.loginAndSaveUser(username.value, password.value);
    await router.push("/home");
  } catch(error) {
    //Couldnt log in
    loginStatus.value = "Login failed!";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLoginClick">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            required 
            placeholder="Enter your username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" class="submit-btn">Login</button>
      </form>

      <p v-if="loginStatus" class="error-message">{{ loginStatus }}</p>

      <p class="register-link">
        Don't have an account? 
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 15px;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.9em;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>