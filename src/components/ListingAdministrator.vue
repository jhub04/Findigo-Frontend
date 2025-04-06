<template>
  <div class="admin-listing-container" v-if="listing">
    <h1>Administrer annonse</h1>

    <div class="listing-header">
      <div class="listing-info">
        <span class="status">Aktiv</span>
        <span>{{ listing.dateCreated.slice(0, 10) }}</span>
        <h2>{{ listing.briefDescription }}</h2>
        <p>{{ listing.price }} kr</p>
        <p>{{ listing.address }}, {{ listing.postalCode }}</p>
      </div>
    </div>

    <div class="actions">
      <button @click="editListing">Endre annonse</button>
      <button @click="viewListing">Se annonse</button>
      <button @click="deleteListing">Slett annonse</button>
    </div>

    <div class="stats">
      <h3>Statistikk</h3>
      <ul>
        <li>Klikk på annonsen: <strong>0</strong></li>
        <li>Lagret som favoritt: <strong>0</strong></li>
        <li>Sendte meldinger: <strong>0</strong></li>
      </ul>
    </div>
  </div>

  <p v-else>Henter annonse...</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ListingResponse } from '@/types/dto.ts'
import { getListingById, deleteListingById } from '@/services/listingApi.ts'

const route = useRoute()
const router = useRouter()
const listing = ref<ListingResponse | null>(null)

const listingId = Number(route.params.id)

onMounted(async () => {
  listing.value = await getListingById(listingId) //endre til admingetlisting metode
})

function editListing() {
  router.push(`/edit-my-listing/${listingId}`)
}

function viewListing() {
  router.push(`/listing/${listingId}`)
}

async function deleteListing() {
  if (confirm('Er du sikker på at du vil slette annonsen?')) {
    try {
      await deleteListingById(listingId)
      alert('Annonse slettet!')
      await router.push('/home') // Eller hvor du ønsker å navigere
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Feil ved sletting av annonse.')
    }
  }
}
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
  margin-bottom: 20px;
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
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #1f7a8c;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.actions button:hover {
  background-color: #022b3a;
}

.stats h3 {
  margin-bottom: 10px;
}

.stats ul {
  list-style: none;
  padding: 0;
}

.stats li {
  margin-bottom: 5px;
}
</style>
