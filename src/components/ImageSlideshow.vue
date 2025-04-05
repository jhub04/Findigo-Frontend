<script setup lang="ts">
import { handleImageError } from '@/utils/handleImageError';
import { ref, computed } from 'vue'
import noImage from '@/assets/no-image.jpg'

const props = defineProps<{
  images: string[]
  initialIndex?: number
}>()

const currentImageIndex = ref(props.initialIndex || 0)

const currentImage = computed(() => {
  return props.images && props.images.length > 0 ? props.images[currentImageIndex.value] : noImage
})

const nextImage = () => {
  if (props.images.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  }
}

const prevImage = () => {
  if (props.images.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + props.images.length) % props.images.length
  }
}
</script>

<template>
  <div class="slideshow-container">
    <div class="image-wrapper">
      <img
      :src="currentImage"
      class="slideshow-image"
      @error="handleImageError"
      alt="Image"
    />
    </div>
    <div class="controls" v-if="images.length > 1">
      <button @click="prevImage" class="nav-button">&lt;</button>
      <span>{{ currentImageIndex + 1 }} / {{ images.length }}</span>
      <button @click="nextImage" class="nav-button">&gt;</button>
    </div>
  </div>
</template>

<style scoped>
.slideshow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-wrapper {
  width: 100%;
  max-width: 600px;
  height: auto;
}

.slideshow-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.controls {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-button {
  padding: 0.3rem 0.8rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #1e40af;
}
</style>
