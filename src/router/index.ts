import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import NewListingView from '@/views/NewListingView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import MessagesView from '@/views/MessagesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useTokenStore } from '@/stores/token'
import MyListingsView from '@/views/MyListingsView.vue'
import MessageThreadView from '@/views/MessageThreadView.vue'
import SearchResultsView from '@/components/search/SearchResultsView.vue'
import ListingView from '@/views/ListingView.vue'
import OwnListingView from '@/views/OwnListingView.vue'


const routes = [
  { path: '/home', component: HomeView, name: 'Home' },
  { path: '/login', component: LoginView, name: 'Login' },
  { path: '/register', component: RegisterView, name: 'Register' },
  { path: '/profile', component: ProfileView, name: 'Profile'},
  { path: '/profile/listings', component: MyListingsView, name: 'MyListings'},
  { path: '/map', component: MapView, name: 'Map' },
  { path: '/listing', component: NewListingView, name: 'New listing' },
  { path: '/listing/:id', component: ListingView, name: 'Listing page' },
  { path: '/my-listing/:id', component: OwnListingView, name: 'Own listing page' },
  { path: '/notifications', component: NotificationsView, name: 'Notifications' },
  { path: '/messages', component: MessagesView, name: 'Messages' },
  { path: '/messages/:userId', component: MessageThreadView, name: 'MessageThread'},
  { path: '/', redirect: '/home' },
  { path: '/search', name: 'SearchResultsView', component: SearchResultsView }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach((to) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.jwtToken;

  // If the user is not logged in and tries to access a protected page → redirect to log in.
  if (to.name !== 'Login' && to.name !== 'Register' && !token) {
    return { name: 'Login' };
  }

  // If the user is logged in and tries to access the login page → redirect to "/home".
  if (to.name === 'Login' && token) {
    return { name: 'Home' };
  }
});

export default router
