import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { join, resolve, extname, dirname } from 'node:path'
import puppeteer from 'puppeteer'

const DIST = resolve('dist')

const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/services',
  '/contact',
  '/en',
  '/en/about',
  '/en/projects',
  '/en/services',
  '/en/contact',
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
  '.jpg': 'image/jpeg',
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

    // Repli SPA : toute route inconnue est servie par index.html, comme en production.
    const file = (await isFile(candidate)) ? candidate : join(DIST, 'index.html')

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

function outputPath(route) {
  return route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
}

const { server, port } = await startServer()
const base = `http://127.0.0.1:${port}`

const browser = await puppeteer.launch({ headless: true })
let failures = 0

for (const route of ROUTES) {
  const page = await browser.newPage()

  // Les animations d'entrée masquent les éléments avant de les révéler : en
  // mouvement réduit, Home.vue ne masque rien et l'instantané est stable.
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
    { name: 'prefers-color-scheme', value: 'light' },
  ])

  try {
    await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 })

    // La canonique n'est posée qu'une fois le routeur prêt et la langue résolue.
    await page.waitForFunction(() => document.querySelector('link[rel="canonical"]'), {
      timeout: 15000,
    })

    const html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`)
    const title = await page.title()
    const lang = await page.evaluate(() => document.documentElement.lang)

    const target = outputPath(route)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, html, 'utf8')

    console.log(`  ${route.padEnd(16)} ${String(lang).padEnd(3)} ${title}`)
  } catch (error) {
    failures += 1
    console.error(`  ${route.padEnd(16)} ECHEC : ${error.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
server.close()

// Le sitemap est écrit à la main : on refuse qu'il dérive des routes rendues.
const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8')
const declared = [...sitemap.matchAll(/<loc>https:\/\/www\.renaudbresson\.dev(\/[^<]*)<\/loc>/g)].map(
  (m) => (m[1] === '/' ? '/' : m[1].replace(/\/$/, '')),
)
const missing = ROUTES.filter((r) => !declared.includes(r))
const orphan = declared.filter((d) => !ROUTES.includes(d))

if (missing.length || orphan.length) {
  failures += 1
  if (missing.length) console.error(`\nsitemap.xml : routes absentes -> ${missing.join(', ')}`)
  if (orphan.length) console.error(`sitemap.xml : URL orphelines -> ${orphan.join(', ')}`)
} else {
  console.log(`\nsitemap.xml : ${declared.length} URL, coherentes avec les routes.`)
}

if (failures > 0) {
  console.error(`\nPrerendu incomplet : ${failures} route(s) en echec.`)
  process.exit(1)
}

console.log(`\n${ROUTES.length} routes prerendues.`)
