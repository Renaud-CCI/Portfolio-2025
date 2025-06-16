<template>
  <div class="hero-container relative overflow-hidden">
    <!-- Image de fond avec parallaxe -->
    <div ref="parallaxBg" class="absolute inset-0 h-[140%] w-full -z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-teal-700/65 z-10"
        :class="isDark ? 'to-black/75' : 'to-black/5'"></div>
      <img src="/images/forest-hero.png" alt="Background" class="w-full h-full object-cover" />
    </div>

    <!-- Contenu de la section héro -->
    <section ref="heroSection"
      class="hero-content relative flex flex-col items-center justify-center min-h-[90vh] text-white text-center px-4 z-10">
      <div ref="heroContent">
        <h1 ref="heroTitle" class="text-4xl md:text-6xl font-bold mb-4">Renaud Bresson</h1>
        <h2 ref="heroSubtitle" class="text-amber-400 text-xl md:text-2xl font-semibold mb-8">
          {{ t('home.full_stack_developer') }}
        </h2>
        <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <v-btn color="secondary" class="font-semibold text-white text-base px-4 w-1/2 sm:w-auto min-w-0"
            to="/projects">
            {{ t('nav.view_projects') }}
          </v-btn>
          <v-btn variant="outlined" class="font-semibold text-white text-base border-white px-4 w-1/2 sm:w-auto min-w-0"
            to="/contact">
            {{ t('nav.contact_me') }}
          </v-btn>
        </div>
        <p ref="heroText"
          class="mt-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white/90 dark:text-white/80">
          {{ t('home.intro_text') }}
        </p>
      </div>
    </section>
  </div>

  <!-- À propos -->
  <section class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'">
    <!-- Illustration -->
    <div class="w-2/3 sm:w-1/2">
      <img src="/images/section-about.png" alt="Illustration À propos" class="w-full max-w-md mx-auto" />
    </div>

    <!-- Texte -->
    <div class="md:w-1/2 text-center md:text-left">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.about_title') }}</h2>
      <h3 class="text-amber-500 text-xl md:text-2xl font-semibold mb-4">
        {{ t('home.about_subtitle') }}
      </h3>
      <p class="text-base md:text-lg mb-6 leading-relaxed">
        {{ t('home.about_text') }}
      </p>
      <v-btn color="secondary" :to="'/about'" class="text-white font-semibold">
        {{ t('home.about_cta') }}
      </v-btn>
      <v-btn href="/docs/cv-renaud-bresson.pdf" target="_blank" download variant="outlined"
        class="text-amber-500 border-amber-500 ml-0 ml-sm-4 mt-4 mt-sm-0">
        {{ t('home.about_download_cv') }}
      </v-btn>
    </div>
  </section>

  <!-- Portfolio -->
  <section class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
    :class="isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
    <!-- Texte -->
    <div class="md:w-1/2 text-center md:text-left">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.projects_title') }}</h2>
      <h3 class="text-amber-500 text-xl md:text-2xl font-semibold mb-4">
        {{ t('home.projects_subtitle') }}
      </h3>
      <p class="text-base md:text-lg mb-6 leading-relaxed">
        {{ t('home.projects_text') }}
      </p>
      <v-btn color="secondary" :to="'/projects'" class="text-white font-semibold">
        {{ t('home.projects_cta') }}
      </v-btn>
    </div>

    <!-- Illustration -->
    <div class="w-1/2">
      <img src="/images/section-projects.png" alt="Illustration section projets"
        class="w-full max-w-md mx-auto rounded-xl" />
    </div>
  </section>

  <!-- Services -->
  <section class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'">
    <!-- Illustration -->
    <div class="w-1/2">
      <img src="/images/section-services.png" alt="Illustration section services"
        class="w-full max-w-md mx-auto rounded-xl" />
    </div>

    <!-- Texte -->
    <div class="md:w-1/2 text-center md:text-left">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.services_title') }}</h2>
      <h3 class="text-amber-500 text-xl md:text-2xl font-semibold mb-4">
        {{ t('home.services_subtitle') }}
      </h3>
      <p class="text-base md:text-lg mb-6 leading-relaxed">
        {{ t('home.services_text') }}
      </p>
      <v-btn color="secondary" :to="'/services'" class="text-white font-semibold">
        {{ t('home.services_cta') }}
      </v-btn>
    </div>
  </section>

  <!-- Contact -->
  <section class="py-16 px-4 md:px-12 transition-colors flex flex-col md:flex-row items-center justify-between gap-8"
    :class="isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'">
    <!-- Texte -->
    <div class="md:w-1/2 text-center md:text-left">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ t('home.contact_title') }}</h2>
      <h3 class="text-amber-500 text-xl md:text-2xl font-semibold mb-4">
        {{ t('home.contact_subtitle') }}
      </h3>
      <p class="text-base md:text-lg mb-6 leading-relaxed">
        {{ t('home.contact_text') }}
      </p>
      <v-btn color="secondary" :to="'/contact'" class="text-white font-semibold">
        {{ t('home.contact_cta') }}
      </v-btn>
    </div>

    <!-- Illustration -->
    <div class="w-1/2">
      <img src="/images/section-contact.png" alt="Illustration contact" class="w-full max-w-md mx-auto rounded-xl" />
    </div>
  </section>

</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' })
import { useTranslation } from 'i18next-vue'
import { computed, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const { t } = useTranslation()

gsap.registerPlugin(ScrollTrigger)

// Références pour les animations
const heroSection = ref<HTMLElement | null>(null)
const parallaxBg = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroSubtitle = ref<HTMLElement | null>(null)
const heroButtons = ref<HTMLElement | null>(null)
const heroText = ref<HTMLElement | null>(null)

// Références pour les sections
// const sections = ref<HTMLElement[]>([])

onMounted(() => {
  // Initialisation manuelle des états de départ
  if (heroTitle.value) gsap.set(heroTitle.value, { opacity: 0, y: 30 });
  if (heroSubtitle.value) gsap.set(heroSubtitle.value, { opacity: 0, y: 30 });
  if (heroButtons.value) gsap.set(heroButtons.value, { opacity: 0, y: 30 });
  if (heroText.value) gsap.set(heroText.value, { opacity: 0, y: 30 });

  // Animation de parallaxe pour l'arrière-plan
  if (parallaxBg.value) {
    gsap.to(parallaxBg.value, {
      y: '-35%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-container',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
  }

  // Animation avec fromTo au lieu de to
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTimeline
    .fromTo(heroTitle.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2 }
    )
    .fromTo(heroSubtitle.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.7'
    )
    .fromTo(heroButtons.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.7'
    )
    .fromTo(heroText.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.7'
    );

  // Animations d'apparition pour les autres sections
  const sectionElements = document.querySelectorAll('section:not(#heroSection)');
  sectionElements.forEach(section => {
    // Animation pour les titres
    const title = section.querySelector('h2');
    if (title) {
      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Animation pour les sous-titres
    const subtitle = section.querySelector('h3');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: subtitle,
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Animation pour les paragraphes
    const paragraph = section.querySelector('p');
    if (paragraph) {
      gsap.fromTo(paragraph,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          scrollTrigger: {
            trigger: paragraph,
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Animation pour les images
    const image = section.querySelector('img');
    if (image) {
      gsap.fromTo(image,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: image,
            start: 'top bottom-=50',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Animation pour les boutons
    const button = section.querySelector('.v-btn');
    if (button) {
      gsap.fromTo(button,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.6,
          scrollTrigger: {
            trigger: button,
            start: 'top bottom-=50',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
})
</script>

<style scoped>
/* Ajouter des classes initiales pour les animations */
#heroTitle,
#heroSubtitle,
#heroButtons,
#heroText {
  transform: translateY(30px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

/* Style pour la section héro */
.hero-container {
  height: 90vh;
}

/* Animation hover pour les boutons */
.v-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
</style>
