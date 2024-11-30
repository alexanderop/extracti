<script setup lang="ts">
import { ref } from 'vue';
import Chip from 'primevue/chip';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { createDefaultFilter } from '../utils/fileFilters';
import type { FileFilter } from '../types/github';

const props = defineProps<{
  modelValue: FileFilter;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FileFilter): void;
}>();

const newInclude = ref('');
const newExclude = ref('');
const newFolder = ref('');

function addPattern(type: 'include' | 'exclude' | 'folders', value: string) {
  if (!value.trim()) return;
  
  const newFilter = {
    ...props.modelValue,
    [type]: [...props.modelValue[type], value.trim()]
  };
  
  emit('update:modelValue', newFilter);
  
  if (type === 'include') newInclude.value = '';
  else if (type === 'exclude') newExclude.value = '';
  else newFolder.value = '';
}

function removePattern(type: 'include' | 'exclude' | 'folders', index: number) {
  const newFilter = {
    ...props.modelValue,
    [type]: props.modelValue[type].filter((_, i) => i !== index)
  };
  emit('update:modelValue', newFilter);
}
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
      <i class="pi pi-filter"></i>
      Filter Settings
    </h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-file text-blue-500"></i>
          Include File Types
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip 
            v-for="(pattern, index) in modelValue.include" 
            :key="index"
            :label="pattern"
            removable
            @remove="removePattern('include', index)"
            class="bg-blue-50"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newInclude"
            placeholder="Add extension (e.g., .js)"
            @keyup.enter="addPattern('include', newInclude)"
            class="flex-grow"
          />
          <Button 
            icon="pi pi-plus"
            @click="addPattern('include', newInclude)"
            severity="primary"
            outlined
          />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-ban text-red-500"></i>
          Exclude Patterns
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip 
            v-for="(pattern, index) in modelValue.exclude" 
            :key="index"
            :label="pattern"
            removable
            @remove="removePattern('exclude', index)"
            class="bg-red-50"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newExclude"
            placeholder="Add pattern (e.g., dist)"
            @keyup.enter="addPattern('exclude', newExclude)"
            class="flex-grow"
          />
          <Button 
            icon="pi pi-plus"
            @click="addPattern('exclude', newExclude)"
            severity="primary"
            outlined
          />
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="font-medium text-gray-700 flex items-center gap-2">
          <i class="pi pi-folder text-green-500"></i>
          Specific Folders
        </h3>
        <div class="flex flex-wrap gap-2 min-h-[40px]">
          <Chip 
            v-for="(folder, index) in modelValue.folders" 
            :key="index"
            :label="folder"
            removable
            @remove="removePattern('folders', index)"
            class="bg-green-50"
          />
        </div>
        <div class="flex gap-2">
          <InputText
            v-model="newFolder"
            placeholder="Add folder (e.g., src)"
            @keyup.enter="addPattern('folders', newFolder)"
            class="flex-grow"
          />
          <Button 
            icon="pi pi-plus"
            @click="addPattern('folders', newFolder)"
            severity="primary"
            outlined
          />
        </div>
      </div>
    </div>
  </div>
</template>