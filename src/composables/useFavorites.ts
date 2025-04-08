import { ref } from 'vue'
import { addFavorite, removeFavorite, getFavorites } from '@/services/userApi'
import type { ListingResponse } from '@/types/dto'
const favorites = ref<ListingResponse[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
export const useFavorites = () => {


    const fetchFavorites = async () => {
        loading.value = true
        error.value = null
        try {
            favorites.value = await getFavorites();
        } catch (error: any) {
            error.value = error.message || 'Failed to fetch favorites'
        } finally {
            loading.value = false;
        }
    }

    const addToFavorites = async (listingId: number) => {
        try {
          const added = await addFavorite(listingId)
          favorites.value.push(added)
        } catch (err: any) {
          error.value = err.message || `Failed to add listing ${listingId} to favorites`
        }
    }

    const removeFromFavorites = async (listingId: number) => {
        try {
          const removed = await removeFavorite(listingId)
          favorites.value = favorites.value.filter(listing => listing.id !== removed.id)
        } catch (err: any) {
          error.value = err.message || `Failed to remove listing ${listingId} from favorites`
        }
    }

    const isFavorited = (listingId: number) => {
        return favorites.value.some(listing => listing.id === listingId);
    }

    return {
        favorites,
        loading,
        error,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
      }

}
