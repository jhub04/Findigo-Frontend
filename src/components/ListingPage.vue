<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ListingResponse } from '@/types/dto'
import { getListingById } from '@/services/listingApi'
import ImageSlideshow from './ImageSlideshow.vue'
import { useImages } from '@/utils/useImages'
import { useFavorites } from '@/utils/useFavorites'

const { images, loading, error, fetchImagesForListing } = useImages()
const { favorites, addToFavorites, removeFromFavorites, isFavorited, fetchFavorites } =
  useFavorites()

const route = useRoute()
const id = Number(route.params.id)
const listing = ref<ListingResponse | null>(null)

const formatDate = (iso: string) => new Date(iso).toLocaleString()

onMounted(async () => {
  try {
    const currentListing = await getListingById(id)
    if (!currentListing) throw new Error('Listing not found')
    listing.value = currentListing

    if (listing.value.numberOfImages > 0) {
      await fetchImagesForListing(listing.value.id, listing.value.numberOfImages)
    }

    await fetchFavorites()
  } catch (error: any) {
    error.value = true
    console.error(error)
  } finally {
    loading.value = false
  }
})

const toggleFavorite = async () => {
  if (!listing.value) return
  if (isFavorited(listing.value.id)) {
    console.log('Removing from favorites')
    await removeFromFavorites(listing.value.id)
  } else {
    console.log('Adding to favorites')
    await addToFavorites(listing.value.id)
  }
}
</script>

<template>
  <main>
    <div class="listing-page">
      <div v-if="loading" class="loading-message">Loading listing...</div>
      <div v-else-if="error" class="error-message">Could not find listing.</div>

      <div v-else-if="listing" class="listing">
        <div class="listing-image-wrapper">
          <div class="favorite-icon-wrapper" @click="toggleFavorite">
            <v-icon
              :name="isFavorited(listing.id) ? 'oi-star-fill' : 'md-staroutline-round'"
              scale="2"
              fill="gold"
              class="favorite-icon"
            />
          </div>

          <div class="image-slideshow">
            <ImageSlideshow :images="images" />
          </div>
        </div>

        <div class="listing-info-container">
          <div class="listing-details">
            <h1 class="title">{{ listing.briefDescription }}</h1>
            <p class="price">{{ listing.price }} NOK</p>

            <button class="buy-button">Buy Now</button>

            <p class="description">{{ listing.fullDescription }}</p>
            <p class="location">{{ listing.postalCode }}, {{ listing.address }}</p>

            <div class="listing-attributes" v-if="listing.attributes?.length">
              <h2>Details</h2>
              <ul>
                <li v-for="(attribute, index) in listing.attributes" :key="index">
                  <strong>{{ attribute.name }}:</strong> {{ attribute.value }}
                </li>
              </ul>
              <h6>Created at: {{ formatDate(listing.dateCreated) }}</h6>
            </div>
          </div>

          <div class="contact-info">
            <h2>Seller</h2>
            <p>Username: {{ listing.user.username }}</p>
            <p>Phone number: 416 72 162</p>
            <router-link :to="`/messages/${listing.user.id}`">
              <button class="send-message-button">Send Message</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.listing-image-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.favorite-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 50%;
  height: 48px;
  width: 48px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.favorite-icon-wrapper:hover {
  background-color: #f5f5f5;
}

.favorite-icon {
  transition: transform 0.2s ease;
}

.favorite-icon:hover {
  transform: scale(1.1);
}


.listing-info-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 2rem;
}

.listing-details {
  flex: 2;
}

.contact-info {
  flex: 1;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.listing-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  padding: 1rem;
}

.image-slideshow {
  margin-bottom: 2rem;
}

.listing-info {
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fafafa;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.buy-button {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.buy-button:hover {
  background-color: #218838;
}

.description {
  margin-bottom: 1rem;
}

.location {
  color: #555;
  margin-bottom: 1.5rem;
}

.listing-attributes {
  margin-bottom: 2rem;
}

.listing-attributes h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.listing-attributes ul {
  list-style: none;
  padding: 0;
}

.listing-attributes li {
  margin-bottom: 0.4rem;
}

.contact-info {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.contact-info h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.send-message-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-message-button:hover {
  background-color: #0056b3;
}
</style>
