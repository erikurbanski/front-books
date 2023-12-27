import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'
import Toast from 'vue-toastification';

import '@/styles/index.css'
import '@/styles/app.css'
import 'vue-toastification/dist/index.css';

createApp(App)
.use(router)
.use(createPinia())
.use(Toast, {})
.mount('#app')
