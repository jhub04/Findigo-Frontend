<template>
  <div>
    <button @click="goToAdminDashboard">Back to admin dashboard</button>

    <h2>Add User</h2>
    <input v-model="addUsername" placeholder="Username" />
    <input v-model="addPassword" type="password" placeholder="Password" />
    <input v-model="addPhoneNumber" placeholder="Phone Number" />
    <select v-model="addRoles" multiple>
      <option v-for="role in availableRoles" :key="role" :value="role">
        {{ role }}
      </option>
    </select>
    <button @click="handleCreateClick">Create</button>

    <h2>Edit / Delete User</h2>
    <input v-model.number="selectedUserId" placeholder="Enter User ID" />
    <button @click="fetchSelectedUser">Load User</button>

    <div v-if="selectedUser">
      <input v-model="editUsername" placeholder="Edit Username" />
      <input v-model="editPassword" type="password" placeholder="Edit Password" />
      <input v-model="editPhoneNumber" placeholder="Edit Phone Number" />
      <select v-model="editRoles" multiple>
        <option v-for="role in availableRoles" :key="role" :value="role">
          {{ role }}
        </option>
      </select>
      <button @click="handleEditClick">Edit User</button>
    </div>

    <div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addUser, editUser, getUserById } from '@/services/adminApi.ts'
import { handleApiError } from '@/utils/handleApiError.ts'
import type { AdminUserRequest, Role } from '@/types/adminDto.ts'
import type { UserResponse } from '@/types/dto.ts'

const router = useRouter()

const goToAdminDashboard = () => {
  router.push('/admin')
}

// Form states for adding user
const addUsername = ref('')
const addPassword = ref('')
const addPhoneNumber = ref('')
const addRoles = ref<Role[]>([])

// Form states for editing user
const selectedUserId = ref<number | null>(null)
const selectedUser = ref<UserResponse | null>(null)
const editUsername = ref('')
const editPassword = ref('')
const editPhoneNumber = ref('')
const editRoles = ref<Role[]>([])

const availableRoles = ref<Role[]>(['ROLE_USER', 'ROLE_ADMIN'])

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Helpers
const resetMessages = () => {
  successMessage.value = null
  errorMessage.value = null
}

const showMessage = (type: 'success' | 'error', message: string) => {
  if (type === 'success') successMessage.value = message
  else errorMessage.value = message
}

const resetAddForm = () => {
  addUsername.value = ''
  addPassword.value = ''
  addPhoneNumber.value = ''
  addRoles.value = []
}

const resetEditForm = () => {
  editUsername.value = ''
  editPassword.value = ''
  editPhoneNumber.value = ''
  editRoles.value = []
  selectedUser.value = null
}

// CRUD actions
const handleCreateClick = async () => {
  resetMessages()
  try {
    const request: AdminUserRequest = {
      username: addUsername.value,
      password: addPassword.value,
      phoneNumber: addPhoneNumber.value,
      roles: addRoles.value
    }
    await addUser(request)
    showMessage('success', 'User successfully created')
    resetAddForm()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  }
}

const fetchSelectedUser = async () => {
  resetMessages()
  if (!selectedUserId.value) {
    showMessage('error', 'User ID is required')
    return
  }
  try {
    selectedUser.value = await getUserById(selectedUserId.value)
    if (selectedUser.value) {
      editUsername.value = selectedUser.value.username
      editPhoneNumber.value = selectedUser.value.phoneNumber
      editRoles.value = selectedUser.value.roles
    }
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  }
}

const handleEditClick = async () => {
  resetMessages()
  if (!selectedUserId.value) {
    showMessage('error', 'User ID is required')
    return
  }

  try {
    const request: AdminUserRequest = {
      username: editUsername.value,
      password: editPassword.value,
      phoneNumber: editPhoneNumber.value,
      roles: editRoles.value
    }
    await editUser(selectedUserId.value, request)
    showMessage('success', 'User successfully edited')
    resetEditForm()
  } catch (error: any) {
    showMessage('error', handleApiError(error))
  }
}
</script>
