<script setup lang="ts">
import NavBar from './components/nav/NavBar.vue';
</script>

<template>
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

