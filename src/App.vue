<script setup lang="ts">
import type { FileFilter } from './types/github'
import JSZip from 'jszip'
import { onMounted, ref } from 'vue'
import ContentDisplay from './components/ContentDisplay.vue'
import FilterSettings from './components/FilterSettings.vue'
import GithubInput from './components/GithubInput.vue'
import { createDefaultFilter } from './utils/fileFilters'
import { extractRepoInfo } from './utils/github'

const githubUrl = ref('https://github.com/arshad-yaseen/markdx')
const repoContent = ref('')
const isLoading = ref(false)
const error = ref('')
const progress = ref(0)
const fileFilter = ref<FileFilter>(createDefaultFilter())

async function fetchRepo() {
  if (!githubUrl.value) {
    error.value = 'Please enter a GitHub repository URL'
    return
  }

  const repoInfo = extractRepoInfo(githubUrl.value)
  if (!repoInfo) {
    error.value = 'Invalid GitHub URL format'
    return
  }

  isLoading.value = true
  error.value = ''
  progress.value = 0

  try {
    const proxyUrl = `http://localhost:3000/download-repo/${repoInfo.owner}/${repoInfo.repo}`

    const response = await fetch(proxyUrl)
    if (!response.ok) {
      throw new Error(`Failed to download repository: ${response.statusText}`)
    }

    const blob = await response.blob()
    if (blob.size === 0) {
      throw new Error('Downloaded file is empty')
    }
    progress.value = 30

    const zip = new JSZip()
    const zipContent = await zip.loadAsync(blob)
    if (Object.keys(zipContent.files).length === 0) {
      throw new Error('ZIP file is empty or invalid')
    }
    progress.value = 60

    const fileContents: string[] = []
    const filePromises: Promise<void>[] = []

    zipContent.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        const ext = relativePath.split('.').pop()?.toLowerCase() || ''

        // Check if the file should be excluded first
        const shouldExclude = fileFilter.value.exclude.some(pattern => 
          relativePath.toLowerCase().includes(pattern.toLowerCase())
        )

        // Only include if extension matches and file is not excluded
        if (!shouldExclude && fileFilter.value.include.includes(ext)) {
          const promise = zipEntry.async('text').then((content) => {
            fileContents.push(`File: ${relativePath}\n\n${content}`)
          })
          filePromises.push(promise)
        }
      }
    })

    await Promise.all(filePromises)
    progress.value = 100

    if (fileContents.length === 0) {
      throw new Error('No matching files found in repository')
    }

    repoContent.value = fileContents.join('\n\n---\n\n')
  }
  catch (err) {
    error.value = `Error fetching repository: ${err instanceof Error ? err.message : 'Unknown error'}`
    repoContent.value = ''
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRepo()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          GitHub Repository Text Extractor
        </h1>
        <p class="text-gray-600">
          Extract and analyze text content from any GitHub repository
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column: Controls -->
        <div class="space-y-6">
          <!-- GitHub Input -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <GithubInput
              v-model="githubUrl"
              :is-loading="isLoading"
              @fetch="fetchRepo"
            />

            <!-- Progress Bar -->
            <div v-if="isLoading" class="mt-4">
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-500 transition-all duration-300"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <div class="text-sm text-gray-600 mt-1 text-center">
                {{ progress }}% Complete
              </div>
            </div>
          </div>

          <!-- Filter Settings -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <FilterSettings v-model="fileFilter" />
          </div>

          <!-- Error Display -->
          <div
            v-if="error"
            class="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-2"
          >
            <i class="pi pi-exclamation-circle" />
            {{ error }}
          </div>
        </div>

        <!-- Right Column: Content Display -->
        <div class="space-y-6">
          <ContentDisplay
            v-if="repoContent"
            :content="repoContent"
          />
          <div
            v-else-if="!isLoading"
            class="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500"
          >
            <i class="pi pi-file-edit text-4xl mb-2" />
            <p>Repository content will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
