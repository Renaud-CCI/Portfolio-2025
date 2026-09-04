import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, resolve, extname } from 'node:path'
import puppeteer from 'puppeteer'

const DIST = resolve('dist')

const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/services',
  '/contact',
  '/legal',
  '/privacy',
  '/en',
  '/en/about',
  '/en/projects',
  '/en/services',
  '/en/contact',
  '/en/legal',
  '/en/privacy',
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

function startServer() {
  const server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const candidate = join(DIST, pathname)
    const indexed = join(DIST, pathname, 'index.html')

    let file = join(DIST, 'index.html')
    if (await isFile(candidate)) file = candidate
    else if (await isFile(indexed)) file = indexed

    try {
      const body = await readFile(file)
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
      res.end(body)
    } catch {
      res.writeHead(404)
      res.end('not found')
    }
  })

  return new Promise((done) => {
    server.listen(0, '127.0.0.1', () => done({ server, port: server.address().port }))
  })
}

const problems = []
function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok ' : 'X  '} ${label}${detail ? ' — ' + detail : ''}`)
  if (!ok) problems.push(label)
}

// Les bloquants ne sont pas des regressions mais des taches inachevees : les
// compter a part evite de confondre « le site est casse » et « il reste a faire ».
const blockers = []
function blocker(label, ok, detail = '') {
  console.log(`  ${ok ? 'ok ' : '!! '} ${label}${detail ? ' — ' + detail : ''}`)
  if (!ok) blockers.push(label)
}

const { server, port } = await startServer()
const base = `http://127.0.0.1:${port}`
// --no-sandbox : les runners GitHub Actions interdisent les namespaces
// utilisateur non privilégiés (AppArmor), le sandbox Chromium par défaut y
// échoue avec "No usable sandbox!". Sans effet en local, où le sandbox marche.
const browser = await puppeteer.launch({
  headless: true,
  args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
})

// Le badge ecoindex interroge une API externe avec l'URL de la page : en local
// elle est injoignable, ce bruit-là n'est pas un défaut du site.
const THIRD_PARTY = /[ée]coindex|jsdelivr|cnumr|favicon|Failed to load resource/i

function watch(page, sink) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') sink.push(m.text())
  })
  page.on('pageerror', (e) => sink.push('pageerror: ' + e.message))
}

function appNoise(logs) {
  return logs.filter((l) => !THIRD_PARTY.test(l))
}

console.log('\n1. Console propre sur les quatorze routes')
for (const route of ROUTES) {
  const page = await browser.newPage()
  const logs = []
  watch(page, logs)
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  const rendered = await page.$eval('#app', (el) => el.children.length > 0)
  const noise = appNoise(logs)
  check(route.padEnd(15), rendered && noise.length === 0, noise.slice(0, 2).join(' | '))
  await page.close()
}

console.log('\n2. Composants Vuetify et icones')
{
  const page = await browser.newPage()
  const logs = []
  watch(page, logs)
  await page.goto(base + '/projects', { waitUntil: 'networkidle0' })
  check('barre superieure (v-app-bar)', (await page.$('.v-app-bar')) !== null)
  check('icone engrenage en SVG', (await page.$('.v-app-bar .v-icon svg path')) !== null)
  check(
    'aucune police mdi chargee',
    !(await page.evaluate(() =>
      [...document.fonts].some((f) => /material design icons/i.test(f.family)),
    )),
  )
  await page.click('.grid > div')
  await page.waitForSelector('.v-dialog .v-card', { visible: true, timeout: 5000 })
  check('pop-up projet ouverte (v-dialog)', true)
  check(
    'resolution de composant',
    !logs.some((l) => /Failed to resolve component/i.test(l)),
    logs.filter((l) => /resolve component/i.test(l))[0] ?? '',
  )
  await page.close()
}

console.log('\n3. Navigation interne et bascule de langue')
{
  const page = await browser.newPage()
  await page.goto(base + '/about', { waitUntil: 'networkidle0' })

  await page.evaluate(() => {
    const link = [...document.querySelectorAll('.v-app-bar a')].find((a) =>
      a.getAttribute('href')?.endsWith('/services'),
    )
    link.click()
  })
  await page.waitForFunction(() => location.pathname === '/services', { timeout: 5000 })
  check('navigation /about -> /services', true, await page.title())

  await page.goto(base + '/en/about', { waitUntil: 'networkidle0' })
  const enTitle = await page.title()
  check('/en/about rend en anglais', enTitle.includes('Background and skills'), enTitle)

  const links = await page.$$eval('.v-app-bar a', (els) =>
    els.map((e) => e.getAttribute('href')),
  )
  check(
    'liens de nav prefixes /en',
    links.filter(Boolean).every((h) => h.startsWith('/en')),
    links.filter(Boolean).join(' '),
  )

  const alts = await page.$$eval('link[rel="alternate"]', (els) => els.length)
  check('exactement 3 alternates', alts === 3, String(alts))
  await page.close()
}

console.log('\n4. Accumulation de balises apres bascules repetees')
{
  const page = await browser.newPage()
  await page.goto(base + '/about', { waitUntil: 'networkidle0' })
  for (let i = 0; i < 4; i += 1) {
    await page.goto(base + (i % 2 ? '/about' : '/en/about'), { waitUntil: 'networkidle0' })
  }
  const counts = await page.evaluate(() => ({
    alt: document.querySelectorAll('link[rel="alternate"]').length,
    canon: document.querySelectorAll('link[rel="canonical"]').length,
    desc: document.querySelectorAll('meta[name="description"]').length,
  }))
  check('pas d accumulation', counts.alt === 3 && counts.canon === 1 && counts.desc === 1, JSON.stringify(counts))
  await page.close()
}

console.log('\n5. Mouvement reduit : le contenu reste visible')
{
  const page = await browser.newPage()
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  const opacity = await page.$eval('.anim-item', (el) => getComputedStyle(el).opacity)
  check('elements animes visibles', opacity === '1', 'opacity=' + opacity)
  await page.close()
}

console.log('\n6. Animation normale : le contenu finit visible')
{
  const page = await browser.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  await page.waitForFunction(
    () => getComputedStyle(document.querySelector('.anim-item')).opacity === '1',
    { timeout: 8000 },
  ).catch(() => {})
  const opacity = await page.$eval('.anim-item', (el) => getComputedStyle(el).opacity)
  check('titre du hero revele', opacity === '1', 'opacity=' + opacity)
  await page.close()
}

console.log('\n7. Interface mobile : hamburger et tiroir')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 800 })
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  check('bouton hamburger present', (await page.$('.v-app-bar-nav-icon')) !== null)
  await page.click('.v-app-bar-nav-icon')
  await page.waitForSelector('.v-navigation-drawer--active', { timeout: 5000 })
  const drawerLinks = await page.$$eval('.v-navigation-drawer a', (els) => els.length)
  check('tiroir ouvert avec ses liens', drawerLinks === 5, drawerLinks + ' liens')
  await page.close()
}

console.log('\n8. Menu engrenage, theme et persistance')
{
  const page = await browser.newPage()
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  await page.click('.v-app-bar button[aria-haspopup="menu"]')
  await page.waitForSelector('#settings-menu', { visible: true, timeout: 5000 })
  const items = await page.$$eval('#settings-menu .v-list-item-title', (els) =>
    els.map((e) => e.textContent.trim()),
  )
  check('menu ouvert (v-menu, v-list)', items.length === 3, items.join(' / '))
  check('separateur present (v-divider)', (await page.$('#settings-menu .v-divider')) !== null)

  const before = await page.evaluate(
    () => document.querySelector('.v-application')?.className ?? '',
  )
  await page.evaluate(() => document.querySelector('#settings-menu .v-list-item').click())
  const stored = await page
    .waitForFunction(() => localStorage.getItem('theme'), { timeout: 5000 })
    .then((handle) => handle.jsonValue())
    .catch(() => null)
  check('bascule de theme enregistree', stored !== null, `stocke=${stored}`)

  if (stored) {
    await page.reload({ waitUntil: 'networkidle0' })
    const after = await page.evaluate(
      () => document.querySelector('.v-application')?.className ?? '',
    )
    check(
      'theme conserve au rechargement',
      after.includes(`v-theme--${stored}`) && after !== before,
      `avant=${before.match(/v-theme--\w+/)} apres=${after.match(/v-theme--\w+/)}`,
    )
  }
  await page.close()
}

console.log('\n9. Corrections visuelles')
{
  // Contexte isolé : la section précédente a basculé le thème en sombre, et le
  // localStorage est partagé par origine.
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])

  await page.goto(base + '/about', { waitUntil: 'networkidle0' })
  const active = await page.evaluate(() => {
    const el = [...document.querySelectorAll('.v-app-bar a')].find((a) =>
      a.getAttribute('href')?.endsWith('/about'),
    )
    return el ? getComputedStyle(el).borderBottomColor : null
  })
  check('soulignement actif en ambre', active === 'rgb(245, 158, 11)', String(active))

  const grid = await page.$eval('dl > div', (el) => getComputedStyle(el).gridTemplateColumns)
  check('competences sur deux colonnes', grid.split(' ').length === 2, grid)

  const weight = await page.$eval('p strong', (el) => getComputedStyle(el).fontWeight)
  check('balise strong en gras', Number(weight) >= 700, weight)

  await page.goto(base + '/projects', { waitUntil: 'networkidle0' })
  const fit = await page.$eval('.grid img', (el) => getComputedStyle(el).objectFit)
  check('vignettes recadrees', fit === 'cover', fit)
  await page.close()
  await context.close()
}

console.log('\n10. Contenus et requetes tierces')
{
  const page = await browser.newPage()
  const requests = []
  page.on('request', (r) => requests.push(r.url()))

  await page.goto(base + '/contact', { waitUntil: 'networkidle0' })
  const fr = await page.$eval('form', (el) => el.textContent)
  check('mention de traitement en francais', fr.includes('mon propre serveur'))
  check('renvoi vers la politique', (await page.$('form a[href="/privacy"]')) !== null)

  await page.goto(base + '/en/contact', { waitUntil: 'networkidle0' })
  const en = await page.$eval('form', (el) => el.textContent)
  check('mention de traitement en anglais', en.includes('my own server'))
  check('renvoi vers la politique en anglais', (await page.$('form a[href="/en/privacy"]')) !== null)

  await page.goto(base + '/en/services', { waitUntil: 'networkidle0' })
  const services = await page.evaluate(() => document.body.textContent)
  check('4e domaine traduit', services.includes('Delivery and production'))
  check('aucune cle brute affichee', !/services\.items\./.test(services))

  check(
    'aucune requete publicitaire',
    !requests.some((u) => /googlesyndication|doubleclick|adsbygoogle/.test(u)),
  )
  await page.close()
}

console.log('\n11. Pages legales')
{
  const page = await browser.newPage()

  await page.goto(base + '/legal', { waitUntil: 'networkidle0' })
  const notice = await page.evaluate(() => document.body.textContent)
  check('mentions legales : editeur et hebergeur nommes', notice.includes('Éditeur du site') && notice.includes('OVH SAS'))
  check('titre de page dedie', (await page.title()).startsWith('Mentions légales'), await page.title())
  check('aucune cle brute sur les mentions', !/legal\.notice\./.test(notice))

  await page.goto(base + '/privacy', { waitUntil: 'networkidle0' })
  const privacy = await page.evaluate(() => document.body.textContent)
  check('politique : deux traitements decrits', (privacy.match(/Finalité/g) ?? []).length === 2)
  check('politique : deux sous-traitants', (privacy.match(/Rôle/g) ?? []).length === 2)
  check('aucune cle brute sur la politique', !/legal\.privacy\./.test(privacy))

  await page.goto(base + '/en/privacy', { waitUntil: 'networkidle0' })
  const english = await page.evaluate(() => document.body.textContent)
  check(
    'version anglaise reellement traduite',
    english.includes('Data controller') && !english.includes('Responsable du traitement'),
  )

  await page.goto(base + '/en/about', { waitUntil: 'networkidle0' })
  const footer = await page.$$eval('footer a', (els) => els.map((e) => e.getAttribute('href')))
  check(
    'pied de page : liens legaux prefixes /en',
    footer.includes('/en/legal') && footer.includes('/en/privacy'),
    footer.filter(Boolean).join(' '),
  )
  await page.close()
}

console.log('\n12. Points bloquants avant le merge vers main')
{
  // Lu dans la source plutot que dans le rendu : c'est la valeur a corriger.
  const source = await readFile(resolve('src', 'legal.ts'), 'utf8')
  const siret = (source.match(/siret:\s*'([^']*)'/)?.[1] ?? '').replace(/\s/g, '')
  const endpoint = source.match(/MAIL_ENDPOINT = '([^']*)'/)?.[1] ?? ''

  blocker('SIRET renseigne dans src/legal.ts', /^\d{14}$/.test(siret), siret || 'vide')
  blocker(
    'formulaire auto-heberge, comme annonce par la politique',
    !/formspree|web3forms|formsubmit|getform/i.test(endpoint),
    endpoint,
  )
  blocker(
    'image de la carte wikiwa presente',
    await isFile(join(DIST, 'images', 'portfolio', 'wikiwa.webp')),
  )
}

await browser.close()
server.close()

if (blockers.length) {
  console.error(
    `\n${blockers.length} point(s) bloquant(s) avant le merge vers main : ${blockers.join(', ')}`,
  )
  console.error('Ce sont des taches a finir, pas des regressions. Voir runtime-tests.md.')
}

if (problems.length) {
  console.error(`\n${problems.length} probleme(s) : ${problems.map((p) => p.trim()).join(', ')}`)
}

if (problems.length || blockers.length) process.exit(1)

console.log('\nTous les controles passent.')
