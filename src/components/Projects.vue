<template>
  <section class="min-h-[90vh] py-16 px-4 md:px-12 transition-colors"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
    <h1 class="text-4xl md:text-5xl font-bold text-center mb-12 text-teal-600">
      {{ t('portfolio.title') }}
    </h1>

    <p class="max-w-3xl mx-auto text-center text-base md:text-lg text-gray-600 dark:text-gray-300 mb-12">
      {{ t('portfolio.intro') }}
    </p>

    <!-- Grid des projets -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id"
        class="bg-white/10 hover:bg-white/20 dark:bg-black/20 hover:dark:bg-black/30 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
        @click="openProject(project)">
        <img :src="project.image" :alt="t(`portfolio.projects.${project.id}.title`)" class="w-full h-48" loading="lazy"
          decoding="async" />
        <div class="py-2 px-4">
          <h2 class="text-xl font-bold mb-2 text-amber-500">{{ t(`portfolio.projects.${project.id}.title`) }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t(`portfolio.projects.${project.id}.description`) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Pop-up projet -->
    <ProjectPopup :model-value="showPopup" :project="selectedProject" @update:modelValue="showPopup = $event" />
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProjectsPage' })
import { ref, computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import { useTheme } from 'vuetify'
import ProjectPopup from '../components/ProjectPopup.vue'

const { t } = useTranslation()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const showPopup = ref(false)
interface Project {
  id: string
  image: string
  link: string
  github: string
}

const selectedProject = ref<Project | null>(null)

const openProject = (project: Project) => {
  selectedProject.value = project
  showPopup.value = true
}

const projects: Project[] = [
  { id: 'shinefulness', image: '/images/portfolio/shinefulness.png', link: 'https://www.shinefulness.com/', github: '' },
  { id: 'pepe', image: '/images/portfolio/pepelaboulange.png', link: 'https://www.pepelaboulange.fr/', github: '' },
  { id: 'plantes', image: '/images/portfolio/revisions2plantes.png', link: 'https://revisions2plantes.vercel.app/', github: 'https://github.com/Renaud-CCI/revisions2plantes' },
  { id: 'simpsons', image: '/images/portfolio/simpsonsFight.png', link: 'https://simpsons-fight.vercel.app/', github: 'https://github.com/Renaud-CCI/2023-06-26_sample-random-rumble-angular' },
  { id: 'puissance4', image: '/images/portfolio/puissance4.png', link: 'https://puissance4-zeta.vercel.app/', github: 'https://github.com/Renaud-CCI/Puissance4' }
]
</script>

<style scoped></style>
