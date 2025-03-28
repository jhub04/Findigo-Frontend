<script setup lang="ts">
import { useTokenStore } from '@/stores/token.ts'
import { useRouter } from 'vue-router'

const tokenStore = useTokenStore()
const router = useRouter()

const logout = () => {
  tokenStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <header class="navbar-container">
      <nav v-if="tokenStore.loggedInUser" class="main-navbar">
        <div class="navbar-brand">
          <router-link to="/home" class="app-name">Findigo</router-link>
        </div>

        <div class="navbar-menu">
          <router-link to="/map" class="nav-link">Map</router-link>
          <router-link to="/listing" class="nav-link">New Listing</router-link>
          <router-link to="/notifications" class="nav-link">
            Notifications
            <span class="notification-badge">0</span>
          </router-link>
          <router-link to="/messages" class="nav-link">Messages</router-link>

          <button @click="logout" class="logout-button">Log out</button>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.navbar-container {
  width: 100%;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
}

.app-name {
  font-weight: bold;
  color: #333;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.welcome-message {
  font-weight: bold;
  color: #333;
  margin-right: 20px;
  font-size: 1rem;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-link {
  text-decoration: none;
  color: #555;
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 4px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background-color: #e9ecef;
  color: #333;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
}

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c82333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-navbar {
    flex-direction: column;
    align-items: center;
  }

  .navbar-brand {
    margin-bottom: 15px;
  }

  .navbar-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  .nav-link {
    margin: 0 5px;
  }
}
</style>
