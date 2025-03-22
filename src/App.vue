<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>

    <div class="wrapper">

      <nav>
        <RouterLink to="/">Findigo</RouterLink>
        <input type="text" placeholder="Search..">
        <RouterLink to="/map">Map</RouterLink>
        <RouterLink to="/listing">New Listing</RouterLink>
        <RouterLink to="/notifications">Notifications</RouterLink>
        <RouterLink to="messages">Messages</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 1.5rem;
  align-items: center;
  background-color: #5B95E6;
  padding: 25px;
}

a {
  text-decoration: none;
  color: inherit;
  font-weight: 500;
}

a.router-link-active {
  font-weight: bold;
}

input[type=text] {
  border: none;
  border-radius: 5px;

}

</style>
