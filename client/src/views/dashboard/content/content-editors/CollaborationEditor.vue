<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Collaboration Section
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Judul Section
        </label>
        <RichTextEditor
          v-model="localContent.title"
          placeholder="Collaboration Title"
        />
      </div>

      <!-- Subtitle -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Subtitle
        </label>
        <RichTextEditor
          v-model="localContent.subtitle"
          placeholder="Subtitle"
        />
      </div>

      <!-- Layout -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Layout
        </label>
        <select
          v-model="localContent.layout"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @change="emitUpdate"
        >
          <option value="grid">Grid</option>
          <option value="carousel">Carousel</option>
        </select>
      </div>
    </div>

    <!-- Partners -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300">
          Partners
        </label>
        <button
          @click="addPartner"
          class="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Tambah Partner
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(partner, index) in localContent.partners"
          :key="index"
          class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg"
        >
          <div class="space-y-3">
            <input
              v-model="partner.name"
              type="text"
              placeholder="Nama Partner"
              class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <input
              v-model="partner.logo"
              type="text"
              placeholder="Logo URL"
              class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <input
              v-model="partner.link"
              type="text"
              placeholder="Link (optional)"
              class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <input
              v-model="partner.description"
              type="text"
              placeholder="Deskripsi (optional)"
              class="w-full px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <div class="flex justify-between items-center">
              <!-- Logo Preview -->
              <div v-if="partner.logo" class="h-10 w-20 bg-white rounded flex items-center justify-center">
                <img :src="partner.logo" :alt="partner.name" class="max-h-8 max-w-16 object-contain" />
              </div>
              <button
                @click="removePartner(index)"
                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <PhTrash :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Preview Partners</h3>
      <div class="flex flex-wrap gap-4 items-center justify-center">
        <div
          v-for="(partner, index) in localContent.partners"
          :key="index"
          class="w-24 h-16 bg-white dark:bg-green-800 rounded-lg flex items-center justify-center p-2"
        >
          <img 
            v-if="partner.logo" 
            :src="partner.logo" 
            :alt="partner.name" 
            class="max-h-full max-w-full object-contain"
          />
          <span v-else class="text-xs text-green-400">{{ partner.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'
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
  partners: [],
  layout: 'carousel'
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

const addPartner = () => {
  localContent.partners.push({
    name: 'New Partner',
    logo: '',
    link: '',
    description: ''
  })
  emitUpdate()
}

const removePartner = (index) => {
  localContent.partners.splice(index, 1)
  emitUpdate()
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      ...newVal,
      partners: newVal.partners ? [...newVal.partners] : []
    })
  }
}, { immediate: true, deep: true })
</script>
