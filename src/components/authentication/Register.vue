<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import authApi from '@/services/authApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { AuthRequest } from '@/types/dto.ts'
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const register = async () => {
  try {
    const newUser: AuthRequest = {
      username: username.value,
      password: password.value
    }
    const response = await authApi.registerUser(newUser);
    if (response) {
      successMessage.value = t("Registration successful! You can now log in.");
      setTimeout(() => {
        router.push("/loginu");
      }, 1000);
    }
  } catch (error) {
    console.log("error")
    errorMessage.value = handleApiError(error);
    console.log(errorMessage.value)
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="username">"{{$t('Username:')}}"</label>
          <input
            id="username"
            name="username"
            v-model="username"
            type="text"
            required
            placeholder=
            '{{ $t("Choose a username") }}'
          />
        </div>

        <div class="form-group">
          <label for="password">"{{$t('Password:')}}"</label>
          <input
            id="password"
            name="password"
            v-model="password"
            type="password"
            required
            placeholder='{{ $t("Create a strong password") }}'
          />
        </div>

        <button type="submit" class="submit-btn">{{$t("Register")}}</button>
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
        {{$t("Already have an account?")}}
        <router-link to="/login">{{$t('Login here')}}</router-link>
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
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
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
