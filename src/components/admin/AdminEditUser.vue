<template>
  <div class="edit-profile-container">
    <div class="header">
      <h2>Edit User</h2>
    </div>

    <form v-if="user" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="Enter new password"
          required
        />
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          v-model="form.phoneNumber"
          type="number"
          required
        />
        <p v-if="isPhoneNumberMissing" class="error-text">
          Phone number is required
        </p>
      </div>

      <div class="form-group">
        <label for="roles">Roles</label>
        <select id="roles" v-model="form.roles" multiple required>
          <option v-for="role in availableRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>

      <div class="button-group">
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
import { getUserById, editUser } from '@/services/adminApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { UserResponse } from '@/types/dto.ts'
import type { AdminUserRequest, Role } from '@/types/adminDto.ts'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const userId = Number(route.params.userId) // pass userId via route params

const form = ref<AdminUserRequest>({
  username: '',
  password: '',
  phoneNumber: '',
  roles: [],
})

const user = ref<UserResponse | null>(null)
const availableRoles = ref<Role[]>(['ROLE_USER', 'ROLE_ADMIN'])

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  try {
    user.value = await getUserById(userId)
    if (user.value) {
      form.value.username = user.value.username
      form.value.phoneNumber = user.value.phoneNumber
      form.value.roles = user.value.roles
    }
  } catch (error: any) {
    handleApiError(error)
  }
})

const isPhoneNumberMissing = computed(() => {
  return !form.value.phoneNumber
})

async function submitForm() {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await editUser(userId, form.value)
    successMessage.value = 'User updated successfully!'
  } catch (error: any) {
    handleApiError(error)
    errorMessage.value = 'Failed to update user.'
  } finally {
    loading.value = false
  }
}

function cancelEdit() {
  if (user.value) {
    form.value.username = user.value.username
    form.value.phoneNumber = user.value.phoneNumber
    form.value.roles = user.value.roles
    form.value.password = ''
  }
  successMessage.value = ''
  errorMessage.value = ''
}
</script>

<style scoped>
/* Samme styling som din nåværende profilside, boss */

.edit-profile-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #e1e5f2;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  color: #022b3a;
  margin: 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #022b3a;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bfd8f7;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.error-text {
  color: red;
  margin-top: 0.3rem;
  font-size: 0.85rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.edit-button {
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

.edit-button:hover {
  background-color: #022b3a;
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
