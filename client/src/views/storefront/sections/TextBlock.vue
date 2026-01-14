<template>
  <div 
    class="p-8 rounded-2xl border transition-all duration-300"
    :class="[
      variant === 'default' ? 'bg-cream-50 dark:bg-green-900 border-green-200 dark:border-green-800' :
      variant === 'highlighted' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50' :
      variant === 'minimal' ? 'bg-transparent border-transparent' :
      'bg-cream-50 dark:bg-green-900 border-green-200 dark:border-green-800'
    ]"
  >
    <!-- Title -->
    <h3 
      v-if="title" 
      class="font-bold mb-4"
      :class="[
        size === 'large' ? 'text-3xl md:text-4xl' :
        size === 'medium' ? 'text-2xl md:text-3xl' :
        'text-xl md:text-2xl',
        variant === 'highlighted' ? 'text-orange-700 dark:text-orange-400' : 'text-green-900 dark:text-white'
      ]"
    >
      <span v-html="title"></span>
    </h3>

    <!-- Subtitle (optional) -->
    <p 
      v-if="subtitle" 
      class="text-lg font-semibold mb-4"
      :class="variant === 'highlighted' ? 'text-orange-600 dark:text-orange-300' : 'text-green-700 dark:text-cream-200'"
    >
      <span v-html="subtitle"></span>
    </p>

    <!-- Content -->
    <div 
      class="leading-relaxed"
      :class="[
        size === 'large' ? 'text-lg' : size === 'medium' ? 'text-base' : 'text-sm',
        variant === 'highlighted' ? 'text-orange-700 dark:text-orange-200' : 'text-green-700 dark:text-cream-300'
      ]"
    >
      <!-- Support for markdown-like formatting -->
      <div v-if="formatted" v-html="formattedContent"></div>
      
      <!-- Plain text with whitespace preserved -->
      <p v-else class="whitespace-pre-wrap" v-html="content || 'Enter your text content here...'">
      </p>
    </div>

    <!-- Optional CTA -->
    <div v-if="ctaText" class="mt-6">
      <button 
        @click="$emit('cta-click')"
        class="px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        :class="
          variant === 'highlighted' 
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-green-800 hover:bg-green-900 dark:bg-cream-100 dark:hover:bg-cream-200 text-white dark:text-green-900'
        "
      >
        {{ ctaText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  subtitle: String,
  content: String,
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // 'default', 'highlighted', 'minimal'
    validator: (value) => ['default', 'highlighted', 'minimal'].includes(value)
  },
  formatted: {
    type: Boolean,
    default: false
  },
  ctaText: String
})

defineEmits(['cta-click'])

// Simple markdown-like formatting
const formattedContent = computed(() => {
  if (!props.formatted || !props.content) return props.content
  
  let text = props.content
  
  // Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
  
  // Italic: *text* -> <em>text</em>
  text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
  
  // Line breaks
  text = text.replace(/\n/g, '<br>')
  
  return text
})
</script>