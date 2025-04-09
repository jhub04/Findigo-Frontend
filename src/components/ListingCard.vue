<template>
  <div class="listing-card" @click="goToListing">
    <img :src="firstImage" alt="Listing image" class="listing-image" @error="handleImageError" />
    <div class="listing-info">
      <div class="content-wrapper">
        <h3>{{ listing.briefDescription }}</h3>
        <p>{{ listing.price }} NOK</p>
      </div>
      <div class="listing-actions">
        <div
          class="favorite-btn"
          :class="{ disabled: !userStore.authenticated }"
          @click.stop="userStore.authenticated && toggleFavorite()"
          :title="!userStore.authenticated ? 'Log in to your account to add to favorites' : ''"
        >
          <v-icon
            :name="isFavorited(props.listing.id) ? 'oi-star-fill' : 'md-staroutline-round'"
            scale="2"
            fill="gold"
            class="favorite-icon"
          />
          <span v-if="!userStore.authenticated" class="favorite-hint">Log in to save</span>
        </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import noImage from '@/assets/no-image.jpg'
import type { ListingResponse } from '@/types/dto'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import { useFavorites } from '@/composables/useFavorites'
import { useImages } from '@/composables/useImages'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user.ts'

const { t } = useI18n()

const props = defineProps<{
  listing: ListingResponse
}>()

const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites()
const { firstImage, fetchFirstImageForListing } = useImages()

const isFavorite = computed(() => isFavorited(props.listing.id))
const userStore = useUserStore();
const router = useRouter();
const route = useRoute()

function redirectToLogin() {
  router.push({ name: 'Login', query: { redirect: route.fullPath } })
}

async function toggleFavorite() {
  if (!userStore.authenticated) {
    redirectToLogin();
    return
  }

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
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.listing-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  object-fit: cover;
}

.listing-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
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
