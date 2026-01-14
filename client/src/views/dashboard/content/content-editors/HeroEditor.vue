<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Hero Section
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Title -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Judul Utama
        </label>
        <RichTextEditor
          v-model="localContent.title"
          placeholder="Masukkan judul utama..."
        />
      </div>

      <!-- Subtitle -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Subtitle
        </label>
        <RichTextEditor
          v-model="localContent.subtitle"
          placeholder="Masukkan subtitle..."
        />
      </div>

      <!-- Background Image -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Background Image URL
        </label>
        <input
          v-model="localContent.backgroundImage"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- CTA Button -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          CTA Button Text
        </label>
        <input
          v-model="localContent.ctaButton.text"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          CTA Button Link
        </label>
        <input
          v-model="localContent.ctaButton.link"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Secondary Button -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Secondary Button Text (Optional)
        </label>
        <input
          v-model="localContent.secondaryButton.text"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Secondary Button Link
        </label>
        <input
          v-model="localContent.secondaryButton.link"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>
    </div>

    <!-- Preview -->
    <div class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Preview Hero</h3>
      <div 
        class="relative rounded-lg overflow-hidden h-48 flex items-center justify-center"
        :style="{ 
          backgroundImage: localContent.backgroundImage ? `url(${localContent.backgroundImage})` : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }"
      >
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative z-10 text-center text-white p-6">
          <h1 class="text-2xl font-bold mb-2">{{ localContent.title || 'Judul Hero' }}</h1>
          <p class="text-sm opacity-90 mb-4">{{ localContent.subtitle || 'Subtitle hero akan muncul di sini' }}</p>
          <div class="flex justify-center gap-3">
            <span class="px-4 py-2 bg-orange-500 rounded-lg text-sm font-medium">
              {{ localContent.ctaButton?.text || 'CTA Button' }}
            </span>
            <span 
              v-if="localContent.secondaryButton?.text"
              class="px-4 py-2 border border-white rounded-lg text-sm font-medium"
            >
              {{ localContent.secondaryButton.text }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import RichTextEditor from '@/components/molecules/RichTextEditor.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localContent = reactive({
  title: '',
  subtitle: '',
  backgroundImage: '',
  ctaButton: {
    text: '',
    link: ''
  },
  secondaryButton: {
    text: '',
    link: ''
  }
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      title: newVal.title || '',
      subtitle: newVal.subtitle || '',
      backgroundImage: newVal.backgroundImage || '',
      ctaButton: newVal.ctaButton || { text: '', link: '' },
      secondaryButton: newVal.secondaryButton || { text: '', link: '' }
    })
  }
}, { immediate: true, deep: true })
</script>
