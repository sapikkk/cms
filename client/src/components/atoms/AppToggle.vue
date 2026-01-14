<template>
  <button
    type="button"
    class="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer focus:outline-none group"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :disabled="disabled"
    @click="toggle"
    role="switch"
    :aria-checked="modelValue"
  >
    <div 
      class="relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out"
      :class="modelValue ? 'bg-orange-500' : 'bg-cream-300 dark:bg-green-900/50 border border-green-300 dark:border-green-700'"
    >
      <div 
        class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
        :class="modelValue ? 'translate-x-6' : 'translate-x-0'"
      ></div>
    </div>
    <span v-if="label" class="text-sm font-medium text-green-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">{{ label }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>
