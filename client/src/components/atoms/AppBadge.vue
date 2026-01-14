<template>
  <span :class="badgeClasses">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'neutral'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const classes = ['inline-flex items-center font-bold rounded-lg transition-colors duration-200']
  
  // Variant
  switch (props.variant) {
    case 'primary': // Orange
      classes.push('bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border border-orange-200 dark:border-orange-800')
      break
    case 'success': // Green
      classes.push('bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-gray-300 border border-green-200 dark:border-green-800')
      break
    case 'warning': // Yellow
      classes.push('bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800')
      break
    case 'danger': // Red
      classes.push('bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border border-red-200 dark:border-red-800')
      break
    case 'info': // Blue
      classes.push('bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800')
      break
    case 'neutral': // Gray/Green-tinted
      classes.push('bg-cream-200 text-green-800 dark:bg-green-800 dark:text-white border border-green-200 dark:border-green-700')
      break
  }
  
  // Size
  switch (props.size) {
    case 'sm':
      classes.push('text-xs px-2 py-0.5')
      break
    case 'md':
      classes.push('text-sm px-2.5 py-0.5')
      break
    case 'lg':
      classes.push('text-base px-3 py-1')
      break
  }
  
  return classes.join(' ')
})
</script>
