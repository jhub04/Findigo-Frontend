import type { ListingResponse } from '@/types/dto.ts'
import { useUserStore } from '@/stores/user.ts'


export const navigateToListing = async (listing: ListingResponse) => {
  const currentUsername = useUserStore().loggedInUser;
  const isOwner = currentUsername === listing.user.username;
  const listingId = listing.id;

  const route = isOwner ? `/my-listing/${listingId}` : `/listing/${listingId}`;
  window.open(route, '_blank')
}
