import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import i18next from 'i18next'
import FontAwesomeIcon from './plugins/fontawesome'

const app = i18n(createApp(App))

i18next.on('languageChanged', (lng: string) => {
  document.documentElement.lang = lng
})

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(router)
app.use(vuetify)

app.mount('#app')
