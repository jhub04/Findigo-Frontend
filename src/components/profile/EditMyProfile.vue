<template>
  <div class="edit-profile-container">
    <div class="header">
      <h2>My Profile</h2>
      <v-icon name="md-edit" class="edit-icon" @click="toggleEdit" />
    </div>

    <form v-if="currentUser" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          :readonly="!isEditing"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          :readonly="!isEditing"
          :placeholder="isEditing ? 'Enter new password' : '********'"
          required
        />
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          v-model.number="form.phoneNumber"
          type="number"
          :readonly="!isEditing"
          required
        />
        <p v-if="isPhoneNumberMissing" class="error-text">
          Phone number is required
        </p>
      </div>

      <div v-if="isEditing" class="button-group">
        <button class="edit-button" type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
        <button class="logout-button" type="button" @click="cancelEdit">
          Cancel
        </button>
      </div>

      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { editMyProfile, getCurrentUser } from '@/services/userApi'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { UserResponse } from '@/types/dto.ts'

const form = ref({
  username: '',
  password: '',
  phoneNumber: '',
})

const currentUser = ref<UserResponse | null>(null)
const isEditing = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    currentUser.value = await getCurrentUser()
    if (currentUser.value) {
      form.value.username = currentUser.value.username
      form.value.phoneNumber = currentUser.value.phoneNumber
    }
  } catch (error: any) {
    handleApiError(error)
  }
})

const isPhoneNumberMissing = computed(() => {
  return !form.value.phoneNumber
})

function toggleEdit() {
  successMessage.value = ''
  errorMessage.value = ''
  isEditing.value = true

}

async function submitForm() {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await editMyProfile(form.value)
    successMessage.value = 'Profile updated successfully!'
    isEditing.value = false
  } catch (error: any) {
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

function cancelEdit() {
  if (currentUser.value) {
    form.value.username = currentUser.value.username
    form.value.phoneNumber = currentUser.value.phoneNumber
    form.value.password = ''
  }
  successMessage.value = ''
  errorMessage.value = ''
  isEditing.value = false
}
</script>

<style scoped>
.edit-profile-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #e1e5f2; /* Lavender */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-text {
  color: red;
  margin-top: 0.3rem;
  font-size: 0.85rem;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  color: #022b3a; /* Gunmetal */
  margin: 0;
}

.edit-icon {
  cursor: pointer;
  color: #1f7a8c; /* Teal */
  transition: color 0.3s ease;
}

.edit-icon:hover {
  color: #022b3a; /* Gunmetal hover */
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #022b3a; /* Gunmetal */
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bfd8f7; /* Columbia blue */
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

input[readonly] {
  background-color: #f5f5f5;
  color: #555;
  cursor: default;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.edit-button {
  background-color: #1f7a8c; /* Teal */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #022b3a; /* Gunmetal hover */
}

.logout-button {
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

.logout-button:hover {
  background-color: #c82333;
}

.success-message {
  margin-top: 1rem;
  color: green;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  color: red;
  text-align: center;
}
</style>
