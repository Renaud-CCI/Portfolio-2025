<template>
  <div :class="{ 'anim-pending': hideBeforeAnim }">
    <div class="hero-container relative overflow-hidden">
      <!-- Image de fond avec parallaxe -->
      <div ref="parallaxBg" class="absolute inset-0 h-[140%] w-full -z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-teal-700/65 z-10"
          :class="isDark ? 'to-black/75' : 'to-black/5'"></div>
        <img src="/images/forest-hero-sm.webp" alt="Background" class="w-full h-full object-cover"
          fetchpriority="high" decoding="async" />
      </div>

      <!-- Contenu de la section héro -->
      <section
        class="hero-content relative flex flex-col items-center justify-center min-h-[90vh] text-white text-center px-4 z-10">
        <div>
          <h1 ref="heroTitle" class="anim-item hero-text text-4xl md:text-6xl font-bold mb-4">Renaud Bresson</h1>
          <h2 ref="heroSubtitle" class="anim-item hero-text text-amber-400 text-xl md:text-2xl font-semibold mb-8">
            {{ t('home.full_stack_developer') }}
          </h2>
          <div ref="heroButtons" class="anim-item flex flex-col sm:flex-row gap-4 justify-center items-center">
            <v-btn color="secondary" class="font-semibold text-white text-base px-4 w-1/2 sm:w-auto min-w-0"
              :to="localePath('/projects')">
              {{ t('nav.view_projects') }}
            </v-btn>
            <v-btn variant="outlined" class="font-semibold text-white text-base border-white px-4 w-1/2 sm:w-auto min-w-0"
              :to="localePath('/contact')">
              {{ t('nav.contact_me') }}
            </v-btn>
          </div>
          <p ref="heroText"
            class="anim-item hero-text mt-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/90 dark:text-white/80">
            {{ t('home.intro_text') }}
          </p>
        </div>
      </section>
    </div>

    <!-- À propos -->
    <section data-animate
      class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
      :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'">
      <!-- Illustration -->
      <div class="w-2/3 md:w-1/2 flex justify-center items-center">
        <img src="/images/section-about.webp" alt="Illustration À propos"
          class="anim-image w-full md:w-2/3 lg:w-full max-w-md mx-auto" loading="lazy" decoding="async" />
      </div>

      <!-- Texte -->
      <div class="md:w-1/2 text-center md:text-left">
        <h2 class="anim-item text-3xl md:text-4xl font-bold mb-4">{{ t('home.about_title') }}</h2>
        <h3 class="anim-item text-amber-500 text-xl md:text-2xl font-semibold mb-4">
          {{ t('home.about_subtitle') }}
        </h3>
        <p class="anim-item text-base md:text-lg mb-6 leading-relaxed">
          {{ t('home.about_text') }}
        </p>
        <v-btn color="secondary" :to="localePath('/about')" class="anim-item text-white font-semibold">
          {{ t('home.about_cta') }}
        </v-btn>
        <v-btn :href="cvPath" target="_blank" variant="outlined"
          class="anim-item text-amber-500 border-amber-500 ml-0 ml-sm-4 mr-sm-4 mt-4 mt-md-0">
          {{ t('home.about_download_cv') }}
        </v-btn>
      </div>
    </section>

    <!-- Portfolio -->
    <section data-animate
      class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
      :class="isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
      <!-- Texte -->
      <div class="md:w-1/2 text-center md:text-left">
        <h2 class="anim-item text-3xl md:text-4xl font-bold mb-4">{{ t('home.projects_title') }}</h2>
        <h3 class="anim-item text-amber-500 text-xl md:text-2xl font-semibold mb-4">
          {{ t('home.projects_subtitle') }}
        </h3>
        <p class="anim-item text-base md:text-lg mb-6 leading-relaxed">
          {{ t('home.projects_text') }}
        </p>
        <v-btn color="secondary" :to="localePath('/projects')" class="anim-item text-white font-semibold">
          {{ t('home.projects_cta') }}
        </v-btn>
      </div>

      <!-- Illustration -->
      <div class="w-1/2">
        <img src="/images/section-projects.webp" alt="Illustration section projets"
          class="anim-image w-full max-w-md mx-auto rounded-xl" loading="lazy" decoding="async" />
      </div>
    </section>

    <!-- Services -->
    <section data-animate
      class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
      :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'">
      <!-- Illustration -->
      <div class="w-1/2">
        <img src="/images/section-services.webp" alt="Illustration section services"
          class="anim-image w-full max-w-md mx-auto rounded-xl" loading="lazy" decoding="async" />
      </div>

      <!-- Texte -->
      <div class="md:w-1/2 text-center md:text-left">
        <h2 class="anim-item text-3xl md:text-4xl font-bold mb-4">{{ t('home.services_title') }}</h2>
        <h3 class="anim-item text-amber-500 text-xl md:text-2xl font-semibold mb-4">
          {{ t('home.services_subtitle') }}
        </h3>
        <p class="anim-item text-base md:text-lg mb-6 leading-relaxed">
          {{ t('home.services_text') }}
        </p>
        <v-btn color="secondary" :to="localePath('/services')" class="anim-item text-white font-semibold">
          {{ t('home.services_cta') }}
        </v-btn>
      </div>
    </section>

    <!-- Contact -->
    <section data-animate
      class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
      :class="isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
      <!-- Texte -->
      <div class="md:w-1/2 text-center md:text-left">
        <h2 class="anim-item text-3xl md:text-4xl font-bold mb-4">{{ t('home.contact_title') }}</h2>
        <h3 class="anim-item text-amber-500 text-xl md:text-2xl font-semibold mb-4">
          {{ t('home.contact_subtitle') }}
        </h3>
        <p class="anim-item text-base md:text-lg mb-6 leading-relaxed">
          {{ t('home.contact_text') }}
        </p>
        <v-btn color="secondary" :to="localePath('/contact')" class="anim-item text-white font-semibold">
          {{ t('home.contact_cta') }}
        </v-btn>
      </div>

      <!-- Illustration -->
      <div class="w-1/2">
        <img src="/images/section-contact.webp" alt="Illustration contact"
          class="anim-image w-full max-w-md mx-auto rounded-xl" loading="lazy" decoding="async" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' })
import { useTranslation } from 'i18next-vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useCVPath } from '@/composables/cv'
import { useLocalePath } from '@/composables/localePath'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { t } = useTranslation()

const { cvPath } = useCVPath()
const { localePath } = useLocalePath()

const parallaxBg = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const heroButtons = ref<HTMLElement | null>(null)
const heroText = ref<HTMLElement | null>(null)

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Masque les éléments animés dès le premier rendu : GSAP arrive en import
// différé, sans ça le contenu s'affiche puis disparaît avant l'animation.
const hideBeforeAnim = ref(!reducedMotion)

let ctx: { revert: () => void } | undefined

onMounted(async () => {
  if (reducedMotion) return

  try {
    const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    gsap.registerPlugin(ScrollTrigger)

    ctx = gsap.context(() => {
      if (parallaxBg.value) {
        gsap.to(parallaxBg.value, {
          y: '-35%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-container',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out', duration: 1 } })
        .fromTo(heroTitle.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0, delay: 0.2 })
        .fromTo(heroSubtitle.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.7')
        .fromTo(heroButtons.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.7')
        .fromTo(heroText.value, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.7')

      document.querySelectorAll('section[data-animate]').forEach((section) => {
        const items = section.querySelectorAll('.anim-item')
        if (items.length) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              scrollTrigger: { trigger: section, start: 'top bottom-=100' },
            },
          )
        }

        const image = section.querySelector('.anim-image')
        if (image) {
          gsap.fromTo(
            image,
            { opacity: 0, scale: 0.9 },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              scrollTrigger: { trigger: image, start: 'top bottom-=50' },
            },
          )
        }
      })
    })
  } finally {
    hideBeforeAnim.value = false
  }
})

onBeforeUnmount(() => ctx?.revert())
</script>

<style scoped>
.anim-pending .anim-item,
.anim-pending .anim-image {
  opacity: 0;
}

.hero-text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

.hero-container {
  height: 94vh;
}

.v-btn {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
</style>
