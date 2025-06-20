<template>
  <footer class="py-10 px-4 md:px-12 border-t" :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <!-- Logo + identité -->
      <div class="flex flex-col items-center md:items-start text-center md:text-left">
        <img src="/images/favicon.ico" alt="Logo Renaud Bresson" class="w-12 h-12 mb-2" />
        <p class="text-sm">© {{ year }} Renaud Bresson</p>
        <p class="text-xs opacity-70 mt-1">{{ t('nav.footer_citation') }}</p>
      </div>

      <!-- Liens internes -->
      <nav class="flex flex-wrap justify-center gap-4 text-sm">
        <RouterLink to="/" class="hover:underline">{{ t('nav.home') }}</RouterLink>
        <RouterLink to="/about" class="hover:underline">{{ t('nav.about') }}</RouterLink>
        <RouterLink to="/projects" class="hover:underline">{{ t('nav.projects') }}</RouterLink>
        <RouterLink to="/services" class="hover:underline">{{ t('nav.services') }}</RouterLink>
        <RouterLink to="/contact" class="hover:underline">{{ t('nav.contact') }}</RouterLink>
      </nav>

      <!-- Réseaux + CV -->
      <div class="flex flex-col items-center gap-3">
        <div class="flex gap-4 text-xl">
          <a href="https://www.linkedin.com/in/renaud-bresson/" target="_blank" title="LinkedIn"
            class="hover:text-amber-500">
            <v-icon icon="mdi-linkedin" />
          </a>
          <a href="https://github.com/Renaud-CCI" target="_blank" title="GitHub" class="hover:text-amber-500">
            <v-icon icon="mdi-github" />
          </a>
          <a href="mailto:contact@renaudbresson.dev" title="Email" class="hover:text-amber-500">
            <v-icon icon="mdi-email-outline" />
          </a>
        </div>
        <v-btn :href="cvPath" target="_blank" variant="outlined"
          class="text-sm border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
          {{ t('nav.download_cv') }}
        </v-btn>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({ name: 'FooterContainer' })
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { RouterLink } from 'vue-router'
import { useCVPath } from '@/composables/cv'

const { cvPath } = useCVPath()

const { t } = useTranslation()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const year = new Date().getFullYear()
</script>
