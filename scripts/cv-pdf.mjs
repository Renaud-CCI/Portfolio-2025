import { stat } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer'

// Le CV doit tenir sur une page : au-dela le PDF se coupe au milieu d'une
// experience, et personne ne lit la seconde page.
const A4_MM = 297

const JOBS = [
  { html: 'cv/CV-Renaud-Bresson.html', pdf: 'public/RenaudBresson_CV_fr.pdf' },
  { html: 'cv/CV-Renaud-Bresson-EN.html', pdf: 'public/RenaudBresson_CV_en.pdf' },
]

const browser = await puppeteer.launch({
  headless: true,
  // Meme raison que dans prerender.mjs : pas de bac a sable sur les runners.
  args: ['--no-sandbox'],
})

let failures = 0

for (const { html, pdf } of JOBS) {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(resolve(html)).href, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('print')

  const mm = await page.evaluate(
    () => (document.documentElement.getBoundingClientRect().height / 96) * 25.4,
  )

  // Les deux HTML portent leur propre `@page { size: A4; margin: 0 }` et leur
  // padding interne : Puppeteer ne doit surtout rien ajouter par-dessus.
  await page.pdf({
    path: pdf,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  })
  await page.close()

  const { size } = await stat(pdf)
  const deborde = mm > A4_MM
  if (deborde) failures += 1

  const etat = deborde ? 'DEBORDE' : 'ok'
  console.log(`${etat} ${pdf} — ${(size / 1024).toFixed(0)} ko — ${mm.toFixed(0)} mm sur ${A4_MM}`)
}

await browser.close()

if (failures > 0) {
  console.error(`\n${failures} CV depasse la page A4 : retailler avant de commiter.`)
  process.exit(1)
}

console.log('\n2 CV imprimes dans public/.')
