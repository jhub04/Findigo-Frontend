<template>
  <div>
    <button @click="goToAdminDashboard">Back to admin dashboard</button>

    <h2>Add Attribute</h2>
    <input v-model="addName" placeholder="Attribute name" />
    <select v-model="addType" required>
      <option disabled value="">Select type</option>
      <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
    </select>
    <select v-model="addCategoryId" required>
      <option disabled value="">Select category</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
    </select>
    <button @click="handleCreateClick">Create</button>

    <h2>Edit / Delete Attribute</h2>
    <select v-model="selectedAttributeId" required>
      <option disabled value="">Select attribute</option>
      <option v-for="attr in attributes" :key="attr.id" :value="attr.id">{{ attr.name }}</option>
    </select><br /><br />

    <div v-if="selectedAttribute">
      <input v-model="editName" placeholder="Edit name" />
      <select v-model="editType" required>
        <option disabled value="">Select type</option>
        <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="editCategoryId" required>
        <option disabled value="">Select category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select><br /><br />
      <button @click="handleEditClick">Edit attribute</button><br /><br />
      <button @click="handleDeleteClick">Delete attribute</button>
    </div>

    <div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addAttribute, deleteAttribute, editAttribute, getAllAttributes } from '@/services/adminApi.ts'
import { getAllCategories } from '@/services/categoryApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { CategoryResponse, AttributeResponse } from '@/types/dto.ts'
import type { AttributeRequest } from '@/types/adminDto.ts'

// Router
const router = useRouter()
const goToAdminDashboard = () => {
  router.push('/admin')
}

// Form states
const addName = ref('')
const addType = ref<'string' | 'number' | 'boolean'>('string')
const addCategoryId = ref<number | null>(null)

const editName = ref('')
const editType = ref<'string' | 'number' | 'boolean'>('string')
const editCategoryId = ref<number | null>(null)

const selectedAttributeId = ref<number | null>(null)
const selectedAttribute = computed(() =>
  attributes.value.find(attr => attr.id === selectedAttributeId.value) ?? null
)

const types = ['string', 'number', 'boolean'] as const
const categories = ref<CategoryResponse[]>([])
const attributes = ref<AttributeResponse[]>([])

// Messages
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Lifecycle
onMounted(async () => {
  await loadData()
})

// Helpers
const loadData = async () => {
  categories.value = await getAllCategories()
  attributes.value = await getAllAttributes()
}

const resetForm = () => {
  addName.value = ''
  addType.value = 'string'
  addCategoryId.value = null
  editName.value = ''
  editType.value = 'string'
  editCategoryId.value = null
  selectedAttributeId.value = null
}

const resetMessages = () => {
  successMessage.value = null
  errorMessage.value = null
}

const showMessage = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    successMessage.value = message
  } else {
    errorMessage.value = message
  }
}

// Handlers
const handleCreateClick = async () => {
  resetMessages()

  if (!addCategoryId.value) {
    showMessage('error', "Category must be selected")
    return
  }

  try {
    const request: AttributeRequest = {
      name: addName.value,
      type: addType.value,
      categoryId: addCategoryId.value
    }
    await addAttribute(request)
    showMessage('success', "Attribute successfully created")
    await loadData()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  } finally {
    resetForm()
  }
}

const handleEditClick = async () => {
  resetMessages()

  if (!selectedAttributeId.value || !editCategoryId.value) {
    showMessage('error', "Attribute and category must be selected")
    return
  }

  try {
    const request: AttributeRequest = {
      name: editName.value,
      type: editType.value,
      categoryId: editCategoryId.value
    }
    await editAttribute(selectedAttributeId.value, request)
    showMessage('success', "Attribute successfully edited")
    await loadData()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  } finally {
    resetForm()
  }
}

const handleDeleteClick = async () => {
  resetMessages()

  if (!selectedAttributeId.value) {
    showMessage('error', "Attribute must be selected")
    return
  }

  try {
    await deleteAttribute(selectedAttributeId.value)
    showMessage('success', "Attribute successfully deleted")
    await loadData()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  } finally {
    resetForm()
  }
}
</script>
