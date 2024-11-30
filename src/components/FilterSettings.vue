<script setup lang="ts">
import type { FileFilter } from '../types/github'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: FileFilter
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FileFilter): void
}>()

const newInclude = ref('')
const newExclude = ref('')
const newFolder = ref('')

function addPattern(type: 'include' | 'exclude' | 'folders', value: string) {
  if (!value.trim())
    return

  const newFilter = {
    ...props.modelValue,
    [type]: [...props.modelValue[type], value.trim()],
  }

  emit('update:modelValue', newFilter)

  if (type === 'include')
    newInclude.value = ''
  else if (type === 'exclude')
    newExclude.value = ''
  else newFolder.value = ''
}

function removePattern(type: 'include' | 'exclude' | 'folders', index: number) {
  const newFilter = {
    ...props.modelValue,
    [type]: props.modelValue[type].filter((_, i) => i !== index),
  }
  emit('update:modelValue', newFilter)
}
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
      <i class="pi pi-filter" />
      Filter Settings
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-file text-blue-500" />
          Include File Types
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip
            v-for="(pattern, index) in modelValue.include"
            :key="index"
            :label="pattern"
            removable
            class="bg-blue-50"
            @remove="removePattern('include', index)"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newInclude"
            placeholder="Add extension (e.g., .js)"
            class="flex-grow"
            @keyup.enter="addPattern('include', newInclude)"
          />
          <Button
            icon="pi pi-plus"
            severity="primary"
            outlined
            @click="addPattern('include', newInclude)"
          />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-ban text-red-500" />
          Exclude Patterns
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip
            v-for="(pattern, index) in modelValue.exclude"
            :key="index"
            :label="pattern"
            removable
            class="bg-red-50"
            @remove="removePattern('exclude', index)"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newExclude"
            placeholder="Add pattern (e.g., dist)"
            class="flex-grow"
            @keyup.enter="addPattern('exclude', newExclude)"
          />
          <Button
            icon="pi pi-plus"
            severity="primary"
            outlined
            @click="addPattern('exclude', newExclude)"
          />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-folder text-green-500" />
          Specific Folders
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip
            v-for="(folder, index) in modelValue.folders"
            :key="index"
            :label="folder"
            removable
            class="bg-green-50"
            @remove="removePattern('folders', index)"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newFolder"
            placeholder="Add folder (e.g., src)"
            class="flex-grow"
            @keyup.enter="addPattern('folders', newFolder)"
          />
          <Button
            icon="pi pi-plus"
            severity="primary"
            outlined
            @click="addPattern('folders', newFolder)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
