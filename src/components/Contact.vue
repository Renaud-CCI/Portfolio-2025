<template>
  <section class="min-h-[80vh] py-16 px-4 md:px-12 transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-teal-600 mb-6">
        {{ t('contact.title') }}
      </h1>
      <p class="text-lg mb-10 text-gray-600 dark:text-gray-300">
        {{ t('contact.intro') }}
      </p>

      <!-- Bloc photo + réseaux sociaux -->
      <div class="flex flex-col items-center justify-center mb-10 space-y-4">
        <img src="/images/pp-teal.png" alt="Photo de Renaud Bresson"
          class="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-teal-600 shadow" />

        <div class="flex gap-6">
          <a href="https://www.linkedin.com/in/renaud-bresson" target="_blank" rel="noopener" class="group">
            <font-awesome-icon :icon="['fab', 'linkedin']"
              class="text-4xl md:text-5xl text-teal-600 group-hover:text-amber-500 transition" />
          </a>
          <a href="https://github.com/Renaud-CCI" target="_blank" rel="noopener" class="group">
            <font-awesome-icon :icon="['fab', 'github']"
              class="text-4xl md:text-5xl text-teal-600 group-hover:text-amber-500 transition" />
          </a>
        </div>
      </div>

      <!-- Formulaire -->
      <form action="https://formspree.io/f/mgvyzgdy" method="POST" class="max-w-xl mx-auto text-left space-y-6">
        <div>
          <label for="name" class="block font-medium mb-1">{{ t('contact.name') }}</label>
          <input id="name" type="text" name="name" required
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-teal-500" />
        </div>

        <div>
          <label for="email" class="block font-medium mb-1">{{ t('contact.email') }}</label>
          <input id="email" type="email" name="email" required
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-teal-500" />
        </div>

        <div>
          <label for="message" class="block font-medium mb-1">{{ t('contact.message') }}</label>
          <textarea id="message" name="message" rows="5" required
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-teal-500"></textarea>
        </div>

        <div class="text-center flex justify-center items-center mt-6">
          <div class="w-1/2 md:w-1/3">
            <v-btn type="submit" color="secondary"
              class="text-white font-semibold px-6 py-3 rounded-lg transition shadow-md" block>
              {{ t('contact.submit') }}
            </v-btn>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { useTranslation } from 'i18next-vue'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { t } = useTranslation()
</script>


<script lang="ts">
export default {
  name: 'ContactView',
  // You can add props, data, methods, etc. here if needed
  // For example, if you want to use Vuex or Pinia for state management, you can import and use them here.
};
</script>


<style scoped></style>
