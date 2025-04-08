import './assets/main.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { MdEdit, MdStaroutlineRound, OiStarFill, FaMap, IoAddCircleSharp, MdMessage, MdAccountcircle} from 'oh-vue-icons/icons';

import en from '@/locales/en.json'
import no from '@/locales/no.json'
import es from '@/locales/es.json'
import ne from '@/locales/ne.json'
import ur from '@/locales/ur.json'

import { createI18n } from 'vue-i18n';

addIcons(MdStaroutlineRound, OiStarFill, MdEdit);
const browserLanguage = navigator.language.split('-')[0]

const i18n = createI18n({
  locale: browserLanguage || "no",
  fallbackLocale: "en",
  messages: {
    en,
    no,
    es,
    ne,
    ur
  }

})


addIcons(MdStaroutlineRound, OiStarFill, FaMap, IoAddCircleSharp, MdMessage, MdAccountcircle);

const app = createApp(App)

app.use(i18n)

app.component("v-icon", OhVueIcon);
app.use(createPinia())
app.use(router)
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
    language: 'no',
    region: 'NO'
  }
})
app.mount('#app')
