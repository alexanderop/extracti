<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

defineProps<{
  modelValue: string;
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'fetch'): void;
}>();
</script>

<template>
  <div class="mb-6">
    <div class="relative">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-github"></i>
        <InputText 
          :value="modelValue"
          @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keyup.enter="$emit('fetch')"
          class="w-full p-inputtext-lg"
          placeholder="Enter GitHub repository URL (e.g. https://github.com/user/repo)"
        />
      </span>
    </div>
    <div class="mt-4 flex justify-center">
      <Button 
        @click="$emit('fetch')"
        :disabled="isLoading"
        :loading="isLoading"
        severity="primary"
        size="large"
        class="w-48"
      >
        <template #icon>
          <i class="pi pi-download mr-2"></i>
        </template>
        Extract Text
      </Button>
    </div>
  </div>
</template>