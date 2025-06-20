<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2" class="px-4">

      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <v-toolbar-title class="text-h5 font-weight-bold">
        <RouterLink to="/" class="text-white text-decoration-none">
          Renaud Bresson
        </RouterLink>
      </v-toolbar-title>

      <v-btn variant="text" class="d-none d-sm-flex text-capitalize text-body-2 font-weight-medium"
        v-for="link in links" :key="link.text" :to="link.to"
        :class="{ 'border-b-2 border-secondary': route.path === link.to }">
        {{ link.text }}
      </v-btn>


      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="changeTheme">
            <v-list-item-title>{{ isDark ? t('nav.light_mode') : t('nav.dark_mode') }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="changeLanguage('fr')">
            <v-list-item-title>Français</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changeLanguage('en')">
            <v-list-item-title>English</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary class="d-sm-none">
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" @click="closeDrawer()">
          <v-list-item-title>
            <RouterLink :to="link.to">{{ link.text }}</RouterLink>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { useTranslation } from 'i18next-vue'
import i18next from 'i18next'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import Footer from './components/Footer.vue'

const route = useRoute()

const drawer = ref(false)

const closeDrawer = () => {
  setTimeout(() => {
    drawer.value = false
  }, 150)
}

const currentLanguage = ref<'fr' | 'en'>(i18next.language as 'fr' | 'en')
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

function changeTheme() {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

const { t } = useTranslation()

const links = computed(() => [
  { text: t('nav.home'), to: '/' },
  { text: t('nav.about'), to: '/about' },
  { text: t('nav.projects'), to: '/projects' },
  { text: t('nav.services'), to: '/services' },
  { text: t('nav.contact'), to: '/contact' },
])


const changeLanguage = (lng: string) => {
  i18next.changeLanguage(lng)
  if (lng === 'fr' || lng === 'en') {
    currentLanguage.value = lng
  }
}

i18next.on('languageChanged', (lng) => {
  if (lng === 'fr' || lng === 'en') {
    currentLanguage.value = lng
  }
})

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  theme.global.name.value = prefersDark ? 'dark' : 'light'
})
</script>

<style scoped></style>
