<script setup lang="ts">
import { ref, computed } from 'vue'
import { addListing } from '@/services/listingApi.ts'
import type { CategoryResponse, ListingAttributeRequest, ListingRequest } from '@/types/dto.ts'
import { getCoordinatesFromPostcode } from '@/utils/geoUtils'

const briefDescription = ref('')
const fullDescription = ref('')
const postNumber = ref('')
const imageUrls = ref<string[]>([''])
const selectedCategoryId = ref<number | null>(null)
const attributeInputs = ref<Record<number, string>>({})

const categories = ref<CategoryResponse[]>([]) // hent fra API før bruk
const selectedCategory = computed(() =>
  categories.value.find(c => c.id === selectedCategoryId.value)
)

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const submit = async () => {
  errorMessage.value = null
  if (!selectedCategory.value || !postNumber.value) {
    errorMessage.value = 'Kategori og postnummer er påkrevd'
    return
  }

  loading.value = true
  try {
    const { latitude, longitude } = await getCoordinatesFromPostcode(postNumber.value)

    const attributes: ListingAttributeRequest[] = selectedCategory.value.attributes.map(attr => ({
      attributeId: attr.id,
      value: attributeInputs.value[attr.id] || ''
    }))

    const payload: ListingRequest = {
      briefDescription: briefDescription.value,
      fullDescription: fullDescription.value,
      longitude,
      latitude,
      categoryId: selectedCategory.value.id,
      attributes,
      imageUrls: imageUrls.value.filter(url => url.trim() !== '')
    }

    await addListing(payload)
    // Reset eller naviger videre
  } catch (e) {
    errorMessage.value = 'Noe gikk galt under innsending.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4 max-w-xl mx-auto">
    <h2 class="text-xl font-semibold">Opprett annonse</h2>

    <input v-model="briefDescription" placeholder="Tittel på annonsen" required />
    <textarea v-model="fullDescription" placeholder="Beskrivelse" required rows="5" />

    <input v-model="postNumber" placeholder="Postnummer" required />

    <select v-model="selectedCategoryId" required>
      <option disabled value="">Velg kategori</option>
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
      <label>Bilder</label>
      <div v-for="(url, index) in imageUrls" :key="index">
        <input v-model="imageUrls[index]" placeholder="Lim inn bilde-URL" />
      </div>
      <button type="button" @click="imageUrls.push('')">Legg til bilde</button>
    </div>

    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Sender...' : 'Publiser annonse' }}
    </button>
  </form>
</template>

<style scoped>
input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}
</style>
