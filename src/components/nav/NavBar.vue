<script setup lang="ts">
import { useUserStore } from '@/stores/user.ts'
import NavigationSearch from '@/components/search/NavigationSearchBar.vue'
import { ref, onMounted, computed } from 'vue';

const userStore = useUserStore();

const isAuthenticated = computed(() => userStore.authenticated)


</script>

<template>
    <header class="navbar-container">
      <nav v-if="isAuthenticated" class="main-navbar">
        <div class="navbar-brand">
          <router-link to="/home" class="app-name">Findigo</router-link>
        </div>

        <NavigationSearch class="nav-search" />

        <div class="navbar-menu">
          <router-link to="/map" class="nav-link">Map</router-link>
          <router-link to="/listing" class="nav-link">New Listing</router-link>
          <router-link to="/messages" class="nav-link">Messages</router-link>
          <router-link to="/profile" class="nav-link" id="profile">My Profile</router-link>
        </div>
      </nav>
    </header>
</template>

<style scoped>

.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #022B3A;
  font-weight: 900;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: nowrap;
  padding: 15px 20px;
}

.nav-search {
  margin: 0 20px;
}

.app-name {
  font-weight: bold;
  color: #bfdbf7;
  font-size: 1.5rem;
  text-decoration: none;
  transition:
    transform 0.3s ease,
    color 0.3s ease,
    text-shadow 0.3s ease;
}

.app-name:hover {
  transform: scale(1.05);
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}


.navbar-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;

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
  white-space: nowrap;
  text-decoration: none;
  color: white;
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
