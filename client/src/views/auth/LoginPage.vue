<template>
  <div class="min-h-screen bg-brand-bg dark:bg-green-900 transition-colors duration-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-100/50 to-transparent dark:from-black/20 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-green-100/50 to-transparent dark:from-black/20 pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center mb-6">
        <router-link to="/">
          <img src="/Antitesa.svg" alt="Antitesa" class="h-16 w-auto drop-shadow-lg transform hover:scale-105 transition-transform" />
        </router-link>
      </div>
      <h2 class="mt-2 text-center text-3xl font-extrabold text-green-900 dark:text-white">
        Masuk ke Dashboard
      </h2>
      <p class="mt-2 text-center text-sm text-green-700 dark:text-gray-300">
        Kelola bisnis kopi Anda dengan eksosistem <span class="font-bold text-orange-600 dark:text-orange-400">Antitesa</span>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="bg-white dark:bg-green-800 py-8 px-4 shadow-xl border border-orange-100 dark:border-green-700 sm:rounded-2xl sm:px-10 transition-colors duration-300">
        
        <!-- Theme Toggle Absolute -->
        <div class="absolute top-4 right-4">
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-700 text-green-600 dark:text-gray-300 transition-colors"
            title="Toggle Theme"
          >
             <PhSun v-if="isDark" :size="20" weight="fill" class="text-orange-400" />
             <PhMoon v-else :size="20" weight="fill" class="text-green-700" />
          </button>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-bold text-green-900 dark:text-white">
              Username atau Email
            </label>
            <div class="mt-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhUser :size="20" class="text-green-400 dark:text-white0" />
              </div>
              <input
                id="username"
                v-model="username"
                name="username"
                type="text"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-green-300 dark:border-green-600 rounded-xl bg-white dark:bg-green-900/50 text-green-900 dark:text-white placeholder-green-400 dark:placeholder-green-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Masukan akun anda"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-bold text-green-900 dark:text-white">
              Password
            </label>
            <div class="mt-1 relative">
               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhLockKey :size="20" class="text-green-400 dark:text-white0" />
              </div>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full pl-10 pr-3 py-2.5 border border-green-300 dark:border-green-600 rounded-xl bg-white dark:bg-green-900/50 text-green-900 dark:text-white placeholder-green-400 dark:placeholder-green-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-4 animate-scale-in">
            <div class="flex">
              <div class="flex-shrink-0">
                <PhWarningCircle :size="20" weight="fill" class="text-red-500" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-bold text-red-800 dark:text-red-300">
                  Login Gagal
                </h3>
                <div class="mt-1 text-sm text-red-700 dark:text-red-400">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-200 dark:shadow-none text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Memproses...
              </span>
              <span v-else>Masuk Dashboard</span>
            </button>
          </div>
        </form>

        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-green-200 dark:border-green-700" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-green-800 text-green-500 dark:text-gray-400">
                Lupa password? Hubungi Master Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { PhUser, PhLockKey, PhWarningCircle, PhSun, PhMoon } from '@phosphor-icons/vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const success = await authStore.login({
      username: username.value,
      password: password.value
    })

    if (success) {
      router.push('/dashboard')
    } else {
      error.value = authStore.error || 'Username atau password salah'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan pada server'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})
</script>
