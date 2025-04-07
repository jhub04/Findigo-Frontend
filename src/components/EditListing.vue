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
          <img :class="{deleted: imagesToDelete.has(index)}" :src="image"/>
          <button @click="deleteImageByIndex(index)">Delete image</button>
        </div>
      </div>
      
      <input type="file" multiple accept="image/*"/>
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
const {images, fetchImagesForListing, deleteImage} = useImages();
const {uploadImages} = useImageUpload();

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
let listing:ListingResponse;
const imagesToDelete = ref<Set<number>>(new Set<number>());

onMounted(async () => {
  try {
    categories.value = await getAllCategories()
    listing = await getListingById(id);
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


const selectedCategory = computed(
  () => categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null,
)

const deleteImageByIndex = (index:number) => {
  imagesToDelete.value.add(index);
  console.log(imagesToDelete.value.has(index))
  console.log(imagesToDelete)
  //TODO make the "deleted" image a different color.
}

const deleteAllImages = async () => {
  let imagesToDeleteArray = Array.from(imagesToDelete.value);
  imagesToDeleteArray.sort().reverse(); //Sorted descending, can delete by indexes this way.
  for (let index of imagesToDeleteArray) {
    await deleteImage(listing.id, index);
  }
}

const submit = async () => {
  console.log("Submitting")
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

    await editListing(id, payload);
    await deleteAllImages();
    successMessage.value = 'Listing updated successfully!'
  } catch (e) {
    errorMessage.value = handleApiError(e)
  } finally {
    loading.value = false
  }
}

function cancelEdit() {
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
  background-color: #e1e5f2;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .form-container {
    padding: 1.5rem;
  }
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
.deleted {
  border-radius: 50%;
}
</style>
