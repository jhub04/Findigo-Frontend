<template>
  <div>
    <button @click="goToAdminDashboard">Back to admin dashboard</button>
    <h2>Add Category</h2>
    <input v-model="addName" placeholder="Category name" />
    <button @click="handleCreateClick">Create</button>
  </div>
  <div>
    <h2>Edit / delete category</h2>
    <select v-model="selectedCategoryId" required>
      <option disabled value="">Select category</option>
      <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
    </select><br /><br />
  </div>
  <div v-if="selectedCategory">
    <input v-model="editName" placeholder="Edit name">
    <button @click="handleEditClick">Edit category</button><br /><br />
    <button @click="handleDeleteClick">Delete category</button>
  </div>
  <div>
    <p v-if="errorMessage">{{errorMessage}}</p>
    <p v-if="successMessage">{{successMessage}}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { addCategory, deleteCategory, editCategory } from '@/services/adminApi.ts'
import type { CategoryRequest } from '@/types/adminDto.ts'
import type { CategoryResponse } from '@/types/dto.ts'
import { getAllCategories } from '@/services/categoryApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAdminDashboard = () => {
  router.push('/admin')
}

const addName = ref('')
const categories = ref<CategoryResponse[]>([])
const selectedCategoryId = ref<number | null>(null)
const editName = ref('')
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const selectedCategory = computed(
  () => categories.value.find((cat) => cat.id === selectedCategoryId.value) ?? null,
)

const handleEditClick = async () => {
  resetMessages();

  if (!selectedCategoryId.value) {
    showMessage('error', "Category must be selected")
    return;
  }

  try {
    const newCategory: CategoryRequest = {
      name: editName.value
    }
    await editCategory(selectedCategoryId.value, newCategory);
    showMessage('success', "category successfully edited")
  } catch (error: any) {
    showMessage('success', handleApiError(error))
  } finally {
    resetForm();
  }
}

onMounted(async() => {
  categories.value = await getAllCategories();
})

const resetForm = () => {
  addName.value = ''
  editName.value = ''
  selectedCategoryId.value = null
}

const resetMessages = () => {
  errorMessage.value = null
  successMessage.value = null
}

const showMessage = (type: 'success' | 'error', message: string) => {
  if (type === 'success') {
    successMessage.value = message;
  } else {
    errorMessage.value = message;
  }

  setTimeout(() => {
    resetMessages();
  }, 6000);
}

const handleCreateClick = async () => {
  resetMessages();
  try {
    const request: CategoryRequest = { name: addName.value };
    await addCategory(request)
    categories.value = await getAllCategories();
    showMessage('success', "category successfully created")
  } catch (error: any) {
    showMessage('error', handleApiError(error));
  } finally {
    resetForm();
  }
}

const handleDeleteClick = async () => {
  resetMessages();

  if (!selectedCategoryId.value) {
    showMessage('error', "Category must be selected");
    return;
  }

  try {
    await deleteCategory(selectedCategoryId.value)
    showMessage('success', "Category successfully deleted")
    categories.value = await getAllCategories()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  } finally {
    resetForm();
  }
}
</script>
