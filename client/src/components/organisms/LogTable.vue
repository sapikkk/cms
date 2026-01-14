<template>
  <div class="log-table-wrapper">
    <DataTable
      :columns="columns"
      :data="logs"
      :loading="loading"
      :paginated="true"
      :items-per-page="20"
      title="Activity Logs"
      empty-message="No activity logs found"
      hide-edit
      hide-delete
    >
      <!-- Custom cell for action -->
      <template #cell-action="{ value }">
        <span :class="['action-badge', `action-${value.toLowerCase()}`]">
          {{ value }}
        </span>
      </template>

      <!-- Custom cell for user -->
      <template #cell-user="{ row }">
        <div class="user-cell">
          <span class="user-name">{{ row.user?.fullName || row.user?.username }}</span>
          <span class="user-role">{{ row.user?.role }}</span>
        </div>
      </template>

      <!-- Custom cell for timestamp -->
      <template #cell-createdAt="{ value }">
        {{ formatDateTime(value) }}
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <button @click="$emit('view-details', row)" class="action-btn">
          👁️ View
        </button>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/organisms/DataTable.vue'
import { formatDateTime } from '@/utils/date-format'

export default {
  name: 'LogTable',
  components: { DataTable },
  props: {
    logs: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-details'],
  setup() {
    const columns = [
      { key: 'action', label: 'Action', sortable: true },
      { key: 'entity', label: 'Entity', sortable: true },
      { key: 'user', label: 'User', sortable: false },
      { key: 'targetName', label: 'Target', sortable: false },
      { key: 'createdAt', label: 'Time', sortable: true, format: 'date' }
    ]

    return {
      columns,
      formatDateTime
    }
  }
}
</script>

<style scoped>
.log-table-wrapper {
  width: 100%;
}

.action-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.action-create {
  background: #d1fae5;
  color: #065f46;
}

.action-update {
  background: #dbeafe;
  color: #1e40af;
}

.action-delete {
  background: #fee2e2;
  color: #991b1b;
}

.action-login {
  background: #f3e8ff;
  color: #6b21a8;
}

.action-export {
  background: #fef3c7;
  color: #92400e;
}

.action-lock,
.action-unlock {
  background: #e5e7eb;
  color: #374151;
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 500;
  color: #111827;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}
</style>
