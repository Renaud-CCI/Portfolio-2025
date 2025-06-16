<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <v-toolbar-title>Renaud Bresson</v-toolbar-title>

      <v-spacer />

      <v-btn v-for="link in links" :key="link.text" :to="link.to" variant="text" class="d-none d-sm-flex">
        {{ link.text }}
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
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
        <v-list-item v-for="link in links" :key="link.text" @click="drawer = false">
          <v-list-item-title>
            <RouterLink :to="link.to">{{ link.text }}</RouterLink>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import i18next from 'i18next'

const drawer = ref(false)

const currentLanguage = ref(i18next.language)

const { t } = useTranslation()

const links = computed(() => [
  { text: t('nav.home'), to: '/' },
  { text: t('nav.projects'), to: '/projects' },
  { text: t('nav.about'), to: '/about' },
  { text: t('nav.contact'), to: '/contact' },
])

const changeLanguage = (lng: string) => {
  i18next.changeLanguage(lng)
  // Mise à jour de la variable réactive
  currentLanguage.value = lng
}

// Écouter les changements de langue pour s'assurer que l'UI se met à jour
i18next.on('languageChanged', (lng) => {
  currentLanguage.value = lng
})
</script>

<style scoped></style>
