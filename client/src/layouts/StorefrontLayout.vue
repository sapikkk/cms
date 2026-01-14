<template>
  <div class="min-h-screen flex flex-col bg-brand-bg dark:bg-green-900 transition-colors duration-300">
    <Navbar />

    <!-- Content -->
    <main class="flex-1">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from '@/components/storefront/Navbar.vue'
import Footer from '@/components/storefront/Footer.vue'

onMounted(() => {
  // Initialize theme from local storage if available
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
})
</script>
