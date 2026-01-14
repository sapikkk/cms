<template>
  <div class="w-full">
    <div class="relative flex items-center">
      <span class="absolute left-3 text-green-400 dark:text-white0 pointer-events-none">🔍</span>
      <input
        type="text"
        v-model="query"
        @input="handleInput"
        @keyup.enter="handleSearch"
        :placeholder="placeholder"
        class="w-full pl-10 pr-10 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-green-900/50 border-green-300 dark:border-green-600 text-green-900 dark:text-white placeholder-green-400 dark:placeholder-green-500/50 focus:border-orange-500 focus:ring-orange-500/20"
      />
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-3 text-green-400 hover:text-green-600 dark:text-white0 dark:hover:text-green-200 p-1 rounded-full hover:bg-cream-200 dark:hover:bg-green-800 transition-colors"
        title="Clear"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const query = ref(props.modelValue)
let debounceTimer = null

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', query.value)
    emit('search', query.value)
  }, props.debounce)
}

const handleSearch = () => {
  emit('update:modelValue', query.value)
  emit('search', query.value)
}

const clearSearch = () => {
  query.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}
</script>
