import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue, { ripple: true })
app.mount('#app')
