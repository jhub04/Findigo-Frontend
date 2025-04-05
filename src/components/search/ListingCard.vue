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

        <button class="favorite-btn" @click.stop="toggleFavorite" :aria-label="isFavorite ? 'Unfavorite' : 'Favorite'">
          <v-icon
            :name="isFavorite ? 'oi-star-fill' : 'md-staroutline-round'"
            scale="1.8"
            fill="gold"
          />
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import noImage from '@/assets/no-image.jpg'
import type { ListingResponse } from '@/types/dto.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import { useFavorites } from '@/composables/useFavorites'

const props = defineProps<{
  listing: ListingResponse,
  imageUrl: string
}>()

const router = useRouter()
const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites()

const isFavorite = computed(() => isFavorited(props.listing.id))

async function toggleFavorite() {
  if (isFavorite.value) {
    await removeFromFavorites(props.listing.id)
  } else {
    await addToFavorites(props.listing.id)
  }
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
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}
.favorite-btn:focus {
  outline: none;
}
.favorite-btn:active {
  transform: scale(0.95);
}

</style>
