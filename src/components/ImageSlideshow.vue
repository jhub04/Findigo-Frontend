<template>
  <div class="slideshow-container">
    <div class="image-wrapper">
      <img :src="currentImage" class="slideshow-image" @error="handleImageError" alt="Image" />
      <button v-if="props.images.length > 1" @click="prevImage" class="nav-button prev">
        &lt;
      </button>
      <button v-if="props.images.length > 1" @click="nextImage" class="nav-button next">
        &gt;
      </button>
    </div>
    <div class="controls" v-if="props.images.length > 1">
      <span>{{ currentImageIndex + 1 }} / {{ props.images.length }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleImageError } from '@/utils/handleImageError'
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

<style scoped>
.slideshow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Desktop: Fastsatt størrelse */
.image-wrapper {
  width: 600px;
  height: 400px;
  position: relative;
  overflow: hidden;
}

/* Mobil: Bruker padding for å opprettholde 3:2-forholdet */
@media (max-width: 768px) {
  .image-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 66.66%; /* 400/600 * 100% */
    position: relative;
  }
}

/* Bildet fyller containeren – absolutt posisjonert for å fylle padding-området */
.slideshow-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  display: block;
}

/* Navigasjonsknapper */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  opacity: 0.8;
  font-size: 1.5rem;
  line-height: 1;
  text-align: center;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: #1e40af;
}

.nav-button.prev {
  left: 10px;
}

.nav-button.next {
  right: 10px;
}

/* Mindre knapper på mobil */
@media (max-width: 768px) {
  .nav-button {
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
  }
}

.controls {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
  color: #333;
}
</style>
