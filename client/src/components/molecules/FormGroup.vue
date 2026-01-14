<template>
  <div class="mb-5">
    <label v-if="label" :for="inputId" class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    
    <slot>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-green-900/50 border-green-300 dark:border-green-600 text-green-900 dark:text-white placeholder-green-400 dark:placeholder-green-500/50 focus:border-orange-500 focus:ring-orange-500/20"
        :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500/20': error }"
      />
    </slot>

    <p v-if="error" class="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400 flex items-center gap-1">
      <span class="inline-block">⚠️</span> {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-green-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  error: String,
  hint: String,
  required: Boolean,
  disabled: Boolean,
  id: String
})

defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
</script>
