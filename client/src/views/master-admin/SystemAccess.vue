<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-green-900 dark:text-white flex items-center gap-2">
          <PhUsers :size="28" weight="duotone" class="text-brand-orange" />
          System Access Control
        </h1>
        <p class="text-green-600 dark:text-green-400 mt-1 text-sm">
          Kelola pengguna, hak akses, dan keamanan sistem
        </p>
      </div>
      
      <button 
        @click="openCreateModal"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm shadow-green-200 dark:shadow-none"
      >
        <PhPlus :size="18" weight="bold" />
        Tambah User
      </button>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 overflow-hidden">
      
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="animate-spin w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-green-600 dark:text-green-400 text-sm font-medium">Memuat data pengguna...</p>
      </div>

       <!-- Error State -->
      <div v-else-if="errorState" class="p-12 text-center">
         <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PhWarningCircle :size="32" weight="duotone" class="text-red-500" />
         </div>
         <h3 class="text-lg font-bold text-red-700 dark:text-red-400">Gagal Memuat Data</h3>
         <p class="text-red-600 dark:text-red-300/80 mt-2 text-sm max-w-md mx-auto">{{ errorState }}</p>
         <button 
            @click="fetchUsers" 
            class="mt-6 px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 text-sm font-medium transition-colors shadow-sm"
         >
           Coba Lagi
         </button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-green-50/50 dark:bg-green-800/20 border-b border-green-100 dark:border-green-800">
              <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">User</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">Role</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">Bergabung</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-green-50 dark:divide-green-800/50">
            <tr 
              v-for="user in users" 
              :key="user.id"
              class="hover:bg-green-50/30 dark:hover:bg-green-800/30 transition-colors group"
            >
              <!-- User Info -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm overflow-hidden shrink-0 border border-brand-orange/20">
                    <img 
                      v-if="user.avatar" 
                      :src="user.avatar" 
                      :alt="user.fullName || user.username"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>{{ (user.fullName?.[0] || user.username[0] || '?').toUpperCase() }}</span>
                  </div>
                  <div>
                    <div class="font-medium text-green-900 dark:text-green-100">{{ user.fullName || 'No Name' }}</div>
                    <div class="text-xs text-green-500 dark:text-green-400/80 font-mono mt-0.5">@{{ user.username }}</div>
                    <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 hidden group-hover:block">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                  :class="getRoleBadgeClass(user.role)"
                >
                  <component :is="getRoleIcon(user.role)" weight="fill" :size="12" />
                  {{ formatRole(user.role) }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="user.isLocked ? 'bg-red-500' : 'bg-green-500'"
                  ></div>
                  <span 
                    class="text-xs font-medium"
                    :class="user.isLocked ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                  >
                    {{ user.isLocked ? 'Locked' : 'Active' }}
                  </span>
                </div>
              </td>

              <!-- Created At -->
              <td class="px-6 py-4 whitespace-nowrap text-xs text-green-600 dark:text-green-400/80">
                {{ formatDate(user.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <template v-if="user.role !== 'MASTER_ADMIN'">
                    <!-- Lock/Unlock -->
                    <button 
                      @click="toggleLock(user)"
                      class="p-1.5 rounded-md transition-all duration-200 border"
                      :class="user.isLocked 
                        ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300' 
                        : 'bg-white border-transparent text-gray-400 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'"
                      :title="user.isLocked ? 'Unlock Account' : 'Lock Account'"
                    >
                      <PhLockOpen v-if="user.isLocked" :size="16" weight="bold" />
                      <PhLock v-else :size="16" weight="bold" />
                    </button>

                    <!-- Edit Role -->
                    <button 
                      @click="openRoleEditor(user)"
                      class="p-1.5 rounded-md transition-all duration-200 bg-white border border-transparent text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      title="Change Role"
                    >
                      <PhIdentificationBadge :size="16" weight="bold" />
                    </button>

                    <!-- Delete -->
                    <button 
                      @click="deleteUser(user)"
                      class="p-1.5 rounded-md transition-all duration-200 bg-white border border-transparent text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      title="Delete User"
                    >
                      <PhTrash :size="16" weight="bold" />
                    </button>
                  </template>
                  
                  <span v-else class="text-[10px] uppercase font-bold tracking-wider text-green-300/50 select-none py-1.5 cursor-not-allowed">
                    Protected
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Edit Role Dialog -->
    <Transition name="dialog-fade">
      <div v-if="editingUser" class="fixed inset-0 z-[60] flex items-center justify-center bg-green-950/20 backdrop-blur-[2px]" @click.self="closeRoleEditor">
        <div class="bg-white dark:bg-green-900 rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden border border-green-100 dark:border-green-700 transform transition-all scale-100 ring-1 ring-black/5">
          <div class="p-5 border-b border-green-50 dark:border-green-800 bg-green-50/30 dark:bg-green-800/20">
            <h3 class="text-base font-bold text-green-900 dark:text-white flex items-center gap-2">
              <PhIdentificationBadge :size="20" class="text-brand-orange" weight="duotone" />
              Ubah Role User
            </h3>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1">
              Pilih role baru untuk <strong class="text-green-800 dark:text-green-200">@{{ editingUser.username }}</strong>
            </p>
          </div>
          
          <div class="p-4 space-y-2">
            <button 
              v-for="role in availableRoles" 
              :key="role.value"
              @click="changeRole(role.value)"
              class="w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 group relative overflow-hidden"
              :class="editingUser.role === role.value 
                ? 'border-brand-orange bg-orange-50/50 dark:bg-orange-900/10 dark:border-brand-orange/50' 
                : 'border-slate-100 dark:border-green-800 hover:border-green-200 dark:hover:border-green-600 bg-white dark:bg-transparent hover:bg-green-50/30'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105" :class="role.bgClass">
                <component :is="role.icon" :size="20" :class="role.textClass" weight="duotone" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                   <div class="font-bold text-sm text-green-900 dark:text-green-100">{{ role.label }}</div>
                    <PhCheckCircle v-if="editingUser.role === role.value" weight="fill" class="text-brand-orange" :size="18" />
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ role.desc }}</div>
              </div>
            </button>
          </div>
          
          <div class="p-4 bg-gray-50/50 dark:bg-green-950/30 flex justify-end">
            <button 
              @click="closeRoleEditor" 
              class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-medium hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-800/30 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Create User Dialog -->
    <Transition name="dialog-fade">
      <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-green-950/20 backdrop-blur-[2px]" @click.self="closeCreateModal">
        <div class="bg-white dark:bg-green-900 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden border border-green-100 dark:border-green-700 transform transition-all scale-100 ring-1 ring-black/5">
          <div class="p-5 border-b border-green-50 dark:border-green-800 bg-green-50/30 dark:bg-green-800/20">
            <h3 class="text-base font-bold text-green-900 dark:text-white flex items-center gap-2">
              <PhUserPlus :size="20" class="text-brand-orange" weight="duotone" />
              Tambah Pengguna Baru
            </h3>
            <p class="text-xs text-green-600 dark:text-green-400 mt-1">
              Buat akun baru untuk staff atau admin.
            </p>
          </div>

          <form @submit.prevent="submitCreateUser" class="p-5 space-y-4">
            <!-- Full Name -->
            <div>
              <label class="block text-xs font-semibold text-green-800 dark:text-green-200 mb-1.5">Nama Lengkap</label>
              <input 
                v-model="newUserForm.fullName" 
                type="text" 
                required 
                class="w-full px-3 py-2 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none" 
                placeholder="Contoh: Budi Santoso"
              />
            </div>

            <!-- Username & Email -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-green-800 dark:text-green-200 mb-1.5">Username</label>
                <input 
                  v-model="newUserForm.username" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none" 
                  placeholder="budi123"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-green-800 dark:text-green-200 mb-1.5">Email</label>
                <input 
                  v-model="newUserForm.email" 
                  type="email" 
                  required 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none" 
                  placeholder="budi@example.com"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold text-green-800 dark:text-green-200 mb-1.5">Password</label>
              <input 
                v-model="newUserForm.password" 
                type="password" 
                required 
                minlength="6"
                class="w-full px-3 py-2 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none" 
                placeholder="Minimal 6 karakter"
              />
            </div>

             <!-- Role Selection -->
            <div>
              <label class="block text-xs font-semibold text-green-800 dark:text-green-200 mb-1.5">Role Awal</label>
              <select 
                v-model="newUserForm.role" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-green-900/40 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange outline-none"
              >
                <option value="USER_PUBLIC">Public User (Customer)</option>
                <option value="MEDIA_STAFF">Media Staff (Content & Products)</option>
                <option value="CASHIER">Cashier (POS & Transaksi)</option>
                <option value="BARISTA">Barista (Order Management)</option>
                <option value="ADMIN_OWNER">Admin Owner (Full Access)</option>
              </select>
            </div>

            <div class="pt-2 flex justify-end gap-3">
              <button 
                type="button" 
                @click="closeCreateModal" 
                class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-green-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="isCreating"
                class="px-4 py-2 text-sm bg-brand-orange hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div v-if="isCreating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ isCreating ? 'Menyimpan...' : 'Buat User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import userService from '@/api/services/user.service'
import { 
  PhUsers, PhWarningCircle, PhShieldCheck, PhCrown, PhPenNib, PhUser, 
  PhLock, PhLockOpen, PhIdentificationBadge, PhTrash, PhCheckCircle, PhPlus, PhUserPlus,
  PhCashRegister, PhCoffee
} from '@phosphor-icons/vue'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import dayjs from 'dayjs'

// State
const users = ref([])
const loading = ref(true)
const errorState = ref(null)
const editingUser = ref(null)
const showCreateModal = ref(false)
const isCreating = ref(false)

const newUserForm = reactive({
  fullName: '',
  username: '',
  email: '',
  password: '',
  role: 'USER_PUBLIC'
})

// Composables
const { confirm } = useConfirm()

// Constants
const availableRoles = [
  { value: 'ADMIN_OWNER', label: 'Owner', desc: 'Akses penuh bisnis', icon: PhCrown, bgClass: 'bg-purple-100 dark:bg-purple-900/40', textClass: 'text-purple-600 dark:text-purple-300' },
  { value: 'MEDIA_STAFF', label: 'Media Staff', desc: 'Konten & Produk', icon: PhPenNib, bgClass: 'bg-blue-100 dark:bg-blue-900/40', textClass: 'text-blue-600 dark:text-blue-300' },
  { value: 'CASHIER', label: 'Cashier', desc: 'Akses POS & Transaksi', icon: PhCashRegister, bgClass: 'bg-teal-100 dark:bg-teal-900/40', textClass: 'text-teal-600 dark:text-teal-300' },
  { value: 'BARISTA', label: 'Barista', desc: 'Management Pesanan', icon: PhCoffee, bgClass: 'bg-amber-100 dark:bg-amber-900/40', textClass: 'text-amber-600 dark:text-amber-300' },
  { value: 'USER_PUBLIC', label: 'Public User', desc: 'Customer biasa', icon: PhUser, bgClass: 'bg-gray-100 dark:bg-gray-800', textClass: 'text-gray-600 dark:text-gray-300' }
]

// Fetch Users
const fetchUsers = async () => {
  loading.value = true
  errorState.value = null
  try {
    const { data } = await userService.getAll()
    users.value = data.data
  } catch (err) {
    console.error('Error fetching users:', err)
    errorState.value = err.response?.data?.message || 'Gagal memuat data pengguna'
  } finally {
    loading.value = false
  }
}

// User Creation
const openCreateModal = () => {
  newUserForm.fullName = ''
  newUserForm.username = ''
  newUserForm.email = ''
  newUserForm.password = ''
  newUserForm.role = 'USER_PUBLIC'
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const submitCreateUser = async () => {
  isCreating.value = true
  try {
    await userService.create(newUserForm)
    showToast.success('Berhasil', 'User baru telah ditambahkan')
    closeCreateModal()
    fetchUsers() // Refresh list
  } catch (err) {
    showToast.error('Gagal', err.response?.data?.message || 'Gagal membuat user')
  } finally {
    isCreating.value = false
  }
}

// Actions
const deleteUser = async (user) => {
  const confirmed = await confirm({
    title: 'Hapus User?',
    message: `Akses akun "@${user.username}" akan dihapus permanen.`,
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })

  if (!confirmed) return

  try {
    await userService.delete(user.id)
    users.value = users.value.filter(u => u.id !== user.id)
    showToast.success('Terhapus', `User ${user.username} telah dihapus`)
  } catch (err) {
    showToast.error('Gagal', err.response?.data?.message || 'Gagal menghapus user')
  }
}

const toggleLock = async (user) => {
  const isLocking = !user.isLocked
  
  const confirmed = await confirm({
    title: isLocking ? 'Kunci Akun?' : 'Buka Kunci?',
    message: isLocking 
      ? `User "@${user.username}" tidak akan bisa login.` 
      : `Akses login untuk "@${user.username}" akan dipulihkan.`,
    variant: isLocking ? 'warning' : 'info',
    confirmText: isLocking ? 'Kunci Akun' : 'Pulihkan Akses',
    cancelText: 'Batal'
  })

  if (!confirmed) return

  try {
    if (isLocking) {
      await userService.lock(user.id)
    } else {
      await userService.unlock(user.id)
    }
    
    // Update local state
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].isLocked = isLocking
    }
    
    showToast.success(isLocking ? 'Akun Dikunci' : 'Akun Dipulihkan', `Status akun ${user.username} diperbarui`)
  } catch (err) {
    showToast.error('Gagal', err.response?.data?.message)
  }
}

// Role Editing
const openRoleEditor = (user) => {
  editingUser.value = { ...user } 
}

const closeRoleEditor = () => {
  editingUser.value = null
}

const changeRole = async (newRole) => {
  if (!editingUser.value) return
  if (editingUser.value.role === newRole) {
    closeRoleEditor()
    return
  }

  const user = editingUser.value
  const roleLabel = availableRoles.find(r => r.value === newRole)?.label || newRole
  
  try {
    closeRoleEditor() // Close first for better UX
    
    await userService.updateRole(user.id, newRole)
    
    // Update local list
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].role = newRole
    }
    
    showToast.success('Role Diubah', `User ${user.username} kini menjabat ${roleLabel}`)
  } catch (err) {
    showToast.error('Gagal Update Role', err.response?.data?.message)
  }
}

// Helpers
const formatDate = (date) => dayjs(date).format('DD/MM/YYYY')

const formatRole = (role) => {
  const map = {
    'MASTER_ADMIN': 'Master',
    'ADMIN_OWNER': 'Owner',
    'MEDIA_STAFF': 'Staff',
    'CASHIER': 'Cashier',
    'BARISTA': 'Barista',
    'USER_PUBLIC': 'Public'
  }
  return map[role] || role
}

const getRoleIcon = (role) => {
  switch(role) {
    case 'MASTER_ADMIN': return PhShieldCheck
    case 'ADMIN_OWNER': return PhCrown
    case 'MEDIA_STAFF': return PhPenNib
    case 'CASHIER': return PhCashRegister
    case 'BARISTA': return PhCoffee
    default: return PhUser
  }
}

const getRoleBadgeClass = (role) => {
  switch(role) {
    case 'MASTER_ADMIN': return 'bg-red-50 text-red-700 border-red-200/50 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    case 'ADMIN_OWNER': return 'bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    case 'MEDIA_STAFF': return 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
    case 'CASHIER': return 'bg-teal-50 text-teal-700 border-teal-200/50 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800'
    case 'BARISTA': return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800'
    default: return 'bg-gray-50 text-gray-700 border-gray-200/50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
