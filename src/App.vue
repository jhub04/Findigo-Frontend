<script setup lang="ts">

import { useTokenStore } from '@/stores/token.ts'
import { useRouter } from 'vue-router'

const tokenStore = useTokenStore();
const router = useRouter();

const logout = () => {
  tokenStore.logout();
  router.push("/login");
};

</script>

<template>
  <div>
    <nav v-if="tokenStore.loggedInUser">
      <span>Welcome, {{ tokenStore.loggedInUser }}!</span>
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/listing">New Listing</router-link>
      <router-link to="/notifications">Notifications</router-link>
      <router-link to="/messages">Messages</router-link>
      <button @click="logout">Log out</button>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
nav {
  text-align: center;
  margin-bottom: 20px;
}
</style>