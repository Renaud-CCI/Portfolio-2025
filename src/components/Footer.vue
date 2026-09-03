<template>
  <footer class="py-10 px-4 md:px-12 border-t" :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <!-- Logo + identité -->
      <div class="flex flex-col items-center md:items-start text-center md:text-left">
        <img src="/images/favicon.ico" alt="Logo Renaud Bresson" class="w-12 h-12 mb-2" loading="lazy"
          decoding="async" />
        <p class="text-sm">© {{ year }} Renaud Bresson</p>
        <p class="text-xs opacity-70 mt-1">{{ t('nav.footer_citation') }}</p>
        <div id="ecoindex-badge"></div>
      </div>

      <!-- Liens internes -->
      <div class="flex flex-col items-center gap-3">
        <nav class="flex flex-wrap justify-center gap-4 text-sm">
          <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="hover:underline">
            {{ link.text }}
          </RouterLink>
        </nav>
        <nav class="flex flex-wrap justify-center gap-4 text-xs opacity-75">
          <RouterLink v-for="link in legalLinks" :key="link.to" :to="link.to" class="hover:underline">
            {{ link.text }}
          </RouterLink>
        </nav>
      </div>

      <!-- Réseaux + CV -->
      <div class="flex flex-col items-center gap-3">
        <div class="flex gap-4 text-xl">
          <a href="https://www.linkedin.com/in/renaud-bresson/" target="_blank" title="LinkedIn"
            class="hover:text-amber-500">
            <v-icon :icon="mdiLinkedin" />
          </a>
          <a href="https://github.com/Renaud-CCI" target="_blank" title="GitHub" class="hover:text-amber-500">
            <v-icon :icon="mdiGithub" />
          </a>
          <a href="mailto:contact@renaudbresson.dev" title="Email" class="hover:text-amber-500">
            <v-icon :icon="mdiEmailOutline" />
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
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { RouterLink } from 'vue-router'
import { mdiLinkedin, mdiGithub, mdiEmailOutline } from '@mdi/js'
import { useCVPath } from '@/composables/cv'
import { useLocalePath } from '@/composables/localePath'

const { cvPath } = useCVPath()

const { t } = useTranslation()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const year = new Date().getFullYear()

const { localePath } = useLocalePath()

const links = computed(() =>
  [
    { text: t('nav.home'), path: '/' },
    { text: t('nav.about'), path: '/about' },
    { text: t('nav.projects'), path: '/projects' },
    { text: t('nav.services'), path: '/services' },
    { text: t('nav.contact'), path: '/contact' },
  ].map((link) => ({ text: link.text, to: localePath(link.path) })),
)

const legalLinks = computed(() =>
  [
    { text: t('nav.legal'), path: '/legal' },
    { text: t('nav.privacy'), path: '/privacy' },
  ].map((link) => ({ text: link.text, to: localePath(link.path) })),
)

onMounted(() => {
  const existing = document.querySelector('script[data-ecoindex]') as HTMLScriptElement | null
  if (!existing) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/gh/cnumr/ecoindex_badge@3/assets/js/ecoindex-badge.js'
    script.defer = true
    script.async = true
    script.setAttribute('data-ecoindex', 'true')
    document.body.appendChild(script)
  }
})
</script>
