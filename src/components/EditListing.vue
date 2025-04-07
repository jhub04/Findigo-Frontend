<template>
  <form @submit.prevent="submit" class="form-container">
    <h2>Edit Listing</h2>

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

    <transition name="fade">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </transition>

    <div class="button-group">
      <button class="save-button" type="submit" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <span v-else>Save Changes</span>
      </button>
      <button class="cancel-button" type="button" @click="cancelEdit">
        Cancel
      </button>
    </div>

    <transition name="fade">
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </transition>
  </form>

  <div class="edit-images">
    <div class="image-grid">
      <div v-for="(image, index) in images" :key="index">
        <img class="uploaded-image" :class="{deleted: imagesToDelete.has(index)}" :src="image"/>
        <button v-if="!imagesToDelete.has(index)" @click="deleteImageByIndex(index)" class="delete-button">Delete image</button>
        <button v-else @click="undoDelete(index)" class="undo-button">Undo delete</button>
      </div>
    </div>

    <input type="file" multiple accept="image/*" @change="handleImageUpload"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { editListing, getListingById } from '@/services/listingApi'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'
import { getAllCategories } from '@/services/categoryApi'
import { useRoute, useRouter } from 'vue-router'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest, ListingResponse } from '@/types/dto'
import { handleApiError } from '@/utils/handleApiError.ts'
import { useImages } from '@/composables/useImages'
import { useImageUpload } from '@/composables/useImageUpload'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const { images, fetchImagesForListing, deleteImage } = useImages()
const { uploadImages } = useImageUpload()

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
let listing: ListingResponse
const imagesToDelete = ref<Set<number>>(new Set<number>())
const newImagesUploadedIndices = ref<Set<number>>(new Set<number>())

onMounted(async () => {
  try {
    categories.value = await getAllCategories()
    listing = await getListingById(id)
    await fetchImagesForListing(listing.id, listing.numberOfImages)
    briefDescription.value = listing.briefDescription
    fullDescription.value = listing.fullDescription
    postNumber.value = listing.postalCode
    address.value = listing.address
    price.value = listing.price
    selectedCategoryId.value = listing.category.id

    listing.attributes.forEach(attr => {
      const matchingAttribute = selectedCategory.value?.attributes.find(a => a.name === attr.name)
      if (matchingAttribute) {
        attributeInputs.value[matchingAttribute.id] = attr.value
      }
    })
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to load listing data.'
  }
})

const selectedCategory = computed(() =>
  categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null,
)

const deleteImageByIndex = (index: number) => {
  imagesToDelete.value.add(index)
}

const undoDelete = (index: number) => {
  imagesToDelete.value.delete(index)
}

const deleteAllImages = async (imagesToBeDeleted: Set<number>) => {
  let imagesToDeleteArray = Array.from(imagesToBeDeleted)
  imagesToDeleteArray.sort().reverse()
  for (let index of imagesToDeleteArray) {
    await deleteImage(listing.id, index)
  }
}

const handleImageUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    let numberOfImages = await uploadImages(listing.id, files)
    await fetchImagesForListing(listing.id, numberOfImages)
    newImagesUploadedIndices.value.add(numberOfImages - 1)
  }
}

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

    await editListing(id, payload)
    await deleteAllImages(imagesToDelete.value)
    successMessage.value = 'Listing updated successfully!'
    router.push(`/my-listing/${id}`)
  } catch (e) {
    errorMessage.value = handleApiError(e)
  } finally {
    loading.value = false
  }
}

async function cancelEdit() {
  await deleteAllImages(newImagesUploadedIndices.value)
  router.push(`/my-listing/${id}`)
}
</script>


<style scoped>
.form-container {
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .form-container {
    padding: 1.5rem;
  }
}

.undo-button {
  width: 100%;
  padding: 0.5rem;
  background-color: #6c757d; /* Bootstrap-like gray */
  color: white;
  border: none;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0 0 10px 10px;
  transition: background-color 0.3s ease;
}

.undo-button:hover {
  background-color: #5a6268;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}


h2 {
  text-align: center;
  color: #022b3a;
  margin-bottom: 1rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  background-color: white;
  transition: border-color 0.3s;
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

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #022b3a;
  font-weight: 600;
}

.button-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.save-button,
.cancel-button {
  flex: 1 1 45%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-button {
  background-color: #1f7a8c;
  color: white;
}

.save-button:hover {
  background-color: #022b3a;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-message,
.error-message {
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.5s ease-in-out;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #4ade80;
  padding: 0.75rem;
  border-radius: 6px;
}

.error-message {
  color: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.edit-images {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.image-grid div {
  position: relative;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.image-grid div:hover {
  transform: scale(1.02);
}

.uploaded-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
  transition: 0.3s;
}

.image-grid button {
  width: 100%;
  padding: 0.5rem;
  color: white;
  border: none;
  border-top: 1px solid #e0e0e0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0 0 10px 10px;
  transition: background-color 0.3s ease;
}

.deleted {
  opacity: 0.3;
  filter: grayscale(100%);
  border: 2px dashed #dc3545;
  border-radius: 8px;
}

input[type="file"] {
  margin-top: 1.5rem;
  display: block;
  font-size: 0.95rem;
  color: #022b3a;
}

</style>
