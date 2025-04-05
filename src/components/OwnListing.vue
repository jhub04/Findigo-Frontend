<template>
  <div class="admin-listing-container">
    <h1>Administrer annonsen</h1>

    <div class="listing-header">
      <img :src="listing.imageUrl" alt="listing image">
      <div class="listing-info">
        <span class="status">{{ listing.status }}</span>
        <span>{{ listing.daysLeft }} dager igjen</span>
        <span>Endret {{ listing.lastEdited }}</span>
        <h2>{{ listing.title }}</h2>
        <p>Torget til salgs {{ listing.price }} kr</p>
      </div>
    </div>

    <div class="actions">
      <button @click="markAsSold">Marker som solgt</button>
      <button @click="editListing">Endre annonse</button>
      <button @click="viewListing">Se annonse</button>
      <button @click="deleteListing">Slett</button>
    </div>

    <div class="stats">
      <h3>Statistikk</h3>
      <ul>
        <li>Klikk på annonsen: <strong>{{ listing.stats.clicks }}</strong></li>
        <li>Lagret som favoritt: <strong>{{ listing.stats.favorites }}</strong></li>
        <li>Sendte meldinger: <strong>{{ listing.stats.messages }}</strong></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const listing = ref({
  imageUrl: '/path/to/image.jpg',
  status: 'Aktiv',
  daysLeft: 42,
  lastEdited: '25. mars 2025',
  title: 'annonse 1',
  price: 999,
  stats: {
    clicks: 770,
    favorites: 17,
    messages: 1
  }
});

const markAsSold = () => alert('Markert som solgt');
const editListing = () => alert('Rediger annonse');
const viewListing = () => alert('Vis annonse');
const deleteListing = () => alert('Slett annonse');
</script>

<style scoped>
.admin-listing-container {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  margin-bottom: 20px;
}

.listing-header {
  display: flex;
  gap: 20px;
}

.listing-header img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.listing-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status {
  background-color: #d4f4dd;
}

</style>
