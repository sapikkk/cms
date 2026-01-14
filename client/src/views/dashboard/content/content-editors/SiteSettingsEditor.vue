<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Pengaturan Situs
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Site Name -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Nama Situs
        </label>
        <input
          v-model="localContent.siteName"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Site Description -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Deskripsi Situs
        </label>
        <input
          v-model="localContent.siteDescription"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Favicon -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Favicon URL
        </label>
        <input
          v-model="localContent.favicon"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- OG Image -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          OG Image URL (Social Sharing)
        </label>
        <input
          v-model="localContent.ogImage"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Primary Color -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Warna Utama
        </label>
        <div class="flex gap-2">
          <input
            v-model="localContent.primaryColor"
            type="color"
            class="h-10 w-16 border border-green-300 dark:border-green-600 rounded cursor-pointer"
            @input="emitUpdate"
          />
          <input
            v-model="localContent.primaryColor"
            type="text"
            class="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
        </div>
      </div>

      <!-- Secondary Color -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Warna Sekunder
        </label>
        <div class="flex gap-2">
          <input
            v-model="localContent.secondaryColor"
            type="color"
            class="h-10 w-16 border border-green-300 dark:border-green-600 rounded cursor-pointer"
            @input="emitUpdate"
          />
          <input
            v-model="localContent.secondaryColor"
            type="text"
            class="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Preview Warna</h3>
      <div class="flex gap-4">
        <div 
          class="w-24 h-24 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :style="{ backgroundColor: localContent.primaryColor }"
        >
          Primary
        </div>
        <div 
          class="w-24 h-24 rounded-lg flex items-center justify-center text-white font-medium text-sm"
          :style="{ backgroundColor: localContent.secondaryColor }"
        >
          Secondary
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localContent = reactive({
  siteName: '',
  siteDescription: '',
  favicon: '',
  ogImage: '',
  primaryColor: '#16a34a',
  secondaryColor: '#f97316',
  isLandingPageActive: true
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, newVal)
  }
}, { immediate: true, deep: true })
</script>
