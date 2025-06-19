import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import FontAwesomeIcon from './plugins/fontawesome'

const app = i18n(createApp(App))

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(vuetify)

app.mount('#app')
