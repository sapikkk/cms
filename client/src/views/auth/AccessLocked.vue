<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
      <!-- Icon -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
        <span class="text-4xl">🔒</span>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-green-800 mb-2">Akun Dikunci</h1>
      <p class="text-green-500 mb-6">
        Akses akun Anda telah dinonaktifkan oleh Master Admin. 
        Hubungi administrator untuk pemulihan akses.
      </p>

      <!-- Contact Info -->
      <div class="bg-cream-100 rounded-lg p-4 mb-6">
        <p class="text-sm text-green-600">
          <strong>Email Admin:</strong><br>
          master@coffeeshop.com
        </p>
      </div>

      <!-- Back Button -->
      <router-link
        to="/login"
        class="inline-flex items-center justify-center w-full py-3 px-4 bg-cream-200 hover:bg-cream-300 text-green-700 font-medium rounded-xl transition-all duration-200"
      >
        ← Kembali ke Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
// Component ini hanya tampilan statis
</script>
