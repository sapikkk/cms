<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot v-if="!loading" name="icon"></slot>
    <span v-if="!loading || loadingText">{{ loading ? loadingText : '' }}</span>
    <slot v-if="!loading"></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'info', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95'
  ]
  
  // Variant Styles using Brand Colors
  switch (props.variant) {
    case 'primary': // Orange (Action)
      classes.push('bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-200 dark:shadow-none focus:ring-orange-500 border-transparent')
      break
    case 'secondary': // Green (Brand)
      classes.push('bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-100 dark:shadow-none focus:ring-green-500 border-transparent')
      break
    case 'danger': // Red
      classes.push('bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md shadow-red-100 dark:shadow-none border-transparent')
      break
    case 'info': // Blue
      classes.push('bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-md shadow-blue-100 dark:shadow-none border-transparent')
      break
    case 'outline':
      classes.push('bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500')
      break
    case 'ghost':
      classes.push('bg-transparent text-green-600 dark:text-gray-400 hover:bg-cream-200 dark:hover:bg-green-800 hover:text-orange-600 dark:hover:text-orange-400 border-transparent')
      break
  }
  
  // Size
  switch (props.size) {
    case 'sm':
      classes.push('px-3 py-1.5 text-sm')
      break
    case 'md':
      classes.push('px-5 py-2.5 text-base')
      break
    case 'lg':
      classes.push('px-8 py-3.5 text-lg')
      break
  }
  
  // Full width
  if (props.fullWidth) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
