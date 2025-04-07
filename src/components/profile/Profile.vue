<script setup lang="ts">
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { user, isLoading, error } = useCurrentUser()
const tokenStore = useUserStore()
const router = useRouter()

const navigateToProfile = () => {
  router.push("/profile/edit")
}

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
        <p>User email</p>
        <button class="logout-button" @click="logout">Log out</button>
        <button class="edit-button" @click="navigateToProfile">To profile</button>
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
        <h6>{{ t('Your Posted Listings') }}</h6>
        <p>{{ t('View all your posted listings') }}</p>
      </div>
      <div class="myfavorites" @click="router.push('profile/favorites')">
        <h6>{{ t('Your Favorites') }}</h6>
        <p>{{ t('View all your favorite listings') }}</p>
      </div>
      <div class="myarchives" @click="router.push('profile/archives')">
        <h6>{{ t('Your Archived Listings') }}</h6>
        <p>{{ t('View all your archived listings') }}</p>
      </div>
      <div class="mypurchases" @click="router.push('profile/purchases')">
        <h6>{{ t('Your Purchased Listings') }}</h6>
        <p>{{ t('View all your previously purchased listings') }}</p>
      </div>
      <div class="mysold" @click="router.push('profile/sold')">
        <h6>{{ t('Your Sold Listings') }}</h6>
        <p>{{ t('View all your previously sold listings') }}</p>
      </div>
    </div>
    <router-view />
  </main>
</template>

<style scoped>
.logout-button {
  margin-top: 15px;
  margin-right: 10px; /* space between buttons */
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

.edit-button {
  margin-top: 15px;
  background-color: #1F7A8C; /* Teal */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #022B3A; /* Gunmetal for hover effect */
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
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-align: center;
}

.grid-container > div:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.grid-container h6 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
}

.grid-container p {
  font-size: 0.95rem;
  color: #666;
}

</style>
