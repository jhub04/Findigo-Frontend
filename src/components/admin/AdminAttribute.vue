<template>
  <div>
    <h2>Add Attribute</h2>
    <input v-model="name" placeholder="Attribute name" />
    <input v-model="type" placeholder="Data type (string, number, boolean)" />
    <input v-model.number="categoryId" placeholder="Category ID" />
    <button @click="submit">Create</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addAttribute } from '@/services/adminApi.ts'

const name = ref('')
const type = ref<'string' | 'number' | 'boolean'>('string')
const categoryId = ref<number | null>(null)

const submit = async () => {
  try {
    await addAttribute({ name: name.value, type: type.value, categoryId: categoryId.value! })
    alert('Attribute created')
  } catch (e) {
    alert('Failed to create attribute')
  }
}
</script>
