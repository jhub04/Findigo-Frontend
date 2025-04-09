import type { ListingResponse } from '@/types/dto.ts'
import { useUserStore } from '@/stores/user.ts'
import { getCurrentUser } from '@/services/userApi';
import { handleApiError } from './handleApiError';
import router from '@/router';


export const navigateToListing = async (listing: ListingResponse) => {
  let currentUsername;
  try {
    currentUsername = (await getCurrentUser()).username;
  } catch(error) {
    console.log(error);
    return;
  }
  const isOwner = currentUsername === listing.user.username;
  const listingId = listing.id;

  const route = isOwner ? `/my-listing/${listingId}` : `/listing/${listingId}`;
  router.push(route);
}
