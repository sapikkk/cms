<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
          Section Order & Visibility
        </h2>
        <p class="text-sm text-green-600 dark:text-green-400 mt-1">
          Drag untuk mengatur urutan, toggle untuk menampilkan/menyembunyikan section
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="(section, index) in localSections"
        :key="section.key"
        class="flex items-center gap-4 p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700"
      >
        <!-- Drag Handle -->
        <div class="cursor-move text-green-400 dark:text-green-600">
          <PhDotsSixVertical :size="20" />
        </div>

        <!-- Order Number -->
        <div class="w-8 h-8 rounded-full bg-green-600 dark:bg-green-500 text-white flex items-center justify-center text-sm font-bold">
          {{ index + 1 }}
        </div>

        <!-- Section Info -->
        <div class="flex-1">
          <h4 class="font-medium text-green-800 dark:text-green-100">
            {{ getSectionLabel(section.key) }}
          </h4>
          <p class="text-xs text-green-600 dark:text-green-400">
            {{ getSectionDescription(section.key) }}
          </p>
        </div>

        <!-- Icon -->
        <component 
          :is="getSectionIcon(section.key)" 
          :size="24" 
          class="text-green-500 dark:text-green-400"
        />

        <!-- Visibility Toggle -->
        <button
          @click="toggleVisibility(index)"
          :class="[
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            section.isVisible ? 'bg-green-600' : 'bg-gray-200 dark:bg-green-700'
          ]"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              section.isVisible ? 'translate-x-5' : 'translate-x-0'
            ]"
          />
        </button>

        <!-- Move Buttons -->
        <div class="flex flex-col gap-1">
          <button
            @click="moveUp(index)"
            :disabled="index === 0"
            class="p-1 rounded hover:bg-green-200 dark:hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed text-green-600 dark:text-green-400"
          >
            <PhCaretUp :size="16" />
          </button>
          <button
            @click="moveDown(index)"
            :disabled="index === localSections.length - 1"
            class="p-1 rounded hover:bg-green-200 dark:hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed text-green-600 dark:text-green-400"
          >
            <PhCaretDown :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex gap-3">
        <PhInfo :size="20" class="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Catatan</h4>
          <p class="text-sm text-blue-600 dark:text-blue-300 mt-1">
            Navbar dan Footer selalu ditampilkan di posisi tetap (atas dan bawah).
            Section di atas mengatur urutan konten di antara keduanya.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { 
  PhDotsSixVertical, 
  PhCaretUp, 
  PhCaretDown, 
  PhInfo,
  PhImage,
  PhCalendar,
  PhShoppingBag,
  PhChats,
  PhLightbulb,
  PhCoffee,
  PhBooks,
  PhTag,
  PhHandshake
} from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ sections: [] })
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localSections = ref([])

const sectionInfo = {
  hero: { label: 'Hero Banner', description: 'Section utama dengan gambar besar dan CTA', icon: PhImage },
  products: { label: 'Katalog Produk', description: 'Menampilkan produk minuman dari database', icon: PhCoffee },
  events: { label: 'Event', description: 'Daftar event dan kegiatan', icon: PhCalendar },
  merchandise: { label: 'Merchandise', description: 'Produk merchandise', icon: PhShoppingBag },
  promo: { label: 'Promo', description: 'Banner promo dan penawaran', icon: PhTag },
  library: { label: 'Pustaka', description: 'Koleksi buku/perpustakaan', icon: PhBooks },
  funfacts: { label: 'Fun Facts', description: 'Fakta menarik seputar kopi', icon: PhLightbulb },
  forum: { label: 'Forum', description: 'Info komunitas dan forum', icon: PhChats },
  collaboration: { label: 'Kolaborasi', description: 'Partner dan kerjasama', icon: PhHandshake }
}

const getSectionLabel = (key) => sectionInfo[key]?.label || key
const getSectionDescription = (key) => sectionInfo[key]?.description || ''
const getSectionIcon = (key) => sectionInfo[key]?.icon || PhImage

const toggleVisibility = (index) => {
  localSections.value[index].isVisible = !localSections.value[index].isVisible
  emitUpdate()
}

const moveUp = (index) => {
  if (index > 0) {
    const temp = localSections.value[index]
    localSections.value[index] = localSections.value[index - 1]
    localSections.value[index - 1] = temp
    updateOrder()
  }
}

const moveDown = (index) => {
  if (index < localSections.value.length - 1) {
    const temp = localSections.value[index]
    localSections.value[index] = localSections.value[index + 1]
    localSections.value[index + 1] = temp
    updateOrder()
  }
}

const updateOrder = () => {
  localSections.value.forEach((section, index) => {
    section.order = index
  })
  emitUpdate()
}

const emitUpdate = () => {
  emit('update:modelValue', { sections: [...localSections.value] })
  emit('update')
}

watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.sections) {
    localSections.value = [...newVal.sections].sort((a, b) => a.order - b.order)
  }
}, { immediate: true, deep: true })
</script>
