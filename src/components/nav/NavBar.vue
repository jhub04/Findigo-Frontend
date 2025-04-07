<template>
  <header class="navbar-container">
    <nav v-if="isAuthenticated" class="main-navbar" id="main-navbar">
      <!-- Mobilvisning -->
      <div class="navbar-mobile" v-if="isMobile">
        <button class="hamburger" @click="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="navbar-brand">
          <router-link to="/home" class="app-name">Findigo</router-link>
        </div>
        <router-link to="/profile" class="nav-link" id="profile">
          {{ $t('My Profile') }} <v-icon name="md-accountcircle" />
        </router-link>
      </div>

      <!-- Desktopvisning -->
      <div class="navbar-desktop" v-else>
        <div class="navbar-brand">
          <router-link to="/home" class="app-name">Findigo</router-link>
        </div>
        <div class="navbar-menu">
          <div class="nav-search-container">
            <NavigationSearch/>
          </div>
          <div class="navbar-links">
            <router-link to="/map" class="nav-link">
              {{ $t('Map') }} <v-icon name="fa-map"/>
            </router-link>
            <router-link to="/listing" class="nav-link">
              {{ $t('New Listing') }} <v-icon name="io-add-circle-sharp"/>
            </router-link>
            <router-link to="/messages" class="nav-link">
              {{ $t('Messages') }} <v-icon name="md-message"/>
            </router-link>
            <router-link to="/profile" class="nav-link" id="profile">
              {{ $t('My Profile') }} <v-icon name="md-accountcircle"/>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Utvidet mobilmeny -->
    <div v-if="isAuthenticated && isMobile && menuOpen" class="mobile-menu">
      <div class="mobile-search-container">
        <NavigationSearch/>
      </div>
      <router-link to="/map" class="nav-link" @click="closeMenu">
        {{ $t('Map') }} <v-icon name="fa-map" />
      </router-link>
      <router-link to="/listing" class="nav-link" @click="closeMenu">
        {{ $t('New Listing') }} <v-icon name="io-add-circle-sharp" />
      </router-link>
      <router-link to="/messages" class="nav-link" @click="closeMenu">
        {{ $t('Messages') }} <v-icon name="md-message" />
      </router-link>
      <router-link to="/profile" class="nav-link" @click="closeMenu">
        {{ $t('My Profile') }} <v-icon name="md-accountcircle" />
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import NavigationSearch from '@/components/search/NavigationSearchBar.vue'

const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.authenticated)

const menuOpen = ref(false)
const isMobile = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

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
  padding: 15px 20px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.app-name {
  font-weight: bold;
  color: #bfdbf7;
  font-size: 1.5rem;
  text-decoration: none;
  transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
}

.app-name:hover {
  transform: scale(1.05);
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.navbar-menu {
  display: flex;
  align-items: center;
  flex-grow: 1;
  width: 100%;
}

.nav-search-container {
  flex: 1;
  max-width: 500px;
  min-width: 250px;
  margin: 0 20px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 15px;
  white-space: nowrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  text-decoration: none;
  color: white;
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link svg {
  margin-left: 4px;
}

.nav-link:hover {
  background-color: #e9ecef;
  color: #333;
}

.navbar-desktop {
  display: flex;
  width: 100%;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar-desktop {
    display: none;
  }

  .navbar-mobile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 20px;
  }

  .hamburger {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    color: white;
  }

  .hamburger svg {
    width: 24px;
    height: 24px;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 20px 10px;
    background-color: #022B3A;
  }

  .mobile-search-container {
    width: 100%;
    margin-bottom: 10px;
  }
}

@media (max-width: 992px) and (min-width: 769px) {
  .nav-search-container {
    max-width: 350px;
  }

  @media (min-width: 1200px) {
    .main-navbar {
      padding: 15px 40px;
    }

    .navbar-links {
      gap: 20px;
    }

    .nav-search-container {
      max-width: 600px;
    }
  }
  @media (min-width: 993px) and (max-width: 1399px) {
    .navbar-links {
      gap: 10px;
    }
    .nav-link {
      font-size: 0.85rem;
      padding: 6px 8px;
    }
  }
  @media (max-width: 1024px) and (min-width: 769px) {
    .nav-search-container {
      max-width: 300px;
      margin: 0 10px;
    }

    .navbar-links {
      gap: 8px;
    }
  }
  .navbar-links {
    gap: 10px;
  }

  .nav-link {
    padding: 6px 8px;
    font-size: 0.85rem;
  }
}
</style>
