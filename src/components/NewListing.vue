<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { addListing } from '@/services/listingApi'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'
import { getAllCategories } from '@/services/categoryApi'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest, ListingResponse } from '@/types/dto'
import { useImageUpload } from '@/composables/useImageUpload'
import { useImagePreviews } from '@/composables/useImagePreviews'

const briefDescription = ref('')
const fullDescription = ref('')
const postNumber = ref('')
const address = ref('')
const price = ref<number | null>(null)
const selectedCategoryId = ref<number | null>(null)
const attributeInputs = ref<Record<number, string>>({})
const listingResponse = ref<ListingResponse | null>(null)
const categories = ref<CategoryResponse[]>([])
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const loading = ref(false)

const { uploadImages, isUploading, uploadError } = useImageUpload()
const { previews, fetchPreviews, loadingPreviews } = useImagePreviews()

onMounted(async () => {
  categories.value = await getAllCategories()
})

const selectedCategory = computed(
  () => categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null,
)

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

  const numUploaded = await uploadImages(listingResponse.value.id, files)
  
  await fetchPreviews(listingResponse.value.id, numUploaded)
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
      <input type="file" id="image-upload" @change="handleImageUpload" accept="image/*" multiple />
      
      <div v-if="isUploading">Uploading images...</div>
      <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
      <div v-if="loadingPreviews">Loading previews...</div>
      
      <div v-if="previews.length">
        <h4>Uploaded Images:</h4>
        <div class="image-grid">
          <img
            v-for="(url, index) in previews"
            :key="index"
            :src="url"
            alt="Uploaded image"
            class="uploaded-image"
          />
        </div>
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
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.uploaded-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

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
</style>
