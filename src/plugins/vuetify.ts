import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
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
