<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

defineProps<{
  content: string;
}>();

const copied = ref(false);

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Repository Content</h2>
      <Button 
        @click="copyToClipboard"
        severity="success"
        :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
        :label="copied ? 'Copied!' : 'Copy to Clipboard'"
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