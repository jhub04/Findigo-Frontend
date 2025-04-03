<script setup lang="ts">
import noImage from '@/assets/no-image.jpg'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ListingResponse } from '@/types/dto'
import { getListingById } from '@/services/listingApi'
import { getImageByIndex } from '@/services/imageApi'

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
  } catch (error: any) {
    error.value = true
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
        <div class="listing-images">
          <div class="listing-images__main">
            <img
              v-for="(url, i) in images"
              :key="i"
              :src="url || noImage"
              :alt="`Image ${i + 1}`"
              class="listing-image"
            />
          </div>
        </div>

        <div class="listing-content">
          <div class="listing-header">
            <h1 class="listing-title">{{ listing.briefDescription }}</h1>
            <p class="listing-price">price here</p>
          </div>

          <p class="listing-description">{{ listing.fullDescription }}</p>

          <div class="listing-attributes">
            <div
              class="listing-attribute"
              v-for="(attribute, index) in listing.attributes"
              :key="index"
            >
              <strong>{{ attribute.name }}:</strong> {{ attribute.value }}
            </div>
          </div>

          <div class="listing-user-info">
            <p><strong>Owner:</strong> {{ listing.user.username }}</p>
            <p><strong>Category:</strong> {{ listing.category.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.listing-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.loading-message,
.error-message {
  text-align: center;
  font-size: 18px;
}

.error-message {
  color: red;
}

.listing {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.listing-images {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listing-images__main img {
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.listing-content {
  padding: 0 1rem;
}

.listing-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.listing-title {
  font-size: 28px;
  font-weight: bold;
}

.listing-price {
  font-size: 22px;
  color: #2e7d32;
}

.listing-description {
  margin: 1rem 0;
}

.listing-attributes {
  margin-top: 1rem;
}

.listing-attribute {
  margin-bottom: 0.4rem;
}

.listing-user-info {
  margin-top: 1.5rem;
}
</style>
