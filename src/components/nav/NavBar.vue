<template>
  <header class="navbar-container">
    <nav class="main-navbar" id="main-navbar">
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
        <router-link
          :to="isAuthenticated ? '/profile' : '/login'"
          class="nav-link"
          id="profile"
        >
          {{ isAuthenticated ? $t('My Profile') : $t('Log in') }}
          <v-icon name="md-accountcircle" />
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
            <div
              class="nav-link"
              :class="{ disabled: !isAuthenticated }"
              @click="handleClick('/listing')"
            >
              {{ $t('New Listing') }} <v-icon name="io-add-circle-sharp" />
            </div>

            <div
              class="nav-link"
              :class="{ disabled: !isAuthenticated }"
              @click="handleClick('/messages')"
            >
              {{ $t('Messages') }} <v-icon name="md-message" />
            </div>

            <router-link
              :to="isAuthenticated ? '/profile' : '/login'"
              class="nav-link"
              id="profile"
            >
              {{ isAuthenticated ? $t('My Profile') : $t('Log in') }}
              <v-icon name="md-accountcircle" />
            </router-link>

            <!-- ✅ Admin knapp desktop -->
            <router-link v-if="isAdmin" to="/admin" class="nav-link">
              {{ $t('Admin') }} <v-icon name="md-adminpanelsettings" />
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
      <router-link v-if="isAuthenticated" to="/listing" class="nav-link" @click="closeMenu">
        {{ $t('New Listing') }} <v-icon name="io-add-circle-sharp" />
      </router-link>
      <router-link v-if="isAuthenticated" to="/messages" class="nav-link" @click="closeMenu">
        {{ $t('Messages') }} <v-icon name="md-message" />
      </router-link>

      <router-link to="/profile" class="nav-link" @click="closeMenu">
        {{ $t('My Profile') }} <v-icon name="md-accountcircle" />
      </router-link>
      <router-link v-if="isAdmin" to="/admin" class="nav-link" @click="closeMenu">
        {{ $t('Admin') }} <v-icon name="md-adminpanelsettings" />
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user.ts'
import NavigationSearch from '@/components/search/NavigationSearchBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (path: string) => {
  if (isAuthenticated.value) {
    router.push(path)
  } else {
    router.push('/login')
  }
}

const userStore = useUserStore()

const isAuthenticated = computed<boolean>(() => userStore.authenticated)
const isAdmin = computed(() => userStore.isAdmin())

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

.disabled {
  opacity: 0.5;
  cursor: pointer;
}

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
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.main-navbar::-webkit-scrollbar {
  display: none;
}

.navbar-brand {
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
}

.app-name {
  font-weight: bold;
  color: #bfdbf7;
  font-size: 1.5rem;
  text-decoration: none;
  transition: transform 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
  white-space: nowrap;
}

.app-name:hover {
  transform: scale(1.05);
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.navbar-menu {
  display: flex;
  flex: 1 1 auto;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.nav-search-container {
  flex: 1 1 0;
  min-width: 100px;
  margin: 0 10px;
}

.navbar-links {
  display: flex;
  flex: 1 1 0;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
  min-width: 0;
  white-space: nowrap;
}

.nav-link {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  text-decoration: none;
  color: white;
  font-size: 0.85rem;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
  min-width: 0;
  cursor: pointer;
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
  flex-wrap: nowrap;
}

/* ✅ MOBILVISNING */
.navbar-mobile {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  column-gap: 12px;
}

.navbar-mobile .hamburger {
  justify-self: start;
}

.navbar-mobile .navbar-brand {
  justify-self: start;
}

.navbar-mobile .nav-link#profile {
  justify-self: end;
  white-space: nowrap;
  margin-right: 28px;
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

/* Responsive fine-tuning */
@media (max-width: 992px) and (min-width: 769px) {
  .nav-search-container {
    max-width: 350px;
  }
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
</style>
