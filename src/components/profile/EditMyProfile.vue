<template>
  <div class="edit-profile-container">
    <div class="header">
      <h2>My Profile</h2>
      <div class="icon-group">
        <v-icon name="md-arrowback" class="back-icon" @click="goBack" />
        <v-icon name="md-edit" class="edit-icon" @click="toggleEdit" />
      </div>
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
          <span v-if="loading" class="spinner"></span>
          <span v-else>Save Changes</span>
        </button>
        <button class="cancel-button" type="button" @click="cancelEdit">
          Cancel
        </button>
      </div>

      <transition name="fade">
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { editMyProfile, getCurrentUser } from '@/services/userApi'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { UserResponse } from '@/types/dto.ts'

const router = useRouter()

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

const isPhoneNumberMissing = computed(() => !form.value.phoneNumber)

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
    errorMessage.value = 'Something went wrong. Please try again.'
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

function goBack() {
  router.push('/profile')
}
</script>

<style scoped>
.edit-profile-container {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #e1e5f2; /* Lavender */
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 500px) {
  .edit-profile-container {
    padding: 1.5rem;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  color: #022b3a; /* Gunmetal */
  margin: 0;
  font-size: 1.8rem;
}

.icon-group {
  display: flex;
  gap: 0.75rem;
}

.edit-icon,
.back-icon {
  cursor: pointer;
  color: #1f7a8c; /* Teal */
  transition: color 0.3s ease;
  font-size: 1.6rem;
}

.edit-icon:hover,
.back-icon:hover {
  color: #022b3a; /* Gunmetal hover */
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #022b3a; /* Gunmetal */
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #bfd8f7; /* Columbia blue */
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #1f7a8c; /* Teal */
  outline: none;
}

input[readonly] {
  background-color: #f5f5f5;
  color: #555;
  cursor: default;
}

.error-text {
  color: red;
  margin-top: 0.3rem;
  font-size: 0.85rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  gap: 0.75rem;
}

.edit-button,
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

.edit-button {
  background-color: #1f7a8c; /* Teal */
  color: white;
}

.edit-button:hover {
  background-color: #022b3a; /* Gunmetal hover */
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.success-message,
.error-message {
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.5s ease-in-out;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
</style>
