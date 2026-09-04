<template>
  <section class="py-16 px-4 md:px-12 transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">

    <!-- Titre + intro -->
    <h1 class="text-4xl md:text-5xl font-bold text-center mb-6 text-teal-600">
      {{ t('services.title') }}
    </h1>
    <p class="max-w-3xl mx-auto text-center text-base md:text-lg mb-12"
      :class="isDark ? 'text-gray-300' : 'text-gray-600'">
      {{ t('services.intro') }}
    </p>

    <!-- Cartes -->
    <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div v-for="(item, key) in serviceKeys" :key="key"
        class="rounded-xl px-6 py-4 shadow-md border-t hover:ring-2 hover:ring-amber-400/60 hover:shadow-lg transition-all duration-300"
        :class="isDark ? 'bg-black/20 hover:bg-black/30 border-white/10' : 'bg-white/10 hover:bg-white/20 border-white/30'">
        <h2 class="text-xl font-bold mb-2 text-amber-500">
          {{ t(`services.items.${item}.title`) }}
        </h2>
        <p class="text-base" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          {{ t(`services.items.${item}.description`) }}
        </p>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center !mt-16">
      <v-btn color="secondary" :to="localePath('/contact')" class="text-white font-semibold px-6 py-3">
        {{ t('services.cta') }}
      </v-btn>
    </div>

    <!-- Illustrations -->
    <div class="flex flex-col md:flex-row justify-center items-center mt-12">
      <img src="/images/section-services-handshake-sm.webp" alt="Illustration complémentaire"
        class="w-full max-w-md rounded-xl" loading="lazy" decoding="async" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ServicesContainer' })
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { useLocalePath } from '@/composables/localePath'

const { t } = useTranslation()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { localePath } = useLocalePath()

const serviceKeys = ['backend', 'frontend', 'delivery', 'maintenance']
</script>
