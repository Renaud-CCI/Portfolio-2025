<template>
  <v-app>
    <v-app-bar app color="primary" dark elevation="2" class="px-4">

      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <v-toolbar-title class="text-h5 font-weight-bold">
        <RouterLink :to="localePath('/')" class="text-white text-decoration-none">
          Renaud Bresson
        </RouterLink>
      </v-toolbar-title>

      <v-btn variant="text" class="d-none d-sm-flex text-capitalize text-body-2 font-weight-medium"
        v-for="link in links" :key="link.text" :to="link.to"
        :class="{ 'nav-active': route.path === link.to }">
        {{ link.text }}
      </v-btn>


      <v-menu v-model="settingsMenu">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" :aria-label="t('nav.settings')" :title="t('nav.settings')" aria-haspopup="menu"
            :aria-expanded="settingsMenu" aria-controls="settings-menu">
            <v-icon :icon="mdiCog" aria-hidden="true" />
          </v-btn>
        </template>
        <v-list id="settings-menu">
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
import { useTheme } from 'vuetify'
import { useRoute, useRouter } from 'vue-router'
import { mdiCog } from '@mdi/js'
import { pathForLang, type Lang } from '@/lang-path'
import { useLocalePath } from '@/composables/localePath'
import Footer from './components/Footer.vue'

const route = useRoute()
const router = useRouter()
const { localePath } = useLocalePath()

const drawer = ref(false)
const settingsMenu = ref(false)

const closeDrawer = () => {
  setTimeout(() => {
    drawer.value = false
  }, 150)
}

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const THEME_KEY = 'theme'

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

function changeTheme() {
  const next = isDark.value ? 'light' : 'dark'
  theme.global.name.value = next
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // navigation privée ou stockage refusé : le choix ne survivra pas au rechargement
  }
}

const { t } = useTranslation()

const links = computed(() =>
  [
    { text: t('nav.home'), path: '/' },
    { text: t('nav.about'), path: '/about' },
    { text: t('nav.projects'), path: '/projects' },
    { text: t('nav.services'), path: '/services' },
    { text: t('nav.contact'), path: '/contact' },
  ].map((link) => ({ text: link.text, to: localePath(link.path) })),
)

const changeLanguage = (lng: Lang) => {
  void router.push(pathForLang(route.path, lng))
}

onMounted(() => {
  const stored = readStoredTheme()
  if (stored === 'dark' || stored === 'light') {
    theme.global.name.value = stored
    return
  }
  theme.global.name.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
})
</script>

<style scoped>
/* Hors couche CSS, donc prioritaire sur Vuetify : un utilitaire Tailwind,
   émis dans @layer utilities, perdrait contre .v-btn. */
.nav-active {
  border-bottom: 2px solid rgb(var(--v-theme-secondary));
}
</style>
