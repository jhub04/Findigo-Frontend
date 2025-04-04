<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ListingResponse } from '@/types/dto'
import { getListingById } from '@/services/listingApi'
import ImageSlideshow from './ImageSlideshow.vue'
import { useImages } from '@/utils/useImages'

const { images, loading, error, fetchImagesForListing } = useImages()
const route = useRoute()
const id = Number(route.params.id)
const listing = ref<ListingResponse | null>(null)

onMounted(async () => {
  try {
    const currentListing = await getListingById(id)
    if (!currentListing) throw new Error('Listing not found')
    listing.value = currentListing

    if (listing.value.numberOfImages > 0) {
      await fetchImagesForListing(listing.value.id, listing.value.numberOfImages)
    }
  } catch (error: any) {
    error.value = true
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main>
    <div class="listing-page">
      <div v-if="loading" class="loading-message">Loading listing...</div>
      <div v-else-if="error" class="error-message">Could not find listing.</div>

      <div v-else-if="listing" class="listing">
        <div class="image-slideshow">
          <ImageSlideshow :images="images" />
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
