<template>
  <form @submit.prevent="submit" class="form-container">
    <h2>Edit Listing (Admin)</h2>

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
      <div v-for="attr in selectedCategory.attributes" :key="attr.id" class="form-group">
        <label :for="'attr-' + attr.id">{{ attr.name }}</label>
        <input
          :id="'attr-' + attr.id"
          v-model="attributeInputs[attr.id]"
          :type="attr.type === 'number' ? 'number' : 'text'"
          required
        />
      </div>
    </div>

    <!--
    <div>
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
    -->

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div class="button-group">
      <button class="save-button" type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
      <button class="cancel-button" type="button" @click="cancelEdit">
        Cancel
      </button>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { editListing, getListingById } from '@/services/listingApi'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'
import { getAllCategories } from '@/services/categoryApi'
import { useImageUpload } from '@/composables/useImageUpload'
import { useImagePreviews } from '@/composables/useImagePreviews'
import { useRoute, useRouter } from 'vue-router'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest, ListingResponse } from '@/types/dto'
import { handleApiError } from '@/utils/handleApiError.ts'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const briefDescription = ref('')
const fullDescription = ref('')
const postNumber = ref('')
const address = ref('')
const price = ref<number | null>(null)
const selectedCategoryId = ref<number | null>(null)
const attributeInputs = ref<Record<number, string>>({})
const categories = ref<CategoryResponse[]>([])
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const loading = ref(false)

const { uploadImages, isUploading, uploadError } = useImageUpload()
const { previews, fetchPreviews, loadingPreviews } = useImagePreviews()

onMounted(async () => {
  try {
    categories.value = await getAllCategories()

    const listing: ListingResponse = await getListingById(id)
    briefDescription.value = listing.briefDescription
    fullDescription.value = listing.fullDescription
    postNumber.value = listing.postalCode
    address.value = listing.address
    price.value = listing.price
    selectedCategoryId.value = listing.category.id

    // Fyll ut attributter
    listing.attributes.forEach(attr => {
      const matchingAttribute = selectedCategory.value?.attributes.find(a => a.name === attr.name)
      if (matchingAttribute) {
        attributeInputs.value[matchingAttribute.id] = attr.value
      }
    })

    await fetchPreviews(listing.id, listing.numberOfImages)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to load listing data.'
  }
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
    console.log(payload)
    await editListing(id, payload)
    successMessage.value = 'Listing updated successfully!'
  } catch (e) {
    errorMessage.value = handleApiError(e)
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const numUploaded = await uploadImages(id, files)
  await fetchPreviews(id, numUploaded)
}

function cancelEdit() {
  router.push(`/admin/listings/${id}`)
}
</script>

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

textarea {
  resize: vertical;
  min-height: 3rem;
  font-size: 1rem;
  padding: 0.75rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.save-button {
  background-color: #1f7a8c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #022b3a;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #c82333;
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
