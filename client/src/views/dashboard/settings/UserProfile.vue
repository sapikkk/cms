<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-green-900 dark:text-white flex items-center gap-2">
        <PhUserCircle :size="28" weight="duotone" class="text-brand-orange" />
        Profil Saya
      </h1>
      <p class="text-green-600 dark:text-green-400 mt-1 text-sm">
        Kelola informasi akun dan keamanan Anda.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Profile Card -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-6 flex flex-col items-center text-center">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-orange-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
            {{ getInitials(user?.fullName || user?.username) }}
          </div>
          
          <h2 class="text-xl font-bold text-green-900 dark:text-white">{{ user?.fullName || 'User' }}</h2>
          <p class="text-green-600 dark:text-green-400 text-sm">@{{ user?.username }}</p>
          
          <div class="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700">
            <PhShieldCheck :size="14" weight="fill" />
            {{ formatRole(user?.role) }}
          </div>
        </div>
      </div>

      <!-- Settings Forms -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Change Password -->
        <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 overflow-hidden">
          <div class="p-5 border-b border-green-50 dark:border-green-800 bg-green-50/30 dark:bg-green-800/20">
            <h3 class="text-base font-bold text-green-900 dark:text-white flex items-center gap-2">
              <PhLockKey :size="20" class="text-brand-orange" weight="duotone" />
              Ganti Password
            </h3>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1">
              Amankan akun Anda dengan password yang kuat, minimal 6 karakter.
            </p>
          </div>
          
          <form @submit.prevent="submitPasswordChange" class="p-6 space-y-4">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-green-800 dark:text-green-200 mb-1.5">Password Saat Ini</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.currentPassword" 
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  class="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
                  placeholder="Masukkan password lama"
                />
                <PhLock class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" :size="18" />
                <button 
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                >
                  <PhEye v-if="showCurrentPassword" :size="18" />
                  <PhEyeSlash v-else :size="18" />
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-green-800 dark:text-green-200 mb-1.5">Password Baru</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.newPassword" 
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                  <PhKey class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" :size="18" />
                  <button 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
                  >
                    <PhEye v-if="showNewPassword" :size="18" />
                    <PhEyeSlash v-else :size="18" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-green-800 dark:text-green-200 mb-1.5">Konfirmasi Password</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    class="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none transition-all"
                    placeholder="Ulangi password baru"
                  />
                  <PhCheckCircle class="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" :size="18" />
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm shadow-orange-200 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <PhFloppyDisk v-else :size="18" weight="bold" />
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Password Baru' }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import authService from '@/api/services/auth.service'
import { showToast } from '@/utils/toast'
import { 
  PhUserCircle, PhShieldCheck, PhLockKey, PhLock, PhKey, PhEye, PhEyeSlash, PhCheckCircle, PhFloppyDisk
} from '@phosphor-icons/vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Password Form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const formatRole = (role) => {
  const map = {
    'MASTER_ADMIN': 'Master Admin',
    'ADMIN_OWNER': 'Owner',
    'MEDIA_STAFF': 'Media Staff',
    'CASHIER': 'Cashier',
    'BARISTA': 'Barista',
    'USER_PUBLIC': 'User'
  }
  return map[role] || role
}

const submitPasswordChange = async () => {
  if (passwordForm.newPassword.length < 6) {
    showToast.error('Validation Error', 'Password baru minimal 6 karakter')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast.error('Validation Error', 'Konfirmasi password tidak cocok')
    return
  }
  
  isSubmitting.value = true
  try {
    await authService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmPassword: passwordForm.confirmPassword
    })
    
    showToast.success('Berhasil', 'Password Anda telah diperbarui')
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
  } catch (err) {
    showToast.error('Gagal', err.response?.data?.message || 'Gagal mengganti password')
  } finally {
    isSubmitting.value = false
  }
}
</script>
