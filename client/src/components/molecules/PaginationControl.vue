<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
    <div class="text-sm text-green-500 dark:text-gray-400 font-medium">
      {{ startIndex }} - {{ endIndex }} of {{ total }} items
    </div>
    
    <div class="flex items-center gap-1">
      <button
        @click="goToPrevious"
        :disabled="currentPage === 1"
        class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 bg-white dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-green-800 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-green-300"
      >
        Previous
      </button>
      
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200"
        :class="page === currentPage 
          ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-none' 
          : 'bg-white dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-green-800 hover:border-orange-500'"
      >
        {{ page }}
      </button>
      
      <button
        @click="goToNext"
        :disabled="currentPage === totalPages"
        class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 bg-white dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-green-800 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-green-300"
      >
        Next
      </button>
    </div>

    <select 
      v-model="itemsPerPage" 
      @change="handlePerPageChange" 
      class="px-3 py-1.5 rounded-lg border text-sm transition-all duration-200 bg-white dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-gray-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
    >
      <option v-for="option in perPageOptions" :key="option" :value="option">
        {{ option }} / page
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  modelValue: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 10
  },
  perPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  }
})

const emit = defineEmits(['update:modelValue', 'update:perPage'])

const currentPage = ref(props.modelValue)
const itemsPerPage = ref(props.perPage)

const totalPages = computed(() => Math.ceil(props.total / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, props.total))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    emit('update:modelValue', page)
  }
}

const goToPrevious = () => {
  goToPage(currentPage.value - 1)
}

const goToNext = () => {
  goToPage(currentPage.value + 1)
}

const handlePerPageChange = () => {
  emit('update:perPage', itemsPerPage.value)
  goToPage(1) // Reset to first page
}

watch(() => props.modelValue, (newValue) => {
  currentPage.value = newValue
})

watch(() => props.perPage, (newValue) => {
  itemsPerPage.value = newValue
})
</script>
