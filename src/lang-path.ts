export type Lang = 'fr' | 'en'

const EN_PREFIX = '/en'

export function langFromPath(path: string): Lang {
  return path === EN_PREFIX || path.startsWith(`${EN_PREFIX}/`) ? 'en' : 'fr'
}

export function pathForLang(path: string, lang: Lang): string {
  const bare =
    path === EN_PREFIX || path === `${EN_PREFIX}/`
      ? '/'
      : path.startsWith(`${EN_PREFIX}/`)
        ? path.slice(EN_PREFIX.length)
        : path

  if (lang === 'fr') return bare
  return bare === '/' ? EN_PREFIX : `${EN_PREFIX}${bare}`
}
