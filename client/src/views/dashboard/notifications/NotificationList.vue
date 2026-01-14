<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">Notifikasi & Pengumuman</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Kelola pemberitahuan untuk pengunjung</p>
      </div>
      <router-link
        to="/dashboard/notifications/create"
        class="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 font-medium"
      >
        <PhPlus :size="20" weight="bold" />
        <span>Tambah Notifikasi</span>
      </router-link>
    </div>

    <div class="space-y-4">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span
                :class="[
                  'px-3 py-1 rounded-lg text-xs font-bold',
                  notif.notificationType === 'URGENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  notif.notificationType === 'WARNING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  notif.notificationType === 'SUCCESS' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                ]"
              >
                {{ notif.notificationType }}
              </span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  notif.isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                ]"
              >
                {{ notif.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-green-800 dark:text-white mb-1">{{ notif.title }}</h3>
            <p class="text-green-600 dark:text-gray-400 mb-3">{{ notif.message }}</p>
            <div class="text-sm text-green-500 dark:text-gray-400">
              <span v-if="notif.startDate">Mulai: {{ formatDate(notif.startDate) }}</span>
              <span v-if="notif.endDate" class="ml-4">Hingga: {{ formatDate(notif.endDate) }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="toggleActive(notif)"
              class="px-3 py-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm font-medium"
            >
              {{ notif.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
            </button>
            <router-link
              :to="`/dashboard/notifications/${notif.id}/edit`"
              class="px-3 py-2 bg-cream-100 hover:bg-cream-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-white rounded-lg text-sm"
            >
              <PhPencilSimple :size="16" />
            </router-link>
            <button
              @click="deleteNotification(notif.id)"
              class="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg text-sm"
            >
              <PhTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="notifications.length === 0" class="text-center py-16">
      <PhBell :size="64" weight="duotone" class="mx-auto text-green-200 dark:text-green-800/50 mb-4" />
      <p class="text-green-500 dark:text-gray-400 font-medium">Belum ada notifikasi.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PhPlus, PhBell, PhPencilSimple, PhTrash, PhEye, PhEyeSlash } from '@phosphor-icons/vue'
import notificationService from '@/api/services/notification.service'
import { useConfirm } from '@/composables/useConfirm'
import { showToast } from '@/utils/toast'
import dayjs from 'dayjs'

const notifications = ref([])
const loading = ref(false)
const { confirm } = useConfirm()

const fetchNotifications = async () => {
  try {
    const response = await notificationService.getAll()
    notifications.value = response.data.data || []
  } catch (err) {
    console.error('Error fetching notifications:', err)
  }
}

const toggleActive = async (notif) => {
  const newStatus = !notif.isActive
  const loadingToast = showToast.loading('Mengubah status...')

  try {
    await notificationService.update(notif.id, { isActive: newStatus })
    notif.isActive = newStatus
    showToast.success('Berhasil!', `Notifikasi ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
  } catch (err) {
    showToast.error('Gagal!', 'Tidak dapat mengubah status')
    console.error('Error toggling status:', err)
  }
}

const deleteNotification = async (id) => {
  const confirmed = await confirm({
    title: 'Hapus Notifikasi?',
    message: 'Notifikasi akan dihapus permanen',
    variant: 'danger',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  })
  
  if (!confirmed) return

  const loadingToast = showToast.loading('Menghapus notifikasi...')
  try {
    await notificationService.delete(id)
    notifications.value = notifications.value.filter(n => n.id !== id)
    showToast.success('Berhasil!', 'Notifikasi telah dihapus')
  } catch (err) {
    showToast.error('Gagal!', 'Tidak dapat menghapus notifikasi')
    console.error('Error deleting notification:', err)
  }
}

const formatDate = (date) => dayjs(date).format('DD MMM YYYY, HH:mm')

onMounted(fetchNotifications)
</script>
