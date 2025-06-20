<template>
  <section class="min-h-[90vh] py-16 px-4 md:px-12 transition-colors flex flex-col gap-16"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'">
    <!-- Illustration intro -->
    <div class="w-full md:w-2/3 mx-auto">
      <img src="/images/banner-teal.png" alt="Illustration À propos" class="w-full rounded-xl shadow-lg" />
    </div>

    <!-- Contenu principal -->
    <div class="md:w-3/4 mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('about.title') }}</h1>
      <h2 class="text-amber-500 text-xl md:text-2xl font-semibold mb-6">{{ t('about.subtitle') }}</h2>

      <p class="text-base md:text-lg mb-6 leading-relaxed">{{ t('about.bio_intro') }}</p>
      <p class="text-base md:text-lg mb-6 leading-relaxed" v-html="t('about.bio_skills', {
        laravel: '<strong>Laravel</strong>',
        vue: '<strong>Vue.js</strong>',
        sql: '<strong>SQL</strong>',
        php: '<strong>PHP natif</strong>',
        tailwind: '<strong>Tailwind CSS</strong>',
        wordpress: '<strong>WordPress</strong>',
        symfony: '<strong>Symfony</strong>',
        typescript: '<strong>TypeScript</strong>',
        reactNative: '<strong>React Native</strong>',
        git: '<strong>Git</strong>',
        notion: '<strong>Notion</strong>',
        trello: '<strong>Trello</strong>'
      })"></p>
      <p class="text-base md:text-lg mb-6 leading-relaxed">{{ t('about.bio_location') }}</p>
      <p class="text-base md:text-lg mb-6 leading-relaxed"
        v-html="t('about.bio_rqth', { rqth: '<strong>RQTH</strong>' })"></p>
      <p class="text-base md:text-lg mb-10 leading-relaxed">{{ t('about.bio_goals') }}</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <v-btn color="secondary" :to="'/projects'" class="text-white font-semibold">
          {{ t('about.view_projects') }}
        </v-btn>
        <v-btn :href="cvPath" target="_blank" variant="outlined" class="border-amber-500 text-amber-500">
          {{ t('about.download_cv') }}
        </v-btn>
      </div>
    </div>

    <!-- Diplômes -->
    <div class="mt-20 max-w-4xl mx-auto">
      <h3 class="text-2xl font-bold mb-10 mt-10 text-center">🎓 {{ t('about.diplomas_title') }}</h3>
      <div class="space-y-10 relative border-l-4 border-teal-500 pl-6">
        <div v-for="step in diplomas" :key="step.date" class="relative mt-6">
          <div
            class="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-teal-500 border-4 border-white dark:border-gray-900">
          </div>
          <div class="mb-1 text-sm font-semibold text-teal-600">{{ step.date }}</div>
          <div class="text-lg font-bold mb-1">{{ step.title }}</div>
          <div class="text-base text-gray-700 dark:text-gray-300">{{ step.description }}</div>
        </div>
      </div>
    </div>

    <!-- Timeline visuelle -->
    <div class="mt-20 max-w-4xl mx-auto">
      <h3 class="text-2xl font-bold mb-10 mt-10 text-center">💼 {{ t('about.timeline_title') }}</h3>
      <div class="space-y-10 relative border-l-4 border-amber-500 pl-6">
        <div v-for="step in timeline" :key="step.date" class="relative mt-6">
          <div
            class="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-amber-500 border-4 border-white dark:border-gray-900">
          </div>
          <div class="mb-1 text-sm font-semibold text-amber-600">{{ step.date }}</div>
          <div class="text-lg font-bold mb-1">{{ step.title }}</div>
          <div class="text-base text-gray-700 dark:text-gray-300">{{ step.description }}</div>
        </div>
      </div>
    </div>

    <!-- CTA vers la page Contact -->
    <div class="mt-20 text-center">
      <h3 class="text-2xl font-bold mb-4">{{ t('about.ready_to_talk') }}</h3>
      <p class="text-base md:text-lg mb-6 leading-relaxed">
        {{ t('about.invite_contact') }}
      </p>
      <v-btn color="secondary" :to="'/contact'" class="text-white font-semibold">
        {{ t('about.contact_me') }}
      </v-btn>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'AboutContainer' })
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { useCVPath } from '@/composables/cv'

const { t } = useTranslation()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const { cvPath } = useCVPath()

// Récupérez la timeline depuis les traductions
const timeline = computed(() => {
  // L'option returnObjects: true est essentielle pour récupérer le tableau complet
  return t('about.timeline', { returnObjects: true }) as Array<{
    date: string;
    title: string;
    description: string;
  }>;
})

const diplomas = computed(() => {
  return t('about.diplomas', { returnObjects: true }) as Array<{
    date: string;
    title: string;
    description: string;
  }>;
})
</script>

<style scoped></style>
