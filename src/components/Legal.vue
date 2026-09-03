<template>
  <LegalLayout
    :title="t('legal.notice.title')"
    other-path="/privacy"
    :other-label="t('legal.seePrivacy')"
  >
    <p class="mb-12 leading-relaxed">{{ t('legal.notice.intro') }}</p>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.notice.publisher.heading') }}
      </h2>
      <LegalRows :rows="publisherRows" />
      <p v-if="LEGAL.siret" class="text-sm opacity-75 mt-4">
        {{ t('legal.notice.publisher.addressNote') }}
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.notice.host.heading') }}
      </h2>
      <p class="mb-4 leading-relaxed">{{ t('legal.notice.host.intro') }}</p>
      <LegalRows :rows="hostRows" />
      <p class="text-sm opacity-75 mt-4">{{ t('legal.notice.host.note') }}</p>
    </section>

    <section v-for="block in prose" :key="block.heading" class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">{{ block.heading }}</h2>
      <p v-for="(paragraph, index) in block.paragraphs" :key="index" class="mb-3 leading-relaxed">
        {{ paragraph }}
      </p>
    </section>
  </LegalLayout>
</template>

<script setup lang="ts">
defineOptions({ name: 'LegalPage' })
import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import LegalLayout from './LegalLayout.vue'
import LegalRows from './LegalRows.vue'
import { LEGAL, type LegalRow } from '@/legal'

const { t } = useTranslation()

// « 06 23 84 67 65 » composé depuis l'étranger.
const telHref = `tel:+33${LEGAL.phone.replace(/\D/g, '').slice(1)}`

const publisherRows = computed<LegalRow[]>(() => {
  const rows: LegalRow[] = [
    { label: t('legal.notice.publisher.name'), value: LEGAL.name },
    { label: t('legal.notice.publisher.status'), value: t('legal.notice.publisher.statusValue') },
  ]

  // Tant que le numéro n'est pas renseigné, mieux vaut ne rien afficher qu'une
  // ligne vide : `npm run smoke` échoue de son côté sur ce cas.
  if (LEGAL.siret) {
    rows.push({ label: t('legal.notice.publisher.siret'), value: LEGAL.siret })
  }

  rows.push(
    { label: t('legal.notice.publisher.vat'), value: t('legal.notice.publisher.vatValue') },
    { label: t('legal.notice.publisher.location'), value: LEGAL.city },
    {
      label: t('legal.notice.publisher.email'),
      value: LEGAL.email,
      href: `mailto:${LEGAL.email}`,
    },
    { label: t('legal.notice.publisher.phone'), value: LEGAL.phone, href: telHref },
    { label: t('legal.notice.publisher.director'), value: LEGAL.name },
  )

  return rows
})

const hostRows = computed<LegalRow[]>(() => [
  { label: t('legal.notice.host.name'), value: LEGAL.host.name },
  {
    label: t('legal.notice.host.address'),
    value: `${LEGAL.host.address}, ${t('legal.notice.host.country')}`,
  },
  { label: t('legal.notice.host.registry'), value: LEGAL.host.registry },
  { label: t('legal.notice.host.phone'), value: LEGAL.host.phone },
  {
    label: t('legal.notice.host.website'),
    value: LEGAL.host.url.replace(/^https?:\/\//, ''),
    href: LEGAL.host.url,
  },
])

const prose = computed(() =>
  (['ip', 'credits', 'links', 'data', 'law'] as const).map((key) => ({
    heading: t(`legal.notice.${key}.heading`),
    paragraphs: t(`legal.notice.${key}.paragraphs`, { returnObjects: true }) as string[],
  })),
)
</script>
