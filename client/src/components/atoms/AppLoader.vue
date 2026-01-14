<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <div class="relative">
      <div 
        class="animate-spin rounded-full border-t-2 border-b-2 border-orange-500"
        :class="sizeClasses"
      ></div>
    </div>
    <p v-if="text" class="text-sm font-medium text-green-600 dark:text-gray-400">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-6 h-6 border-2'
    case 'lg': return 'w-14 h-14 border-4'
    default: return 'w-10 h-10 border-4' // md
  }
})
</script>
