<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-green-800 dark:text-green-100">
        Navbar Configuration
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Logo URL -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Logo URL
        </label>
        <input
          v-model="localContent.logo"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Logo Text -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Logo Text
        </label>
        <input
          v-model="localContent.logoText"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Contact Phone -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Contact Phone
        </label>
        <input
          v-model="localContent.contactPhone"
          type="text"
          class="w-full px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          @input="emitUpdate"
        />
      </div>

      <!-- Login Button -->
      <div>
        <label class="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">
          Login Button Text
        </label>
        <div class="flex gap-2">
          <input
            v-model="localContent.loginButtonText"
            type="text"
            class="flex-1 px-4 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="emitUpdate"
          />
          <label class="flex items-center gap-2 px-3 py-2 bg-cream-100 dark:bg-green-700 rounded-lg cursor-pointer">
            <input
              v-model="localContent.showLoginButton"
              type="checkbox"
              class="rounded text-orange-500 focus:ring-orange-500"
              @change="emitUpdate"
            />
            <span class="text-sm text-green-700 dark:text-green-300">Show</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <label class="block text-sm font-medium text-green-700 dark:text-green-300">
          Menu Items
        </label>
        <button
          @click="addMenuItem"
          class="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Tambah Menu
        </button>
      </div>
      
      <div class="space-y-3">
        <div
          v-for="(item, index) in localContent.menuItems"
          :key="index"
          class="flex items-center gap-3 p-3 bg-cream-50 dark:bg-green-900/30 rounded-lg"
        >
          <div class="flex-1 grid grid-cols-2 gap-3">
            <input
              v-model="item.label"
              type="text"
              placeholder="Label"
              class="px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
            <input
              v-model="item.link"
              type="text"
              placeholder="Link (e.g., /about)"
              class="px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-green-900/50 text-green-800 dark:text-green-100 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              @input="emitUpdate"
            />
          </div>
          <label class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-green-800 rounded-lg cursor-pointer">
            <input
              v-model="item.isActive"
              type="checkbox"
              class="rounded text-orange-500 focus:ring-orange-500"
              @change="emitUpdate"
            />
            <span class="text-xs text-green-700 dark:text-green-300">Aktif</span>
          </label>
          <button
            @click="removeMenuItem(index)"
            class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <PhTrash :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div class="p-4 bg-cream-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
      <h3 class="text-sm font-medium text-green-700 dark:text-green-300 mb-3">Preview Navbar</h3>
      <div class="bg-white dark:bg-green-900 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img v-if="localContent.logo" :src="localContent.logo" class="h-8" alt="Logo" />
          <span class="font-bold text-green-700 dark:text-green-200">{{ localContent.logoText }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span 
            v-for="item in activeMenuItems" 
            :key="item.label"
            class="text-sm text-green-600 dark:text-green-400"
          >
            {{ item.label }}
          </span>
          <span 
            v-if="localContent.showLoginButton"
            class="px-3 py-1 bg-orange-500 text-white text-sm rounded-full"
          >
            {{ localContent.loginButtonText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import { PhTrash } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update'])

const localContent = reactive({
  logo: '',
  logoText: '',
  menuItems: [],
  showLoginButton: true,
  loginButtonText: 'Login',
  contactPhone: ''
})

const activeMenuItems = computed(() => {
  return localContent.menuItems?.filter(item => item.isActive) || []
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localContent })
  emit('update')
}

const addMenuItem = () => {
  localContent.menuItems.push({
    label: 'New Menu',
    link: '/',
    isActive: true
  })
  emitUpdate()
}

const removeMenuItem = (index) => {
  localContent.menuItems.splice(index, 1)
  emitUpdate()
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(localContent, {
      ...newVal,
      menuItems: newVal.menuItems ? [...newVal.menuItems] : []
    })
  }
}, { immediate: true, deep: true })
</script>
