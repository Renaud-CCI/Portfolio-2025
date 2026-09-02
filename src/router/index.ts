import { createRouter, createWebHistory } from 'vue-router'
import i18next from 'i18next'
import Home from '@/components/Home.vue'
import { langFromPath } from '@/lang-path'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return {
        ...savedPosition,
        behavior: 'smooth',
      }
    }

    // Pour les liens normaux et les hashtags
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 60, // Prendre en compte une barre de navigation fixe
      }
    }

    // Pour les autres navigations, aller en haut
    return {
      top: 0,
      behavior: 'smooth',
    }
  },
  routes: [
    {
      path: '/',
      alias: ['/en', '/en/'],
      name: 'home',
      component: Home,
    },
    {
      path: '/projects',
      alias: '/en/projects',
      name: 'projects',
      component: () => import('@/components/Projects.vue'),
    },
    {
      path: '/about',
      alias: '/en/about',
      name: 'about',
      component: () => import('@/components/About.vue'),
    },
    {
      path: '/contact',
      alias: '/en/contact',
      name: 'contact',
      component: () => import('@/components/Contact.vue'),
    },
    {
      path: '/services',
      alias: '/en/services',
      name: 'services',
      component: () => import('@/components/Services.vue'),
    },
  ],
})

// Le chemin fait autorité sur la langue : c'est ce qui rend chaque version
// prérendable et indexable séparément.
router.beforeEach(async (to) => {
  const target = langFromPath(to.path)
  if (i18next.language !== target) {
    await i18next.changeLanguage(target)
  }
})

export default router
