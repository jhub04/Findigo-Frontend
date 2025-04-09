import type { ListingResponse } from '@/types/dto.ts'
import { useUserStore } from '@/stores/user.ts'
import router from '@/router';


export const navigateToListing = async (listing: ListingResponse) => {
  const userStore = useUserStore();
  const currentUser = userStore.currentUser;
  const isOwnerOrAdmin = currentUser?.username === listing.user.username || userStore.isAdmin();
  const listingId = listing.id;

  const route = isOwnerOrAdmin ? `/my-listing/${listingId}` : `/listing/${listingId}`;
  router.push(route);
}
