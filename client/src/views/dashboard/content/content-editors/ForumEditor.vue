<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Forum Section
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
          placeholder="Forum Title"
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

      <!-- Description -->
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Deskripsi
        </label>
        <RichTextEditor
          v-model="localContent.description"
          placeholder="Description"
        />
      </div>
    </div>

    <!-- CTA Button -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>

    <!-- Feature Items -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300">
          Feature Items
        </label>
        <button
          @click="addFeatureItem"
          class="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Tambah Item
        </button>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="(item, index) in localContent.featureItems"
          :key="index"
          class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              v-model="item.title"
              type="text"
              placeholder="Judul"
              class="px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <input
              v-model="item.description"
              type="text"
              placeholder="Deskripsi"
              class="px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <div class="flex gap-2">
              <select
                v-model="item.icon"
                class="flex-1 px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                @change="emitUpdate"
              >
                <option value="coffee">☕ Coffee</option>
                <option value="calendar">📅 Calendar</option>
                <option value="book">📖 Book</option>
                <option value="chat">💬 Chat</option>
                <option value="users">👥 Users</option>
                <option value="star">⭐ Star</option>
              </select>
              <button
                @click="removeFeatureItem(index)"
                class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <PhTrash :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle -->
    <label class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer w-fit">
      <input
        v-model="localContent.showTopics"
        type="checkbox"
        class="rounded text-orange-500 focus:ring-orange-500"
        @change="emitUpdate"
      />
      <span class="text-sm text-green-700 dark:text-green-300">Tampilkan Topics</span>
    </label>
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
  description: '',
  showTopics: true,
  featureItems: [],
  ctaButton: {
    text: '',
    link: ''
  }
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

const addFeatureItem = () => {
  localContent.featureItems.push({
    title: 'New Feature',
    description: 'Description',
    icon: 'coffee'
  })
  emitUpdate()
}

const removeFeatureItem = (index) => {
  localContent.featureItems.splice(index, 1)
  emitUpdate()
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      ...newVal,
      featureItems: newVal.featureItems ? [...newVal.featureItems] : [],
      ctaButton: newVal.ctaButton || { text: '', link: '' }
    })
  }
}, { immediate: true, deep: true })
</script>
