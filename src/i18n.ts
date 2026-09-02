import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import type { App } from 'vue'
import resources from './locales'

i18next.init({
  debug: false,
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: resources.en,
    },
    fr: {
      translation: resources.fr,
    },
  },
})

export default function (app: App) {
  app.use(I18NextVue, { i18next })
  return app
}
