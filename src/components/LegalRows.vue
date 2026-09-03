<template>
  <dl class="grid sm:grid-cols-[11rem_1fr] gap-x-6 gap-y-1 sm:gap-y-3">
    <template v-for="row in rows" :key="row.label">
      <dt class="font-semibold">{{ row.label }}</dt>
      <dd class="mb-3 sm:mb-0 leading-relaxed">
        <a
          v-if="row.href"
          :href="row.href"
          class="text-teal-600 hover:underline break-words"
          rel="noopener"
        >
          {{ row.value }}
        </a>
        <template v-else>{{ row.value }}</template>
      </dd>
    </template>
  </dl>
</template>

<script setup lang="ts">
defineOptions({ name: 'LegalRows' })
import type { LegalRow } from '@/legal'

defineProps<{ rows: LegalRow[] }>()
</script>
