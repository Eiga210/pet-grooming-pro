//建立APP
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

//router插件
import router from './router'
app.use(router)

//pinia插件
import { createPinia } from 'pinia'
import persisted from "pinia-plugin-persistedstate"
const pinia = createPinia();
pinia.use(persisted)
app.use(pinia)

//vuetify 插件
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
})
app.use(vuetify);

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'datatables.net-dt/css/dataTables.dataTables.css'
import 'datatables.net';


//掛載app
app.mount('#app')
