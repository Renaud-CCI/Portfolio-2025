<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px">
    <v-card class="overflow-hidden">
      <v-card-title class="text-xl font-bold text-amber-500">{{ t(`portfolio.projects.${project?.id}.title`)
      }}</v-card-title>
      <v-card-text>
        <img :src="project?.image" :alt="t(`portfolio.projects.${project?.id}.title`)"
          class="w-full h-48 object-cover mb-4 rounded" loading="lazy" decoding="async" />
        <p class="mb-4">{{ t(`portfolio.projects.${project?.id}.descriptionLong`) }}</p>
        <div class="flex flex-col gap-2 justify-center items-center">
          <v-btn v-if="project?.link" :href="project.link" target="_blank" color="secondary" class="text-white w-1/2">
            {{ t('portfolio.view_project') }}
          </v-btn>
          <v-btn v-if="project?.github" :href="project.github" target="_blank" variant="outlined">
            GitHub
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="$emit('update:modelValue', false)">{{ t('portfolio.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProjectPopup' })
import { useTranslation } from 'i18next-vue'

const { t } = useTranslation()

defineProps<{
  modelValue: boolean
  project: {
    id: string
    image: string
    link?: string
    github?: string
  } | null
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>
