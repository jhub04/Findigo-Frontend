<script setup lang="ts">
import { ref, computed } from 'vue'
import { addListing } from '@/services/listingApi.ts'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest } from '@/types/dto.ts'


const categories = ref<CategoryResponse[]>([])
const selectedCategoryId = ref<number | null>(null)

const briefDescription = ref('')
const fullDescription = ref('')
const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)
const imageUrls = ref<string[]>([''])
const attributeInputs = ref<Record<number, string>>({})

const selectedCategory = computed(() =>
  categories.value.find(c => c.id === selectedCategoryId.value)
)

const submit = async () => {
  if (!selectedCategory.value || latitude.value === null || longitude.value === null) return

  const attributes: ListingAttributeRequest[] = selectedCategory.value.attributes.map(attr => ({
    attributeId: attr.id,
    value: attributeInputs.value[attr.id] || ''
  }))

  const payload: ListingRequest = {
    briefDescription: briefDescription.value,
    fullDescription: fullDescription.value,
    longitude: longitude.value,
    latitude: latitude.value,
    categoryId: selectedCategory.value.id,
    attributes,
    imageUrls: imageUrls.value.filter(url => url.trim() !== '')
  }

  try {
    await addListing(payload)
    // Success handling (reset form, notify user etc.)
  } catch (error) {
    console.error('Failed to submit listing:', error)
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <input v-model="briefDescription" placeholder="Brief description" required />
    <textarea v-model="fullDescription" placeholder="Full description" required></textarea>

    <input v-model.number="latitude" type="number" placeholder="Latitude" required />
    <input v-model.number="longitude" type="number" placeholder="Longitude" required />

    <select v-model="selectedCategoryId" required>
      <option disabled value="">Select category</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>

    <div v-if="selectedCategory">
      <div v-for="attr in selectedCategory.attributes" :key="attr.id">
        <label>{{ attr.name }}</label>
        <input
          v-model="attributeInputs[attr.id]"
          :type="attr.type === 'number' ? 'number' : 'text'"
          :placeholder="attr.name"
          required
        />
      </div>
    </div>

    <div>
      <label>Image URLs</label>
      <div v-for="(url, index) in imageUrls" :key="index">
        <input v-model="imageUrls[index]" placeholder="Image URL" />
      </div>
      <button type="button" @click="imageUrls.push('')">Add image</button>
    </div>

    <button type="submit">Submit listing</button>
  </form>
</template>

<style scoped>
form {
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
