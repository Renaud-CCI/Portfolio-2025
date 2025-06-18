import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import Home from '@/components/Home.vue'
import Projects from '@/components/Projects.vue'
import About from '@/components/About.vue'
import Contact from '@/components/Contact.vue'
import Services from '@/components/Services.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    savedPosition?: any,
  ) {
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
      name: 'home',
      component: Home,
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
    },
    {
      path: '/services',
      name: 'services',
      component: Services,
    },
  ],
})

export default router
