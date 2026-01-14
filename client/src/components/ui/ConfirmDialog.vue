<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="onCancel"
      >
        <div class="bg-white dark:bg-green-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-green-200 dark:border-green-700">
          <!-- Header -->
          <div class="p-6 border-b border-green-100 dark:border-green-800">
            <div class="flex items-start gap-4">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                :class="iconBgClass"
              >
                <component :is="iconComponent" :size="24" :class="iconColorClass" weight="duotone" />
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-green-900 dark:text-white">
                  {{ title }}
                </h3>
                <p class="text-sm text-green-600 dark:text-green-400 mt-1">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="p-6 bg-cream-50 dark:bg-green-950/50 flex gap-3 justify-end">
            <button
              @click="onCancel"
              class="px-4 py-2 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 dark:hover:bg-green-700 font-medium transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { 
  PhWarning, 
  PhTrash, 
  PhInfo, 
  PhCheckCircle 
} from '@phosphor-icons/vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Konfirmasi'
  },
  message: {
    type: String,
    default: 'Apakah Anda yakin?'
  },
  confirmText: {
    type: String,
    default: 'Ya, Lanjutkan'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  variant: {
    type: String,
    default: 'warning', // warning, danger, info, success
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

const onConfirm = () => {
  emit('confirm')
  emit('update:isOpen', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}

const iconComponent = computed(() => {
  const icons = {
    warning: PhWarning,
    danger: PhTrash,
    info: PhInfo,
    success: PhCheckCircle
  }
  return icons[props.variant]
})

const iconBgClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30'
  }
  return classes[props.variant]
})

const iconColorClass = computed(() => {
  const classes = {
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400'
  }
  return classes[props.variant]
})

const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  }
  return classes[props.variant]
})
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active > div,
.dialog-fade-leave-active > div {
  transition: transform 0.2s ease;
}

.dialog-fade-enter-from > div,
.dialog-fade-leave-to > div {
  transform: scale(0.95);
}
</style>
