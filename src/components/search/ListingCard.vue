<template>
  <div class="listing-card">
    <img
      :src="imageUrl"
      alt="Listing image"
      class="listing-image"
      @error="handleImageError"
    />
    <div class="listing-info">
      <h3>{{ listing.briefDescription }}</h3>
      <p>{{ listing.price }} NOK</p>

      <div class="listing-actions">
        <button class="go-to-listing-btn" @click.stop="goToListing">
          Go to listing details &rarr;
        </button>

        <button class="favorite-btn" @click.stop="toggleFavorite">
          <!-- hjerte -->
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import noImage from '@/assets/no-image.jpg'
import type { ListingResponse } from '@/types/dto.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'

const props = defineProps<{
  listing: ListingResponse,
  imageUrl: string
}>()

const isFavorite = ref(false)
const router = useRouter()

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
}

function goToListing() {
  navigateToListing(props.listing)
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = noImage
}
</script>

<style scoped>
.listing-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem;
  width: 100%;
}

.listing-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.listing-info {
  padding: 1rem;
}

.listing-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.go-to-listing-btn {
  background: none;
  border: none;
  color: #6da9fe;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  text-decoration: none;
}

.go-to-listing-btn:hover {
  text-decoration: underline;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease;
}
</style>
