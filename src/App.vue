<script setup lang="ts">
import type { FileFilter } from './types/github'
import { ref } from 'vue'
import ContentDisplay from './components/ContentDisplay.vue'
import FilterSettings from './components/FilterSettings.vue'
import GithubInput from './components/GithubInput.vue'
import { createDefaultFilter } from './utils/fileFilters'
import { extractRepoInfo, fetchTextFiles } from './utils/github'

const githubUrl = ref('')
const repoContent = ref('')
const isLoading = ref(false)
const error = ref('')
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

  try {
    const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents`)
    const data = await response.json()

    if (!Array.isArray(data)) {
      throw new TypeError('Invalid repository or API response')
    }

    const textContent = await fetchTextFiles(data, repoInfo.owner, repoInfo.repo, fileFilter.value)
    repoContent.value = textContent.join('\n\n')
  }
  catch (err) {
    error.value = `Error fetching repository: ${err instanceof Error ? err.message : 'Unknown error'}`
    repoContent.value = ''
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          GitHub Repository Text Extractor
        </h1>
        <p class="text-gray-600">
          Extract and analyze text content from any GitHub repository
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <GithubInput
          v-model="githubUrl"
          :is-loading="isLoading"
          @fetch="fetchRepo"
        />

        <FilterSettings v-model="fileFilter" />
      </div>

      <div
        v-if="error"
        class="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 flex items-center gap-2"
      >
        <i class="pi pi-exclamation-circle" />
        {{ error }}
      </div>

      <ContentDisplay
        v-if="repoContent"
        :content="repoContent"
      />
    </div>
  </div>
</template>
