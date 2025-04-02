<template>
  <div class="listing-page">
    <div v-if="loading" class="status-message">Laster annonse...</div>
    <div v-else-if="error" class="status-message error">Fant ikke annonsen</div>

    <div v-else-if="listing" class="listing-container">
      <div class="image-section">
        <div class="main-image">
          <img 
          v-for="(url, i) in images"
          :key="i"
          :src="url || noImage"
          alt="Hovedbilde" />
        </div>
        <div class="thumbnail-row">
          <p>Fetch images here</p>
        </div>
      </div>

      <div class="text-section">
        <h1 class="title">{{ listing.briefDescription }}</h1>
        <p class="price">price here</p>

        <p class="description">{{ listing.fullDescription }}</p>

        <div class="attributes">
          <div v-for="(attribute, index) in listing.attributes" :key="index">
            {{ attribute.name }}: {{ attribute.value }}
          </div>
        </div>


        <div class="info">
          <p><strong>Bruker:</strong> {{ listing.user.username }}</p>
          <p><strong>Kategori:</strong> {{ listing.category.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import noImage from '@/assets/no-image.jpg'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ListingResponse } from '@/types/dto'
import { getListingById } from '@/services/listingApi'
import { getImagesFromListing } from '@/services/imageApi'

const images = ref<string[]>([])

const route = useRoute()
const id = Number(route.params.id)

const listing = ref<ListingResponse | null>(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const res = await getListingById(id)
    if (!res) throw new Error('Ikke funnet')
    listing.value = res
    console.log(listing.value.id)

    const imagesRes = await getImagesFromListing(listing.value.id)
    if (!imagesRes) {
      console.log("Failed to fetch images for listing " + listing.value.id)
    }
    images.value = imagesRes
  } catch (error: any) {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.listing-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.status-message {
  text-align: center;
  font-size: 18px;
}

.error {
  color: red;
}

.listing-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image img {
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.thumbnail-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
  gap: 10px;
}

.thumbnail {
  max-width: 120px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
}

.text-section {
  padding: 0 1rem;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 22px;
  color: #2e7d32;
  margin-bottom: 1rem;
}

.description {
  margin-bottom: 1rem;
}

.attributes p,
.info p {
  margin: 0.3rem 0;
}
</style>
