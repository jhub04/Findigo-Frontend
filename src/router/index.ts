import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MapView from '@/views/MapView.vue'
import NewListingView from '@/views/NewListingView.vue'
import NotificationsView from '@/views/NotificationsView.vue'
import MessagesView from '@/views/MessagesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/listing',
      name: 'listing',
      component: NewListingView,
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView,
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView,
    },
  ],
})

export default router
