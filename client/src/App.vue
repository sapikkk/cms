<template>
  <div>
    <component :is="layout">
      <router-view />
    </component>
    
    <!-- Global Toast Notifications -->
    <Toaster 
      position="top-right" 
      :toastOptions="{
        duration: 3000,
        style: { background: 'white', color: '#166534' },
        className: 'custom-toast',
      }"
    />
    
    <!-- Global Confirm Dialog -->
    <ConfirmDialog
      :isOpen="isOpen"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirmText="dialogConfig.confirmText"
      :cancelText="dialogConfig.cancelText"
      :variant="dialogConfig.variant"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @update:isOpen="val => isOpen = val"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useConfirm } from '@/composables/useConfirm'

import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StorefrontLayout from '@/layouts/StorefrontLayout.vue'

// Import vue-sonner CSS
import 'vue-sonner/style.css'

const route = useRoute()
const { isOpen, dialogConfig, handleConfirm, handleCancel } = useConfirm()

const layouts = {
  auth: AuthLayout,
  dashboard: DashboardLayout,
  storefront: StorefrontLayout
}

const layout = computed(() => {
  const layoutName = route.meta?.layout || 'auth'
  return layouts[layoutName] || AuthLayout
})
</script>
