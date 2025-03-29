  <template>
  <GMapMap class="google-map" :center="center" :zoom="zoom">
  <GMapMarker
    v-for="listing in categoryListings"
    :key="listing.id"
    :position="{ lat: listing.latitude, lng: listing.longitude }"
  />
  </GMapMap>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getListingsByCategory} from '@/services/categoryApi.ts';
  const { center, zoom } = defineProps<{
    center: { lat: number; lng: number }
    zoom: number
  }>()
  const categoryListings = ref<ListingResponse[]>([]);
  const categoryListingsLoading = ref(true);
  const categoryListingsError = ref<string | null>(null);

  onMounted(async () => {
    try {
      categoryListings.value = await getListingsByCategory();
      console.log(categoryListings.value);
    } catch (err: any) {
      categoryListingsError.value = err.message || 'Failed to load listings';
    } finally {
      categoryListingsLoading.value = false;
    }
  });
  </script>

  <style scoped>
  .google-map {
    width: 100%;
    height: 100%;
    border-radius: 8px; /* valgfritt, for penere utseende */
  }
  </style>
