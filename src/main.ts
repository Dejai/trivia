import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Setup App
const app = createApp(App)
app.use(createPinia())
    .use(router)
    .mount('#app')
