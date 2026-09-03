<template>
  <section
    class="min-h-[80vh] py-16 px-4 md:px-12 transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
  >
    <article class="max-w-3xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{{ title }}</h1>
      <p class="text-sm mb-10" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        {{ t('legal.updated', { date: updatedOn }) }}
      </p>

      <slot />

      <p
        class="mt-14 pt-6 border-t text-sm"
        :class="isDark ? 'border-gray-700' : 'border-gray-300'"
      >
        <RouterLink :to="localePath(otherPath)" class="text-teal-600 hover:underline">
          {{ otherLabel }}
        </RouterLink>
      </p>
    </article>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'LegalLayout' })
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { RouterLink } from 'vue-router'
import { LEGAL } from '@/legal'
import { useLocalePath } from '@/composables/localePath'

defineProps<{ title: string; otherPath: string; otherLabel: string }>()

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { t, i18next } = useTranslation()
const { localePath } = useLocalePath()

// La date de mise à jour vit dans src/legal.ts, pas dans les JSON : Intl la rend
// dans la langue active plutôt que d'imposer deux formulations à maintenir.
// « en » seul donnerait la date au format américain, alors que le site s'annonce
// en en_GB dans ses balises Open Graph.
const updatedOn = computed(() =>
  new Intl.DateTimeFormat(i18next.language === 'en' ? 'en-GB' : 'fr-FR', {
    dateStyle: 'long',
  }).format(new Date(LEGAL.updated)),
)
</script>
