<template>
  <LegalLayout
    :title="t('legal.privacy.title')"
    other-path="/legal"
    :other-label="t('legal.seeNotice')"
  >
    <p class="mb-12 leading-relaxed">{{ t('legal.privacy.intro') }}</p>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.privacy.controller.heading') }}
      </h2>
      <p
        v-for="(paragraph, index) in asArray('legal.privacy.controller.paragraphs')"
        :key="index"
        class="mb-3 leading-relaxed"
      >
        {{ paragraph }}
      </p>
    </section>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-6">
        {{ t('legal.privacy.treatments.heading') }}
      </h2>
      <article v-for="treatment in treatments" :key="treatment.name" class="mb-8">
        <h3 class="font-bold mb-3">{{ treatment.name }}</h3>
        <LegalRows :rows="treatment.rows" />
      </article>
    </section>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.privacy.processors.heading') }}
      </h2>
      <p class="mb-6 leading-relaxed">{{ t('legal.privacy.processors.intro') }}</p>
      <article v-for="processor in processors" :key="processor.name" class="mb-8">
        <h3 class="font-bold mb-3">{{ processor.name }}</h3>
        <LegalRows :rows="processor.rows" />
        <p class="text-sm opacity-75 mt-3 leading-relaxed">{{ processor.note }}</p>
      </article>
    </section>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.privacy.absent.heading') }}
      </h2>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="(item, index) in asArray('legal.privacy.absent.items')" :key="index">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="mb-12">
      <h2 class="text-xl md:text-2xl font-semibold text-teal-600 mb-4">
        {{ t('legal.privacy.rights.heading') }}
      </h2>
      <p class="mb-4 leading-relaxed">{{ t('legal.privacy.rights.intro') }}</p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li v-for="(item, index) in asArray('legal.privacy.rights.items')" :key="index">
          {{ item }}
        </li>
      </ul>
      <p class="leading-relaxed">{{ t('legal.privacy.rights.how') }}</p>
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
defineOptions({ name: 'PrivacyPage' })
import { computed } from 'vue'
import { useTranslation } from 'i18next-vue'
import LegalLayout from './LegalLayout.vue'
import LegalRows from './LegalRows.vue'
import { LEGAL, type LegalRow } from '@/legal'

interface Treatment {
  name: string
  purpose: string
  data: string
  basis: string
  recipients: string
  retention: string
}

interface Processor {
  key: 'host' | 'cdn'
  role: string
  location: string
  note: string
}

const { t } = useTranslation()

const asArray = (key: string) => t(key, { returnObjects: true }) as string[]

const treatments = computed(() =>
  (t('legal.privacy.treatments.items', { returnObjects: true }) as Treatment[]).map((item) => ({
    name: item.name,
    rows: (['purpose', 'data', 'basis', 'recipients', 'retention'] as const).map<LegalRow>(
      (field) => ({
        label: t(`legal.privacy.treatments.labels.${field}`),
        value: item[field],
      }),
    ),
  })),
)

// Les identités des prestataires vivent dans src/legal.ts, les JSON ne portent
// que ce qui se traduit : la clé fait la jointure.
const processorNames: Record<Processor['key'], string> = {
  host: `${LEGAL.host.name} — ${LEGAL.host.address}`,
  cdn: `${LEGAL.cdn.name} (${LEGAL.cdn.operator})`,
}

const processors = computed(() =>
  (t('legal.privacy.processors.items', { returnObjects: true }) as Processor[]).map((item) => ({
    name: processorNames[item.key],
    note: item.note,
    rows: (['role', 'location'] as const).map<LegalRow>((field) => ({
      label: t(`legal.privacy.processors.labels.${field}`),
      value: item[field],
    })),
  })),
)

const prose = computed(() =>
  (['security', 'changes'] as const).map((key) => ({
    heading: t(`legal.privacy.${key}.heading`),
    paragraphs: asArray(`legal.privacy.${key}.paragraphs`),
  })),
)
</script>
