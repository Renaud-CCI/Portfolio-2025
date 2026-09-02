import i18next from 'i18next'
import type { Router } from 'vue-router'

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

  const alternates: Array<[string, string]> = [
    ['fr', `${SITE_URL}${path}`],
    ['en', `${SITE_URL}${path}?lng=en`],
    ['x-default', `${SITE_URL}${path}`],
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
    const isEnglish = i18next.language.startsWith('en')
    const path = route.path

    const title = i18next.t(`seo.${name}.title`)
    const description = i18next.t(`seo.${name}.description`)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', `${SITE_URL}${path}`)
    setMeta('property', 'og:locale', isEnglish ? 'en_GB' : 'fr_FR')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setCanonical(isEnglish ? `${SITE_URL}${path}?lng=en` : `${SITE_URL}${path}`)
    setAlternates(path)
  }

  router.afterEach(apply)
  i18next.on('languageChanged', apply)
  void router.isReady().then(apply)
}
