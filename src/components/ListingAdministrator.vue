<template>
  <div>
    <div v-if="loading" class="skeleton-container">
      <div class="skeleton-header"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-actions">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
        <div class="skeleton-button delete"></div>
      </div>
      <div class="skeleton-stats">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>

    <div class="listing-container" v-else-if="listing">
      <h1>Manage Listing</h1>

      <div class="listing-header">
        <div class="listing-info">
          <span class="status">Active</span>
          <span class="date">{{ listing.dateCreated.slice(0, 10) }}</span>
          <h2>{{ listing.briefDescription }}</h2>
          <p class="price">{{ listing.price }} kr</p>
          <p>{{ listing.address }}, {{ listing.postalCode }}</p>
        </div>
      </div>

      <div class="actions">
        <button @click="editListing">
          Edit Listing
        </button>
        <button @click="viewListing">
          View Listing
        </button>
        <button class="delete-button" @click="openConfirmPopup">
          Delete Listing
        </button>
      </div>

      <div class="stats">
        <h3>Statistics</h3>
        <ul>
          <li>Views: <strong>0</strong></li>
          <li>Favorites: <strong>0</strong></li>
          <li>Messages: <strong>0</strong></li>
        </ul>
      </div>
    </div>

    <p v-else class="loading-text">Loading listing...</p>

    <!-- Confirmation Popup -->
    <div v-if="showConfirmPopup" class="confirm-overlay">
      <div class="confirm-box">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this listing?</p>
        <div class="confirm-actions">
          <button @click="deleteListing" class="confirm-delete">Yes, delete</button>
          <button @click="showConfirmPopup = false" class="confirm-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ListingResponse } from '@/types/dto.ts'
import { getListingById, deleteListingById } from '@/services/listingApi.ts'

const route = useRoute()
const router = useRouter()
const listing = ref<ListingResponse | null>(null)
const showConfirmPopup = ref(false)
const loading = ref(true)

const listingId = Number(route.params.id)

onMounted(async () => {
  try {
    listing.value = await getListingById(listingId) // senere: admin/owner-specific metode
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

function editListing() {
  router.push(`/edit-my-listing/${listingId}`)
}

function viewListing() {
  router.push(`/listing/${listingId}`)
}

function openConfirmPopup() {
  showConfirmPopup.value = true
}

async function deleteListing() {
  try {
    await deleteListingById(listingId)
    alert('Listing deleted!')
    await router.push('/home')
  } catch (error) {
    console.error('Error deleting listing:', error)
    alert('Error deleting listing.')
  } finally {
    showConfirmPopup.value = false
  }
}
</script>

<style scoped>
/* Container */
.listing-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #e1e5f2;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .listing-container {
    padding: 1.5rem;
  }
}

h1 {
  text-align: center;
  color: #022b3a;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.listing-header {
  margin-bottom: 1.5rem;
}

.listing-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status {
  background-color: #d4f4dd;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  width: fit-content;
  color: #166534;
  font-weight: 600;
}

.date {
  font-size: 0.85rem;
  color: #555;
}

.price {
  font-weight: 600;
  color: #022b3a;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.actions button {
  flex: 1 1 45%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: #1f7a8c;
  color: white;
}

.actions button:hover {
  background-color: #022b3a;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.stats {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stats h3 {
  margin-bottom: 1rem;
  color: #022b3a;
}

.stats ul {
  list-style: none;
  padding: 0;
}

.stats li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #022b3a;
}

.loading-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
  color: #555;
}

/* Skeleton Loader */
.skeleton-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #e1e5f2;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  animation: pulse 1.5s infinite;
}

.skeleton-header {
  width: 60%;
  height: 20px;
  background-color: #cfd8dc;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-line {
  width: 100%;
  height: 14px;
  background-color: #cfd8dc;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-line.short {
  width: 50%;
}

.skeleton-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.skeleton-button {
  flex: 1 1 30%;
  height: 40px;
  background-color: #cfd8dc;
  border-radius: 6px;
}

.skeleton-button.delete {
  background-color: #ef9a9a;
}

.skeleton-stats {
  margin-top: 1rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Confirm Popup */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.confirm-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.confirm-box h3 {
  margin-bottom: 1rem;
  color: #022b3a;
}

.confirm-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.confirm-actions button {
  flex: 1 1 45%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-delete {
  background-color: #dc3545;
  color: white;
}

.confirm-delete:hover {
  background-color: #c82333;
}

.confirm-cancel {
  background-color: #1f7a8c;
  color: white;
}

.confirm-cancel:hover {
  background-color: #022b3a;
}
</style>
