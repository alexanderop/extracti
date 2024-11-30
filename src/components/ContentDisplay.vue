<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { ref } from 'vue'

defineProps<{
  content: string
}>()

const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">
        Repository Content
      </h2>
      <Button
        severity="success"
        :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
        :label="copied ? 'Copied!' : 'Copy to Clipboard'"
        @click="copyToClipboard"
      />
    </div>
    <Textarea
      :value="content"
      readonly
      rows="20"
      class="w-full font-mono text-sm"
    />
  </div>
</template>
