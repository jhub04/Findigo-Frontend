<template>
  <div>
    <h2>Add Category</h2>
    <input v-model="name" placeholder="Category name" />
    <button @click="submit">Create</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addCategory } from '@/services/adminApi.ts'
import type { CategoryRequest } from '@/types/adminDto.ts'

const name = ref('')

const submit = async () => {
  try {
    const request: CategoryRequest = { name: name.value };
    await addCategory(request)
    alert('Category created')
  } catch (e) {
    alert('Failed to create category')
  }
}
</script>
