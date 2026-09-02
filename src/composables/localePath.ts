import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { langFromPath, pathForLang } from '@/lang-path'

export function useLocalePath() {
  const route = useRoute()
  const lang = computed(() => langFromPath(route.path))
  const localePath = (path: string) => pathForLang(path, lang.value)

  return { localePath, lang }
}
