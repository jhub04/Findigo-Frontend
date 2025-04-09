<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ $t("Login") }}</h2>
      <form @submit.prevent="handleLoginClick">
        <div class="form-group">
          <label for="username">{{ $t("Username:") }}</label>
          <input
            id="username"
            name="username"
            v-model="username"
            type="text"
            required
            :placeholder="$t('Enter your username')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ $t("Password:") }}</label>
          <input
            id="password"
            name="password"
            v-model="password"
            type="password"
            required
            :placeholder="$t('Enter your password')"
          />
        </div>

        <button type="submit" class="submit-btn">{{ $t("Login") }}</button>
      </form>

      <p v-if="loginStatus" class="error-message">{{ loginStatus }}</p>

      <p class="register-link">
        {{ $t("Don't have an account?") }}
        <router-link to="/register">{{ $t("Register here") }}</router-link>
      </p>
    </div>
  </div>
</template>
