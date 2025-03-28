<script setup lang="ts">
import { ref } from "vue";
import { useTokenStore } from '@/stores/token.ts'
import { useRouter } from 'vue-router'

const tokenStore = useTokenStore()
const router = useRouter()

//TODO: fetch from database
const username = ref("Dummy");
const email = ref("dummy@gmail.com");

const logout = () => {
  tokenStore.logout()
  router.push('/login')
}

</script>

<template>
    <header class="userdetails">
        <h3>{{ username }}</h3>
        <p> {{ email }}</p>
        <button class="logout-button" @click="logout">Log out</button>
    </header>
    <main>
        <div class="grid-container">
            <div class="mylistings">
                <h6>My Listings</h6>
                <p>View all your posted listings</p>
            </div>
            <div class="myfavorites">
                <h6>Favorites</h6>
                <p>View all your favorite listings</p>
            </div>
        </div>
    </main>
</template>

<style scoped>
.userdetails {
  padding: 30px 20px;
  text-align: center;
}

.userdetails h3 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.userdetails p {
  font-size: 1rem;
  color: #666;
}

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

.mylistings,
.myfavorites {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
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


