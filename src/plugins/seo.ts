import i18next from 'i18next'
import type { Router } from 'vue-router'
import { langFromPath, pathForLang } from '@/lang-path'

const SITE_URL = 'https://www.renaudbresson.dev'

function headElement<T extends HTMLElement>(selector: string, create: () => T): T {
  const existing = document.head.querySelector<T>(selector)
  if (existing) return existing
  const created = create()
  document.head.appendChild(created)
  return created
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  const el = headElement(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    return meta
  })
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  const el = headElement('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    return link
  })
  el.setAttribute('href', href)
}

function setAlternates(path: string) {
  document.head.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove())

  const french = `${SITE_URL}${pathForLang(path, 'fr')}`
  const alternates: Array<[string, string]> = [
    ['fr', french],
    ['en', `${SITE_URL}${pathForLang(path, 'en')}`],
    ['x-default', french],
  ]

  for (const [hreflang, href] of alternates) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', hreflang)
    link.setAttribute('href', href)
    document.head.appendChild(link)
  }
}

export function setupSeo(router: Router) {
  const apply = () => {
    const route = router.currentRoute.value
    const name = typeof route.name === 'string' ? route.name : 'home'
    const path = route.path
    const lang = langFromPath(path)

    const title = i18next.t(`seo.${name}.title`)
    const description = i18next.t(`seo.${name}.description`)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `${SITE_URL}${path}`)
    setMeta('property', 'og:locale', lang === 'en' ? 'en_GB' : 'fr_FR')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setCanonical(`${SITE_URL}${path}`)
    setAlternates(path)
  }

  router.afterEach(apply)
  void router.isReady().then(apply)
}
