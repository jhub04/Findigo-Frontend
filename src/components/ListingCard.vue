<template>
  <div class="listing-card" @click="goToListing">
    <img :src="firstImage" alt="Listing image" class="listing-image" @error="handleImageError" />
    <div class="listing-info">
      <div class="content-wrapper">
        <h3>{{ listing.briefDescription }}</h3>
      </div>
      <div class="listing-actions">
        <div class="price-wrapper">
          <p class="price">{{ listing.price }} NOK</p>
        </div>
        <div class="days-since-created">
          <p>{{ daysSinceCreated }}</p>
        </div>
        <div class="favorite-btn" @click.stop="toggleFavorite">
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
import { computed, onMounted, ref } from 'vue'
import noImage from '@/assets/no-image.jpg'
import type { ListingResponse } from '@/types/dto'
import { navigateToListing } from '@/utils/navigationUtil.ts'
import { useFavorites } from '@/composables/useFavorites'
import { useImages } from '@/composables/useImages'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()

const props = defineProps<{
  listing: ListingResponse
}>()

const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();
const { firstImage, fetchFirstImageForListing } = useImages()
const isFavorite = computed(() => isFavorited(props.listing.id))

const daysSinceCreated = computed(() => {
  if (!props.listing.dateCreated) return '';

  const createdDate = new Date(props.listing.dateCreated);
  const currentDate = new Date();

  const timeDiff = currentDate.getTime() - createdDate.getTime();
  const days = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (days === 0) {
    return t('Today');
  } else if (days === 1) {
    return t('Yesterday');
  } else {
    return `${days} ${t('days ago')}`;
  }
});

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
  margin: 1.5rem;
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

.content-wrapper h3 {
  font-size: clamp(1rem, 2.5vw, 1.25rem); /* Responsiv størrelse */
  line-height: 1.3;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;       /* maks 2 linjer */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.listing-image {
  width: 100%;
  object-fit: cover;
}

.listing-actions {
  display: flex;
  justify-content: space-between;  /* Plasser elementene på en linje */
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap; /* Sørger for at de kan brytes til flere linjer hvis det er nødvendig */
}

.price-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
}

.price {
  font-size: 1.3rem;  /* Justert for kompakt visning */
  font-weight: bold;
  white-space: nowrap;
  margin-right: 1rem; /* Skape litt plass mellom pris og dato */
}

.days-since-created {
  font-size: 1rem;
  white-space: nowrap;
  margin-right: 1rem; /* Skape plass mellom dato og stjernesymbol */
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

@media (max-width: 768px) {
  .listing-card {
    margin: 0rem; /* Mindre margin på mobil */
    margin-top: 0.5rem; /* Litt mer plass mellom kortene */
    flex-direction: column; /* Stakk elementene på mobil */
  }

  .listing-actions {
    flex-direction: column; /* Stakk elementene på mobil */
    align-items: flex-start;
    margin: 0;
  }

  .price-wrapper,
  .days-since-created,
  .favorite-btn {
    margin-bottom: 0.2rem; /* Legg litt plass mellom elementene på mobil */
  }

  .price {
    font-size: 1rem; /* Mindre tekst på mobil for bedre plass */
  }

  .days-since-created {
    font-size: 0.7rem; /* Mindre tekst på mobil for bedre plass */
  }
}
</style>
