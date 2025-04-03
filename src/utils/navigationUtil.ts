import type { ListingResponse } from '@/types/dto.ts'
import { useTokenStore } from '@/stores/token.ts'


export const navigateToListing = async (listing: ListingResponse) => {
  const currentUsername = useTokenStore().loggedInUser;
  const isOwner = currentUsername === listing.user.username;
  const listingId = listing.id;

  const route = isOwner ? `/my-listing/${listingId}` : `/listing/${listingId}`;
  window.open(route, '_blank')
}
