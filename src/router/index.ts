import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import NewListingView from '@/views/NewListingView.vue'
import MessagesView from '@/views/MessagesView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MyListingsView from '@/views/MyListingsView.vue'
import MessageThreadView from '@/views/MessageThreadView.vue'
import SearchResultsView from '@/components/search/SearchResultsView.vue'
import ListingView from '@/views/ListingView.vue'
import ListingAdministratorView from '@/views/ListingAdministratorView.vue'
import AdminCategoryView from '@/views/admin/AdminCategoryView.vue'
import AdminAttributeView from '@/views/admin/AdminAttributeView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminUserView from '@/views/admin/AdminUserView.vue'
import authApi from '@/services/authApi'
import MyFavoritesView from '@/views/profile/MyFavoritesView.vue'
import MockCheckoutView from '@/views/MockCheckoutView.vue'
import MyArchivesView from '@/views/profile/MyArchivesView.vue'
import MyPurchasesView from '@/views/profile/MyPurchasesView.vue'
import MySoldView from '@/views/profile/MySoldView.vue'
import EditMyProfileView from '@/views/profile/EditMyProfileView.vue'
import EditOwnListingView from '@/views/EditOwnListingView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: HomeView, name: 'Home' },
  { path: '/login', component: LoginView, name: 'Login' },
  { path: '/register', component: RegisterView, name: 'Register' },
  { path: '/profile', component: ProfileView, name: 'Profile'},
  { path: '/profile/listings', component: MyListingsView, name: 'MyListings'},
  { path: '/profile/favorites', component: MyFavoritesView, name: 'MyFavorites'},
  { path: '/profile/edit', component: EditMyProfileView, name: 'EditMyProfile'},
  { path: '/profile/archives', component: MyArchivesView, name: 'MyArchives'},
  { path: '/profile/purchases', component: MyPurchasesView, name: 'MyPurchases'},
  { path: '/profile/sold', component: MySoldView, name: 'MySold'},
  { path: '/map', component: MapView, name: 'Map' },
  { path: '/listing', component: NewListingView, name: 'NewListing' },
  { path: '/listing/:id', component: ListingView, name: 'ListingPage' },
  { path: '/my-listing/:id', component: ListingAdministratorView, name: 'OwnListingPage' },
  { path: '/edit-my-listing/:id', component: EditOwnListingView, name: 'EditOwnListingPage' },
  { path: '/listing/:id/checkout', component: MockCheckoutView, name: 'MockCheckoutPage'},
  { path: '/my-listing/:id', component: ListingAdministratorView, name: 'OwnListingPage' },
  { path: '/messages', component: MessagesView, name: 'Messages' },
  { path: '/messages/:userId', component: MessageThreadView, name: 'MessageThread'},
  { path: '/search', component: SearchResultsView, name: 'SearchResultsView' },
  { path: '/admin', component: AdminDashboardView, name: 'AdminDashboard' },
  { path: '/admin/category', component: AdminCategoryView, name: 'AdminCategory' },
  { path: '/admin/attribute', component: AdminAttributeView, name: 'AdminAttribute' },
  { path: '/admin/user', component: AdminUserView, name: 'AdminUser' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach(async (to) => {
  const isAuth = await authApi.isAuthenticated();
  // If the user is not logged in and tries to access a protected page → redirect to log in.
  if (to.name !== 'Login' && to.name !== 'Register' && !isAuth) {
    return { name: 'Login' };
  }

  // If the user is logged in and tries to access the login page → redirect to "/home".
  if (to.name === 'Login' && isAuth) { //AUthstatus should be true/false
    return { name: 'Home' };
  }
});

export default router
