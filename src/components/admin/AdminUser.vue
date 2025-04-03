<template>
  <div>
    <h2>Add User</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="roles" placeholder="Roles (comma separated, e.g., USER,ADMIN)" />
    <button @click="submit">Create</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addUser } from '@/services/adminApi.ts'
import type { Role } from '@/types/adminDto.ts'

const username = ref('')
const password = ref('')
const roles = ref('USER')

const submit = async () => {
  try {
    const roleArray = roles.value.split(',').map(role => role.trim() as Role)
    await addUser({ username: username.value, password: password.value, roles: roleArray })
    alert('User created')
  } catch (e) {
    alert('Failed to create user')
  }
}
</script>
