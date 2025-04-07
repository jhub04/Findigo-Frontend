<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ListingResponse } from '@/types/dto'
import { getListingById } from '@/services/listingApi'
import ImageSlideshow from './ImageSlideshow.vue'
import { useImages } from '@/composables/useImages'
import { useFavorites } from '@/composables/useFavorites'
import { useI18n } from 'vue-i18n'
import router from '@/router'

const { t } = useI18n()
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
  } catch (e: any) {
    error.value = t('Failed to load listing')
    console.error(e)
  } finally {
    loading.value = false
  }
})

const toggleFavorite = async () => {
  if (!listing.value) return
  if (isFavorited(listing.value.id)) {
    await removeFromFavorites(listing.value.id)
  } else {
    await addToFavorites(listing.value.id)
  }
}
</script>

<template>
  <main>
    <div class="listing-page">
      <div v-if="loading" class="loading-message">{{ t('Loading listing...') }}</div>
      <div v-else-if="error" class="error-message">{{ t('Could not find listing.') }}</div>

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

            <button class="buy-button" @click="router.push(`/listing/${listing.id}/checkout`)">{{ t('Buy Now') }}</button>

            <p class="description">{{ listing.fullDescription }}</p>
            <p class="location">{{ listing.postalCode }}, {{ listing.address }}</p>

            <div class="listing-attributes" v-if="listing.attributes?.length">
              <h2>{{ t('Details') }}</h2>
              <ul>
                <li v-for="(attribute, index) in listing.attributes" :key="index">
                  <strong>{{ attribute.name }}:</strong> {{ attribute.value }}
                </li>
              </ul>
              <h6>{{ t('Created at:') }} {{ formatDate(listing.dateCreated) }}</h6>
            </div>
          </div>

          <div class="contact-info">
            <h2>{{ t('Seller') }}</h2>
            <p>{{ t('Username') }}: {{ listing.user.username }}</p>
            <p v-if="listing.user.phoneNumber">{{ t('Phone number') }}: {{ listing.user.phoneNumber }}</p>
            <router-link :to="`/messages/${listing.user.id}`">
              <button class="send-message-button">{{ t('Send Message') }}</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Main listing page container */
.listing-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Loading and error messages */
.loading-message,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  padding: 1rem;
  color: #555;
}

/* Listing image section */
.listing-image-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

/* Favorite icon */
.favorite-icon-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
  z-index: 1;
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

/* Image slideshow container */
.image-slideshow {
  margin-bottom: 1rem;
}

/* Listing info container */
.listing-info-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

/* Listing details section */
.listing-details {
  flex: 2;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.price {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #28a745;
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
  transition: background-color 0.3s ease;
}

.buy-button:hover {
  background-color: #218838;
}

.description {
  margin-bottom: 1rem;
  line-height: 1.5;
  color: #444;
}

.location {
  color: #555;
  margin-bottom: 1.5rem;
}

/* Listing attributes section */
.listing-attributes {
  margin-top: 1rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
}

.listing-attributes h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.listing-attributes ul {
  list-style: none;
  padding: 0;
}

.listing-attributes li {
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  color: #666;
}

.listing-attributes h6 {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #999;
}

/* Contact info section */
.contact-info {
  flex: 1;
  padding: 1rem;
  background-color: #f7f7f7;
  border: 1px solid #eee;
  border-radius: 8px;
  min-width: 250px;
}

.contact-info h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.contact-info p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.send-message-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-message-button:hover {
  background-color: #0056b3;
}

</style>
