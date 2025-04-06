<script setup lang="ts">
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { user, isLoading, error } = useCurrentUser()
const tokenStore = useUserStore()
const router = useRouter()

const logout = () => {
  tokenStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="userdetails">
    <div v-if="isLoading">{{ t('Loading...') }}</div>
    <div v-else>
      <div v-if="user">
        <h3>{{ user.username }}</h3>
        <!-- Implement when userDto is complete-->
        <p>{{ t('User email') }}</p>
        <button class="logout-button" @click="logout">
          {{ t('Log out') }}
        </button>
      </div>
      <div v-else-if="error">
        <p>{{ t('Failed to load user data') }}</p>
      </div>
      <div v-else>
        <p>{{ t('Unauthorized!') }}</p>
      </div>
    </div>
  </header>

  <main>
    <div class="grid-container">
      <div class="mylistings" @click="router.push('/profile/listings')">
        <h6>{{ t('Your Listings') }}</h6>
        <p>{{ t('View all your posted listings') }}</p>
      </div>
      <div class="myfavorites" @click="router.push('profile/favorites')">
        <h6>{{ t('Your Favorites') }}</h6>
        <p>{{ t('View all your favorite listings') }}</p>
      </div>
    </div>
    <router-view />
  </main>
</template>

<style scoped>
.logout-button {
  margin-top: 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c82333;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.grid-container > div {
  background-color: white;
}

.mylistings,
.myfavorites {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.mylistings:hover,
.myfavorites:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h6 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 0.95rem;
  color: #666;
}
</style>
