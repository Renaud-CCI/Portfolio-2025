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
    // Cible de redirection du POST classique du formulaire de contact (voir
    // src/legal.ts, MAIL_ENDPOINT). Pas de lien dedans, pas de contenu propre :
    // hors sitemap et hors prérendu, comme /legal et /privacy le sont pour la
    // barre de navigation.
    {
      path: '/contact/merci',
      alias: '/en/contact/merci',
      name: 'contactSuccess',
      component: () => import('@/components/ContactSuccess.vue'),
    },
    {
      path: '/services',
      alias: '/en/services',
      name: 'services',
      component: () => import('@/components/Services.vue'),
    },
    // Pages légales : accessibles depuis le pied de page seulement, pas depuis
    // la barre de navigation.
    {
      path: '/legal',
      alias: '/en/legal',
      name: 'legal',
      component: () => import('@/components/Legal.vue'),
    },
    {
      path: '/privacy',
      alias: '/en/privacy',
      name: 'privacy',
      component: () => import('@/components/Privacy.vue'),
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
