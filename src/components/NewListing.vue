<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { addListing } from '@/services/listingApi.ts'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest, ListingResponse } from '@/types/dto.ts'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'
import { getAllCategories } from '@/services/categoryApi.ts'
import { uploadImageToListing, getImagesFromListing } from '@/services/imageApi'

// Form input states
const briefDescription = ref('')
const fullDescription = ref('')
const postNumber = ref('')
const address = ref('')
const price = ref<number | null>(null)

const selectedCategoryId = ref<number | null>(null)
const attributeInputs = ref<Record<number, string>>({})
const listingResponse = ref<ListingResponse | null>(null)
const uploadedImageUrls = ref<string[]>([])

const categories = ref<CategoryResponse[]>([])
onMounted(async () => {
  categories.value = await getAllCategories()
})

const selectedCategory = computed(() =>
  categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null
)

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const submit = async () => {
  errorMessage.value = null
  successMessage.value = null

  if (!selectedCategory.value || !postNumber.value || !address.value || !price.value) {
    errorMessage.value = 'All fields including address and price are required.'
    return
  }

  loading.value = true
  try {
    const { latitude, longitude } = await getCoordinatesFromPostcode(postNumber.value)

    const attributes: ListingAttributeRequest[] = selectedCategory.value.attributes.map((attr) => ({
      attributeId: attr.id,
      value: attributeInputs.value[attr.id] || '',
    }))

    const payload: ListingRequest = {
      briefDescription: briefDescription.value,
      fullDescription: fullDescription.value,
      longitude,
      latitude,
      price: price.value,
      address: address.value,
      postalCode: postNumber.value,
      categoryId: selectedCategory.value.id,
      attributes,
    }

    const createdListing = await addListing(payload)
    successMessage.value = 'Listing created! Upload images below.'
    listingResponse.value = createdListing
  } catch (e) {
    errorMessage.value = 'Something went wrong while submitting.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || !listingResponse.value) return
  var numImages = 0;
  for (const file of Array.from(files)) {
    try {
      numImages = await uploadImageToListing(listingResponse.value.id, file)
    } catch (e) {
      errorMessage.value = `Error uploading ${file.name}`
      console.error(e)
    }
  }
  uploadedImageUrls.value = [];
  for (var i = 0; i < numImages; i++) {
    uploadedImageUrls.value.push(URL.createObjectURL(await getImagesFromListing(listingResponse.value.id, i)))
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="form-container">
    <h2>Create a Listing</h2>

    <input v-model="briefDescription" placeholder="Listing title" required />
    <textarea v-model="fullDescription" placeholder="Description" required rows="5" />
    <input v-model="address" placeholder="Street address" required />
    <input v-model="postNumber" placeholder="Postal code" required />
    <input v-model.number="price" type="number" placeholder="Price" required />

    <select v-model="selectedCategoryId" required>
      <option disabled value="">Select category</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
    </select>

    <div v-if="selectedCategory">
      <div v-for="attr in selectedCategory.attributes" :key="attr.id">
        <label :for="'attr-' + attr.id">{{ attr.name }}</label>
        <input
          :id="'attr-' + attr.id"
          v-model="attributeInputs[attr.id]"
          :type="attr.type === 'number' ? 'number' : 'string'"
          required
        />
      </div>
    </div>

    <div v-if="listingResponse">
      <label for="image-upload">Upload Images</label>
      <input type="file" @change="handleImageUpload" accept="image/*" multiple />

      <div v-if="uploadedImageUrls.length">
        <h4>Uploaded Images:</h4>
        <ul>
          <li v-for="(url, index) in uploadedImageUrls" :key="index">
            <img :src="url" alt="Image" class="uploaded-image" />
          </li>
        </ul>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Submitting...' : 'Submit Listing' }}
    </button>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </form>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.success-message {
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #4ade80;
  text-align: center;
}

.error-message {
  color: red;
}

.uploaded-image {
  max-width: 150px;
  margin-top: 0.5rem;
}
</style>
