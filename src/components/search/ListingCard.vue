<template>
  <div class="listing-card">
    <div class="listing-info">
      <h3>{{ listing.briefDescription }}</h3>
      <p>{{ listing.price }} NOK</p>
      <button @click.stop="toggleFavorite">⭐ Favorite</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListingResponse } from '@/types/dto.ts'
defineProps<{ listing: ListingResponse }>()
function toggleFavorite() {
  // TODO: Implementer favorittlogikk (f.eks. API-kall eller lokal tilstand)
}
</script>

<style scoped>
.listing-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.listing-card:hover {
  transform: translateY(-2px);
}
.listing-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.listing-info {
  padding: 0.8rem;
}
button {
  margin-top: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
