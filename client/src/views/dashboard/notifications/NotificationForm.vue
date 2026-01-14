<template>
  <div class="p-6">
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/dashboard/notifications" class="p-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-gray-400 hover:text-brand-orange transition-colors">
        <PhArrowLeft :size="20" />
      </router-link>
      <div>
        <h1 class="text-3xl font-bold text-text-green dark:text-white">{{ isEdit ? 'Edit Notifikasi' : 'Buat Notifikasi' }}</h1>
        <p class="text-green-500 dark:text-gray-400 mt-1">Buat pengumuman untuk pengunjung</p>
      </div>
    </div>

    <form @submit.prevent="saveNotification" class="max-w-4xl">
      <div class="bg-white dark:bg-green-900/40 rounded-lg p-6 border border-green-200 dark:border-green-800 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Judul</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Promo Spesial!"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Tipe</label>
            <select
              v-model="form.notificationType"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            >
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Prioritas (0-10)</label>
            <input
              v-model.number="form.priority"
              type="number"
              min="0"
              max="10"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Pesan</label>
            <textarea
              v-model="form.message"
              rows="3"
              required
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
              placeholder="Pesan notifikasi..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Mulai Tampil</label>
            <input
              v-model="form.startDate"
              type="datetime-local"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-green-700 dark:text-gray-300 mb-2">Berhenti Tampil</label>
            <input
              v-model="form.endDate"
              type="datetime-local"
              class="w-full px-4 py-3 border border-green-300 dark:border-green-700 rounded-lg bg-cream-100 dark:bg-green-950 text-green-900 dark:text-white focus:ring-2 focus:ring-brand-orange outline-none"
            />
          </div>

          <div class="md:col-span-2">
            <div class="flex items-center gap-4">
              <input
                v-model="form.isActive"
                type="checkbox"
                id="isActive"
                class="w-5 h-5 text-brand-orange focus:ring-brand-orange rounded"
              />
              <label for="isActive" class="text-green-700 dark:text-gray-300 font-medium">Aktifkan Notifikasi</label>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2.5 bg-brand-orange text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2 font-bold shadow-sm"
        >
          <PhFloppyDisk :size="20" weight="fill" />
          {{ loading ? 'Menyimpan...' : 'Simpan Notifikasi' }}
        </button>
        <router-link
          to="/dashboard/notifications"
          class="px-6 py-2.5 bg-white dark:bg-green-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-white rounded-lg hover:bg-cream-100 font-medium"
        >
          Batal
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhArrowLeft, PhBell, PhFloppyDisk } from '@phosphor-icons/vue'
import notificationService from '@/api/services/notification.service'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = reactive({
  title: '',
  message: '',
  notificationType: 'INFO',
  priority: 0,
  startDate: '',
  endDate: '',
  isActive: false
})

const saveNotification = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await notificationService.update(route.params.id, form)
      showToast.success('Berhasil!', 'Notifikasi telah diupdate')
    } else {
      await notificationService.create(form)
      showToast.success('Berhasil!', 'Notifikasi baru telah dibuat')
    }
    router.push('/dashboard/notifications')
  } catch (e) {
    console.error(e)
    showToast.error('Gagal!', 'Tidak dapat menyimpan notifikasi')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await notificationService.getById(route.params.id)
      const notif = data.data
      Object.assign(form, {
        title: notif.title,
        message: notif.message,
        notificationType: notif.notificationType,
        priority: notif.priority,
        startDate: notif.startDate?.slice(0, 16),
        endDate: notif.endDate?.slice(0, 16),
        isActive: notif.isActive
      })
    } catch (err) {
      console.error('Error fetching notification:', err)
    }
  }
})
</script>
