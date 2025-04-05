import './assets/main.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { MdStaroutlineRound, OiStarFill} from 'oh-vue-icons/icons';


addIcons(MdStaroutlineRound, OiStarFill);

const app = createApp(App)

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
