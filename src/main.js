import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import './index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('VueDatePicker', VueDatePicker);

app.mount('#app')
