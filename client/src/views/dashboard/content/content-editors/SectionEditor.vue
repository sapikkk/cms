<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        {{ title }}
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Section Title -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Judul Section
        </label>
        <RichTextEditor
          v-model="localContent.title"
          placeholder="Masukkan judul section..."
        />
      </div>

      <!-- Section Subtitle -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Subtitle
        </label>
        <RichTextEditor
          v-model="localContent.subtitle"
          placeholder="Masukkan subtitle..."
        />
      </div>

      <!-- Max Items -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Maksimum Item
        </label>
        <input
          v-model.number="localContent.maxItems"
          type="number"
          min="1"
          max="24"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
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
          <option value="list">List</option>
          <option value="carousel">Carousel</option>
          <option value="shelf">Shelf</option>
        </select>
      </div>
    </div>

    <!-- Toggle Options -->
    <div class="flex flex-wrap gap-4">
      <label 
        v-if="hasShowFeatured"
        class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer"
      >
        <input
          v-model="localContent.showFeaturedOnly"
          type="checkbox"
          class="rounded text-orange-500 focus:ring-orange-500"
          @change="emitUpdate"
        />
        <span class="text-sm text-green-700 dark:text-green-300">Tampilkan Featured Saja</span>
      </label>

      <label 
        v-if="hasShowCategories"
        class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer"
      >
        <input
          v-model="localContent.showCategories"
          type="checkbox"
          class="rounded text-orange-500 focus:ring-orange-500"
          @change="emitUpdate"
        />
        <span class="text-sm text-green-700 dark:text-green-300">Tampilkan Filter Kategori</span>
      </label>

      <label 
        v-if="hasShowUpcoming"
        class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer"
      >
        <input
          v-model="localContent.showUpcoming"
          type="checkbox"
          class="rounded text-orange-500 focus:ring-orange-500"
          @change="emitUpdate"
        />
        <span class="text-sm text-green-700 dark:text-green-300">Tampilkan Upcoming Saja</span>
      </label>

      <label 
        v-if="hasAutoPlay"
        class="flex items-center gap-2 px-4 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer"
      >
        <input
          v-model="localContent.autoPlay"
          type="checkbox"
          class="rounded text-orange-500 focus:ring-orange-500"
          @change="emitUpdate"
        />
        <span class="text-sm text-green-700 dark:text-green-300">Auto Play</span>
      </label>
    </div>

    <!-- Info Box -->
    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex gap-3">
        <PhInfo :size="20" class="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Catatan</h4>
          <p class="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Data {{ sectionKey }} akan diambil langsung dari database. 
            Anda dapat mengatur judul, subtitle, dan pengaturan tampilan di sini.
            Untuk menambah/edit item, gunakan menu {{ sectionKey }} di sidebar.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { PhInfo } from '@phosphor-icons/vue'
import RichTextEditor from '@/components/molecules/RichTextEditor.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  sectionKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Section Editor'
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

// Determine which options to show based on section
const hasShowFeatured = computed(() => 
  ['merchandise', 'products', 'library'].includes(props.sectionKey)
)

const hasShowCategories = computed(() => 
  ['products'].includes(props.sectionKey)
)

const hasShowUpcoming = computed(() => 
  ['events'].includes(props.sectionKey)
)

const hasAutoPlay = computed(() => 
  ['funfacts'].includes(props.sectionKey)
)

const localContent = reactive({
  title: '',
  subtitle: '',
  maxItems: 6,
  layout: 'grid',
  showFeaturedOnly: false,
  showCategories: false,
  showUpcoming: true,
  autoPlay: true
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
