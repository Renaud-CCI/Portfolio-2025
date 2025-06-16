import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import type { App } from 'vue'
import resources from './locales'

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: 'fr',
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
