import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: prefersDark ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0D9488', // Teal 600 (bg navbar)
          secondary: '#F59E0B', // Amber 500 (accent)
          accent: '#14B8A6', // Teal 500 (hover / buttons)
          background: '#F9FAFB', // Gray 50
          surface: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#0D9488',
          secondary: '#FBBF24',
          accent: '#2DD4BF',
          background: '#25303F',
          surface: '#111827',
        },
      },
    },
  },
})
