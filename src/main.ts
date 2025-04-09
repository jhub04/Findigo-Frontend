import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { MdEdit, MdStaroutlineRound, OiStarFill, FaMap, IoAddCircleSharp, MdMessage, MdAccountcircle } from 'oh-vue-icons/icons';

import en from '@/locales/en.json';
import no from '@/locales/no.json';
import es from '@/locales/es.json';
import ne from '@/locales/ne.json';
import ur from '@/locales/ur.json';

import { createI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user.ts';

addIcons(MdStaroutlineRound, OiStarFill, MdEdit, FaMap, IoAddCircleSharp, MdMessage, MdAccountcircle);

const browserLanguage = navigator.language.split('-')[0];

const i18n = createI18n({
  locale: browserLanguage || 'no',
  fallbackLocale: 'en',
  messages: { en, no, es, ne, ur }
});

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());

  const userStore = useUserStore();
  await userStore.initializeAuthStatus();

  app.use(i18n);
  app.use(router);
  app.use(VueGoogleMaps, {
    load: {
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: ['places'],
      language: 'no',
      region: 'NO'
    }
  });

  app.component('v-icon', OhVueIcon);

  app.mount('#app');
}

bootstrap();
