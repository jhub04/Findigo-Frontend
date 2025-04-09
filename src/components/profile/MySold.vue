<script setup lang="ts">
import type { ListingResponse } from '@/types/dto'
import {ref ,onMounted} from 'vue'
import { useCurrentUser } from '@/composables/useCurrentUser';
import { getMySoldListings } from '@/services/userApi';
import { useI18n } from 'vue-i18n'
import ListingCard from '../ListingCard.vue';

const { t } = useI18n()

const listings = ref<ListingResponse[]>([]);
const { user, isLoading, error } = useCurrentUser()

const loading = ref(true)


onMounted(async () => {
  try {
    listings.value = await getMySoldListings()
  } catch (e: any) {
    error.value = e.message || t('Failed to load listings')
  } finally {
    loading.value = false
  }
})

</script>

<template>
    <header class="userdetails">
    <div v-if="isLoading">{{ t('Loading...') }}</div>
    <div v-else>
      <div v-if="user">
        <h3>{{ user.username }}</h3>
       
      </div>
      <div v-else-if="error">
        <p>{{ t('Failed to load user data') }}</p>
      </div>
      <div v-else>
        <p>{{ t('Unauthorized!') }}</p>
      </div>
    </div>
  </header>
  <main>
    <div class="mylistings-container">
      <h4>{{ t('Your Sold Listings') }}</h4>

      <div v-if="loading">{{ t('Loading listings...') }}</div>
      <div v-else-if="error">{{ t('Error:') }} {{ error }}</div>

      <div class="listing-grid">
        <ListingCard v-for="listing in listings" :key="listing.id" :listing="listing" />
      </div>

      <p v-if="listings.length === 0">{{ t('You have not sold any listings yet.') }}</p>
    </div>
  </main>
</template>

<style scoped>
.mylistings-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem;
    text-align: center;
  }
  
  h2 {
    margin-top: 1rem;
  }
  
  ul {
    margin-top: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.75rem;
  }
  
  .mylistings-container h4 {
    margin-top: 2rem;
    font-size: 1.3rem;
  }
  
  .listing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
    justify-items: center;
  }
  </style>
  