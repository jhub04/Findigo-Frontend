<template>
  <div class="listing-card">
    <img
      :src="firstImage"
      alt="Listing image"
      class="listing-image"
      @error="handleImageError"
    />
    <div class="listing-info">
      <div class="content-wrapper">
        <h3>{{ listing.briefDescription }}</h3>
        <p>{{ listing.price }} NOK</p>
      </div>

      <div class="listing-actions">
        <button class="go-to-listing-btn" @click.stop="goToListing">
          {{ $t('Go to listing details') }} &rarr;
        </button>

        <div class="favorite-btn" @click="toggleFavorite">
          <v-icon
            :name="isFavorited(props.listing.id) ? 'oi-star-fill' : 'md-staroutline-round'"
            scale="2"
            fill="gold"
            class="favorite-icon"
          />
        </div>
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import noImage from '@/assets/no-image.jpg'
import type { ListingResponse } from '@/types/dto.ts'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import { useFavorites } from '@/composables/useFavorites'
import { useImages} from '@/composables/useImages'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  listing: ListingResponse,
}>()

const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();
const { firstImage, fetchFirstImageForListing } = useImages();

const isFavorite = computed(() => isFavorited(props.listing.id))

async function toggleFavorite() {
  if (isFavorite.value) {
    await removeFromFavorites(props.listing.id)
  } else {
    await addToFavorites(props.listing.id)
  }
}

function goToListing() {
  navigateToListing(props.listing)
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = noImage
}

onMounted(async () => {
  await fetchFirstImageForListing(props.listing)
})
</script>


<style scoped>
.listing-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.listing-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  height: 100%;
}

.content-wrapper {
  flex-grow: 1;
}


.listing-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}



.listing-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.go-to-listing-btn {
  background: none;
  border: none;
  color: #1F7A8C;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  text-decoration: none;
}

.go-to-listing-btn:hover {
  text-decoration: underline;
}

.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}
.favorite-btn:focus {
  outline: none;
}
.favorite-btn:active {
  transform: scale(0.95);
}

</style>
