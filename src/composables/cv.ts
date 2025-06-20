import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'

export function useCVPath() {
  const { i18next } = useTranslation()

  const cvPath = computed(() => {
    const locale = i18next.language
    return locale === 'fr' ? '/RenaudBresson_CV_fr.pdf' : '/RenaudBresson_CV_en.pdf'
  })

  return { cvPath }
}
