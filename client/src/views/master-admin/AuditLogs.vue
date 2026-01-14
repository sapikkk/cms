<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-green-900 dark:text-white flex items-center gap-2">
          <PhScroll :size="28" weight="duotone" class="text-brand-orange" />
          Audit Logs
        </h1>
        <p class="text-green-600 dark:text-green-400 mt-1 text-sm">
          Jejak aktivitas dan keamanan sistem
        </p>
      </div>
      <button
        @click="exportLogs"
        :disabled="loading || logs.length === 0"
        class="px-4 py-2 bg-white text-green-700 border border-green-200 rounded-lg hover:bg-green-50 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PhDownloadSimple :size="18" weight="bold" />
        Export CSV
      </button>
    </div>

    <!-- Stats & Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Search -->
      <div class="md:col-span-2 bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-1">
        <div class="relative">
          <PhMagnifyingGlass :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Cari logs (Action, Entity)..."
            class="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm text-green-900 dark:text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

       <!-- Action Filter -->
      <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-1">
        <select 
          v-model="filters.action" 
          @change="fetchLogs(1)"
          class="w-full px-4 py-2.5 bg-transparent text-sm text-green-900 dark:text-white outline-none cursor-pointer"
        >
          <option value="">Semua Aksi</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOCK">LOCK</option>
        </select>
      </div>

      <!-- Entity Filter -->
      <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 p-1">
        <select 
          v-model="filters.entity" 
          @change="fetchLogs(1)"
          class="w-full px-4 py-2.5 bg-transparent text-sm text-green-900 dark:text-white outline-none cursor-pointer"
        >
          <option value="">Semua Entity</option>
          <option value="User">User</option>
          <option value="Product">Product</option>
          <option value="Page">Page</option>
          <option value="Book">Book</option>
          <option value="Event">Event</option>
          <option value="Notification">Notification</option>
        </select>
      </div>
    </div>

    <!-- Logs Table Container -->
    <div class="bg-white dark:bg-green-900/40 rounded-xl shadow-sm border border-green-100 dark:border-green-800 overflow-hidden min-h-[400px]">
      
      <!-- Loading -->
      <div v-if="loading" class="h-64 flex flex-col items-center justify-center">
        <div class="animate-spin w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full mb-4"></div>
        <p class="text-green-600 dark:text-green-400 text-sm">Memuat log aktivitas...</p>
      </div>

       <!-- Empty State -->
      <div v-else-if="logs.length === 0" class="h-64 flex flex-col items-center justify-center text-center p-6">
        <div class="w-12 h-12 bg-gray-100 dark:bg-green-800/30 rounded-full flex items-center justify-center text-gray-400 mb-3">
           <PhScroll :size="24" weight="duotone" />
        </div>
        <h3 class="text-green-900 dark:text-white font-medium">Tidak ada aktivitas</h3>
        <p class="text-sm text-green-500 dark:text-green-400/70 mt-1">Belum ada log yang tercatat sesuai filter.</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-green-50/50 dark:bg-green-800/20 border-b border-green-100 dark:border-green-800">
               <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider w-40">Waktu</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider w-48">User</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider w-32">Aksi</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider w-32">Entity</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider">Detail</th>
               <th class="px-6 py-4 text-right text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wider w-20"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-green-50 dark:divide-green-800/50">
            <tr 
              v-for="log in logs" 
              :key="log.id" 
              class="hover:bg-green-50/30 dark:hover:bg-green-800/30 transition-colors group cursor-default"
              @click="showDetails(log)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-xs text-green-600 dark:text-green-400/80 font-mono">
                {{ formatDate(log.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center text-[10px] font-bold text-brand-orange border border-brand-orange/20">
                    {{ log.user?.username?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <span class="text-sm font-medium text-green-900 dark:text-green-100">{{ log.user?.username || 'System' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border"
                  :class="getActionClass(log.action)"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-700 dark:text-green-300">
                {{ log.entity }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                 <span v-if="log.targetName" class="font-medium text-green-800 dark:text-green-200">{{ log.targetName }}<span v-if="log.details" class="font-normal text-gray-400 mx-1">-</span></span>
                 <span class="text-gray-400 text-xs">{{ getSummary(log.details) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  class="p-1.5 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Lihat Detail"
                >
                  <PhEye :size="18" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-6 py-4 border-t border-green-100 dark:border-green-800 flex items-center justify-between bg-green-50/30 dark:bg-green-800/10">
        <span class="text-xs text-green-600 dark:text-green-400">
           Halaman {{ pagination.page }} dari {{ pagination.totalPages }} (Total {{ pagination.total }})
        </span>
        <div class="flex gap-2">
           <button 
             @click="changePage(pagination.page - 1)"
             :disabled="pagination.page === 1"
             class="px-3 py-1 text-xs font-medium rounded-md border border-green-200 bg-white text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Prev
           </button>
           <button 
             @click="changePage(pagination.page + 1)"
             :disabled="pagination.page === pagination.totalPages"
             class="px-3 py-1 text-xs font-medium rounded-md border border-green-200 bg-white text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Next
           </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="dialog-fade">
      <div v-if="selectedLog" class="fixed inset-0 z-[60] flex items-center justify-center bg-green-950/20 backdrop-blur-[2px]" @click.self="selectedLog = null">
        <div class="bg-white dark:bg-green-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden border border-green-100 dark:border-green-700 flex flex-col max-h-[85vh]">
          <!-- Modal Header -->
          <div class="p-5 border-b border-green-50 dark:border-green-800 bg-green-50/30 dark:bg-green-800/20 flex items-center justify-between">
            <h3 class="text-lg font-bold text-green-900 dark:text-white flex items-center gap-2">
              Detail Log Aktivitas
            </h3>
            <button @click="selectedLog = null" class="text-gray-400 hover:text-green-600 transition-colors">
              <PhX :size="20" weight="bold" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto space-y-6">
            <!-- Metadata Grid -->
            <div class="grid grid-cols-2 gap-4 text-sm">
               <div class="bg-gray-50 dark:bg-green-800/20 p-3 rounded-lg">
                 <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Actor</div>
                 <div class="font-bold text-green-900 dark:text-white flex items-center gap-2">
                    <div class="w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center text-[10px]">
                       {{ selectedLog.user?.username?.[0]?.toUpperCase() }}
                    </div>
                    {{ selectedLog.user?.username || 'System' }}
                 </div>
                 <div class="text-xs text-gray-400 mt-1">{{ selectedLog.user?.email }}</div>
               </div>
               
               <div class="bg-gray-50 dark:bg-green-800/20 p-3 rounded-lg">
                 <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Action</div>
                 <div class="flex items-center gap-2">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                      :class="getActionClass(selectedLog.action)"
                    >
                      {{ selectedLog.action }}
                    </span>
                    <span class="font-medium text-green-800 dark:text-green-200">on {{ selectedLog.entity }}</span>
                 </div>
                 <div class="text-xs text-gray-400 mt-1">{{ formatDate(selectedLog.createdAt) }}</div>
               </div>
            </div>

            <!-- JSON Data -->
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Change Details</div>
              <div class="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700 shadow-inner">
                <pre class="text-xs font-mono text-green-400 leading-relaxed">{{ JSON.stringify(selectedLog.details, null, 2) || 'No additional details provided.' }}</pre>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-gray-50/50 dark:bg-green-950/30 flex justify-end">
            <button 
              @click="selectedLog = null" 
              class="px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { PhScroll, PhDownloadSimple, PhMagnifyingGlass, PhEye, PhX } from '@phosphor-icons/vue'
import activityLogService from '@/api/services/activityLog.service'
import { showToast } from '@/utils/toast'

// State
const logs = ref([])
const loading = ref(false)
const selectedLog = ref(null)
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  search: '',
  action: '',
  entity: ''
})

let searchTimeout = null

// UI Helpers
const formatDate = (date) => dayjs(date).format('DD MMM YYYY, HH:mm:ss')

const getActionClass = (action) => {
  const classes = {
    CREATE: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    UPDATE: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    DELETE: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    LOGIN: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    LOCK: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
  }
  return classes[action] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const getSummary = (details) => {
  if (!details) return ''
  // Try to extract meaningful summary
  const keys = Object.keys(details).filter(k => !['id', 'createdAt', 'updatedAt'].includes(k))
  if (keys.length === 0) return ''
  return keys.slice(0, 3).join(', ') + (keys.length > 3 ? '...' : '')
}

// API Actions
const fetchLogs = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      limit: pagination.limit,
      ...filters
    }
    // Remove empty filters
    Object.keys(params).forEach(key => !params[key] && delete params[key])

    const { data } = await activityLogService.getAll(params)
    logs.value = data.data
    
    if (data.pagination) {
       pagination.page = data.pagination.page
       pagination.total = data.pagination.total
       pagination.totalPages = data.pagination.totalPages
    }
  } catch (err) {
    console.error('Error fetching logs:', err)
    showToast.error('Gagal', 'Tidak dapat memuat log aktivitas')
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchLogs(1)
  }, 500)
}

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.totalPages) {
    fetchLogs(newPage)
  }
}

const showDetails = (log) => {
  selectedLog.value = log
}

const exportLogs = () => {
  const exportData = logs.value.map(log => ({
    Timestamp: formatDate(log.createdAt),
    Action: log.action,
    Entity: log.entity,
    Target: log.targetName || '-',
    User: `${log.user?.username} (${log.user?.email})`,
    Details: JSON.stringify(log.details)
  }))

  const workSheet = XLSX.utils.json_to_sheet(exportData)
  const workBook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workBook, workSheet, "AuditLogs")
  XLSX.writeFile(workBook, `ANTITESA_AuditLogs_${dayjs().format('YYYY-MM-DD')}.xlsx`)
}

onMounted(() => {
  fetchLogs()
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
