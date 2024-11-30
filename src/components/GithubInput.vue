<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

defineProps<{
  modelValue: string
  isLoading: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'fetch'): void
}>()
</script>

<template>
  <div class="mb-6">
    <div class="relative">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-github" />
        <InputText
          :value="modelValue"
          class="w-full p-inputtext-lg"
          placeholder="Enter GitHub repository URL (e.g. https://github.com/user/repo)"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keyup.enter="$emit('fetch')"
        />
      </span>
    </div>
    <div class="mt-4 flex justify-center">
      <Button
        :disabled="isLoading"
        :loading="isLoading"
        severity="primary"
        size="large"
        class="w-48"
        @click="$emit('fetch')"
      >
        <template #icon>
          <i class="pi pi-download mr-2" />
        </template>
        Extract Text
      </Button>
    </div>
  </div>
</template>
