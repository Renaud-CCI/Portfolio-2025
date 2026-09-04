<template>
  <section
    class="min-h-[80vh] py-16 px-4 md:px-12 flex items-center justify-center transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
  >
    <div class="max-w-xl mx-auto text-center">
      <font-awesome-icon :icon="['fas', 'circle-check']" class="text-5xl text-teal-600 mb-6" />
      <h1 class="text-3xl md:text-4xl font-bold text-teal-600 mb-4">
        {{ t('contact.success.title') }}
      </h1>
      <p class="text-lg mb-10" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        {{ t('contact.success.message') }}
      </p>
      <RouterLink
        :to="localePath('/')"
        class="inline-block px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-md hover:bg-teal-700 transition"
      >
        {{ t('contact.success.back') }}
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContactSuccessPage' })
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'
import { RouterLink } from 'vue-router'
import { useLocalePath } from '@/composables/localePath'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { t } = useTranslation()
const { localePath } = useLocalePath()
</script>

<style scoped></style>
