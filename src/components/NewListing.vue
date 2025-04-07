<template>
  <form @submit.prevent="submit" class="form-container">
    <h2>{{ $t('Create a Listing') }}</h2>

    <input v-model="briefDescription" :placeholder="$t('Listing Title')" required />
    <textarea v-model="fullDescription" :placeholder="$t('Description')" required rows="5" />
    <input v-model="address" :placeholder="$t('Street address')" required />
    <input v-model="postNumber" :placeholder="$t('Postal code')" required />
    <input v-model.number="price" type="number" :placeholder="$t('Price')" required />

    <select v-model="selectedCategoryId" required>
      <option disabled value="">{{ $t('Select category') }}</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
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

    <div v-if="listingResponse">
      <label for="image-upload">{{ $t('Upload Images') }}</label>
      <input type="file" id="image-upload" @change="handleImageUpload" accept="image/*" multiple />

      <div v-if="isUploading">{{ $t('Uploading images...') }}</div>
      <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
      <div v-if="loadingPreviews">{{ $t('Loading previews...') }}</div>

      <div v-if="previews.length" class="image-grid">
        <div v-for="(url, index) in previews" :key="index">
          <img
            :src="url"
            :class="{ 'uploaded-image': true, deleted: deletedIndices.has(index) }"
            alt="Uploaded preview"
          />
          <button type="button" @click="toggleImageDelete(index)">
            {{ deletedIndices.has(index) ? $t('Undo Delete') : $t('Delete Image') }}
          </button>
        </div>
      </div>

      <button v-if="previews.length" type="button" class="save-button" @click="finalizeAndGoToListing">
        {{ $t('Save and go to listing') }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <button v-if="!listingResponse" type="submit" :disabled="loading">
      {{ loading ? $t('Submitting...') : $t('Submit Listing') }}
    </button>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { addListing } from '@/services/listingApi'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'
import { getAllCategories } from '@/services/categoryApi'
import { useImageUpload } from '@/composables/useImageUpload'
import { useImagePreviews } from '@/composables/useImagePreviews'
import { useRouter } from 'vue-router'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest, ListingResponse } from '@/types/dto'
import { useImages } from '@/composables/useImages'

const { deleteImage } = useImages()

const { t } = useI18n()
const router = useRouter()

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

const deletedIndices = ref<Set<number>>(new Set())

onMounted(async () => {
  categories.value = await getAllCategories()
})

const selectedCategory = computed(() =>
  categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null,
)

const submit = async () => {
  errorMessage.value = null
  successMessage.value = null

  if (!selectedCategory.value || !postNumber.value || !address.value || !price.value) {
    errorMessage.value = t('All fields including address and price are required.')
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
    successMessage.value = t('Listing created! Upload images below.')
    listingResponse.value = createdListing
  } catch (e) {
    errorMessage.value = t('Something went wrong while submitting.')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files || !listingResponse.value) return

  const uploaded = await uploadImages(listingResponse.value.id, files)
  await fetchPreviews(listingResponse.value.id, uploaded)
}

const toggleImageDelete = (index: number) => {
  if (deletedIndices.value.has(index)) {
    deletedIndices.value.delete(index)
  } else {
    deletedIndices.value.add(index)
  }
}

const finalizeAndGoToListing = async () => {
  if (!listingResponse.value) return
  const sorted = [...deletedIndices.value].sort((a, b) => b - a)
  for (const index of sorted) {
    await deleteImage(listingResponse.value.id, index)
  }
  router.push(`/listing/${listingResponse.value.id}`)
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #1f7a8c;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 4rem;
}

button {
  background-color: #2563eb;
  color: white;
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1e40af;
}

.save-button {
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #1f7a8c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #059669;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #4ade80;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}

.error-message {
  color: red;
  text-align: center;
}

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
  transition: 0.3s ease;
}

.deleted {
  opacity: 0.4;
  filter: grayscale(100%);
  border: 2px dashed red;
}
</style>
