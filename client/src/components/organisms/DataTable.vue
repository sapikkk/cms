<template>
  <div class="data-table-wrapper">
    <!-- Table Header Actions -->
    <div v-if="showHeader" class="table-header">
      <div class="header-left">
        <slot name="header-left">
          <h3 v-if="title" class="table-title">{{ title }}</h3>
        </slot>
      </div>
      <div class="header-right">
        <slot name="header-right"></slot>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="selectable" class="col-checkbox">
              <input 
                type="checkbox" 
                :checked="allSelected"
                @change="toggleSelectAll"
              />
            </th>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :class="['col-' + column.key, { 'sortable': column.sortable }]"
              @click="column.sortable && handleSort(column.key)"
            >
              {{ column.label }}
              <span v-if="column.sortable" class="sort-indicator">
                <span v-if="sortKey === column.key">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
                <span v-else class="sort-default">↕</span>
              </span>
            </th>
            <th v-if="hasActions" class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="totalColumns" class="loading-row">
              <AppLoader size="md" text="Loading data..." />
            </td>
          </tr>
          <tr v-else-if="!data || data.length === 0">
            <td :colspan="totalColumns" class="empty-row">
              <div class="empty-state">
                <p>{{ emptyMessage }}</p>
              </div>
            </td>
          </tr>
          <tr 
            v-else
            v-for="(row, index) in sortedData" 
            :key="getRowKey(row, index)"
            :class="{ 'selected': isRowSelected(row) }"
          >
            <td v-if="selectable" class="col-checkbox">
              <input 
                type="checkbox" 
                :checked="isRowSelected(row)"
                @change="toggleRowSelection(row)"
              />
            </td>
            <td v-for="column in columns" :key="column.key" :class="'col-' + column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCellValue(row[column.key], column) }}
              </slot>
            </td>
            <td v-if="hasActions" class="col-actions">
              <slot name="actions" :row="row">
                <div class="action-buttons">
                  <button 
                    v-if="!hideEdit"
                    @click="$emit('edit', row)" 
                    class="action-btn edit"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    v-if="!hideDelete"
                    @click="$emit('delete', row)" 
                    class="action-btn delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && !loading && data.length > 0" class="table-footer">
      <div class="footer-info">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
      </div>
      <div class="pagination">
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-btn', { 'active': page === currentPage }]"
        >
          {{ page }}
        </button>
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import AppLoader from '@/components/atoms/AppLoader.vue'

export default {
  name: 'DataTable',
  components: { AppLoader },
  props: {
    title: String,
    columns: {
      type: Array,
      required: true
      // Example: [{ key: 'name', label: 'Name', sortable: true, format: 'text' }]
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    paginated: {
      type: Boolean,
      default: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    emptyMessage: {
      type: String,
      default: 'No data available'
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    hideEdit: Boolean,
    hideDelete: Boolean,
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  emits: ['edit', 'delete', 'selection-change'],
  setup(props, { emit }) {
    const currentPage = ref(1)
    const sortKey = ref('')
    const sortOrder = ref('asc')
    const selectedRows = ref([])

    const totalColumns = computed(() => {
      let count = props.columns.length
      if (props.selectable) count++
      if (hasActions.value) count++
      return count
    })

    const hasActions = computed(() => {
      return !props.hideEdit || !props.hideDelete
    })

    const sortedData = computed(() => {
      let data = [...props.data]
      
      if (sortKey.value) {
        data.sort((a, b) => {
          const aVal = a[sortKey.value]
          const bVal = b[sortKey.value]
          
          if (aVal === bVal) return 0
          
          const comparison = aVal > bVal ? 1 : -1
          return sortOrder.value === 'asc' ? comparison : -comparison
        })
      }

      if (props.paginated) {
        const start = (currentPage.value - 1) * props.itemsPerPage
        const end = start + props.itemsPerPage
        return data.slice(start, end)
      }

      return data
    })

    const totalItems = computed(() => props.data.length)
    const totalPages = computed(() => Math.ceil(totalItems.value / props.itemsPerPage))
    const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage)
    const endIndex = computed(() => Math.min(startIndex.value + props.itemsPerPage, totalItems.value))

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const allSelected = computed(() => {
      return props.data.length > 0 && selectedRows.value.length === props.data.length
    })

    const handleSort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const getRowKey = (row, index) => {
      return row[props.rowKey] || index
    }

    const isRowSelected = (row) => {
      return selectedRows.value.some(r => getRowKey(r, 0) === getRowKey(row, 0))
    }

    const toggleRowSelection = (row) => {
      const index = selectedRows.value.findIndex(r => getRowKey(r, 0) === getRowKey(row, 0))
      if (index > -1) {
        selectedRows.value.splice(index, 1)
      } else {
        selectedRows.value.push(row)
      }
      emit('selection-change', selectedRows.value)
    }

    const toggleSelectAll = () => {
      if (allSelected.value) {
        selectedRows.value = []
      } else {
        selectedRows.value = [...props.data]
      }
      emit('selection-change', selectedRows.value)
    }

    const formatCellValue = (value, column) => {
      if (value === null || value === undefined) return '-'
      
      if (column.format === 'date') {
        return new Date(value).toLocaleDateString('id-ID')
      }
      if (column.format === 'currency') {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
      }
      
      return value
    }

    return {
      currentPage,
      sortKey,
      sortOrder,
      selectedRows,
      totalColumns,
      hasActions,
      sortedData,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      allSelected,
      handleSort,
      goToPage,
      getRowKey,
      isRowSelected,
      toggleRowSelection,
      toggleSelectAll,
      formatCellValue
    }
  }
}
</script>

<style scoped>
.data-table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.table-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.data-table th.sortable:hover {
  background: #f3f4f6;
}

.sort-indicator {
  margin-left: 4px;
  font-size: 12px;
}

.sort-default {
  opacity: 0.3;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.data-table tr:hover {
  background: #fafafa;
}

.data-table tr.selected {
  background: #fef3c7;
}

.col-checkbox {
  width: 40px;
  text-align: center;
}

.col-actions {
  width: 120px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 16px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.loading-row,
.empty-row {
  text-align: center;
  padding: 40px 20px;
}

.empty-state {
  color: #9ca3af;
  font-size: 14px;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
}

.footer-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination {
  display: flex;
  gap: 4px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #8B4513;
}

.pagination-btn.active {
  background: #8B4513;
  color: white;
  border-color: #8B4513;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
