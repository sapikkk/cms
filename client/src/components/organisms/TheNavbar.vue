<template>
  <header class="navbar">
    <div class="navbar-left">
      <button class="menu-toggle" @click="toggleSidebar">
        <span class="hamburger-icon">☰</span>
      </button>
      
      <div class="breadcrumb">
        <span v-for="(crumb, index) in breadcrumbs" :key="index" class="crumb-item">
          <router-link v-if="crumb.path" :to="crumb.path">
            {{ crumb.label }}
          </router-link>
          <span v-else>{{ crumb.label }}</span>
          <span v-if="index < breadcrumbs.length - 1" class="crumb-separator">/</span>
        </span>
      </div>
    </div>

    <div class="navbar-right">
      <!-- Search -->
      <div class="navbar-search">
        <input 
          type="text" 
          placeholder="Search..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <span class="search-icon">🔍</span>
      </div>

      <!-- Notifications -->
      <div class="navbar-item notifications" @click="toggleNotifications">
        <span class="icon">🔔</span>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </div>

      <!-- User Menu -->
      <div class="navbar-item user-menu" @click="toggleUserMenu">
        <div class="user-avatar">
          <img v-if="user?.avatar" :src="user.avatar" :alt="user.fullName" />
          <span v-else class="avatar-placeholder">{{ userInitials }}</span>
        </div>
        <span class="user-name">{{ user?.fullName || user?.username }}</span>
        <span class="dropdown-arrow">▼</span>
      </div>

      <!-- User Dropdown -->
      <div v-if="showUserMenu" class="dropdown-menu user-dropdown">
        <router-link to="/profile" class="dropdown-item">
          <span class="item-icon">👤</span>
          Profile
        </router-link>
        <router-link to="/dashboard/settings" class="dropdown-item">
          <span class="item-icon">⚙️</span>
          Settings
        </router-link>
        <div class="dropdown-divider"></div>
        <button @click="handleLogout" class="dropdown-item logout">
          <span class="item-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div v-if="showUserMenu" class="dropdown-overlay" @click="showUserMenu = false"></div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'

export default {
  name: 'TheNavbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const uiStore = useUIStore()

    const searchQuery = ref('')
    const showUserMenu = ref(false)
    const unreadCount = ref(0) // TODO: Connect to notifications store

    const user = computed(() => authStore.user)
    const breadcrumbs = computed(() => uiStore.breadcrumbs)

    const userInitials = computed(() => {
      if (user.value?.fullName) {
        return user.value.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      }
      return user.value?.username?.substring(0, 2).toUpperCase() || 'U'
    })

    const toggleSidebar = () => {
      uiStore.toggleSidebar()
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const toggleNotifications = () => {
      // TODO: Implement notifications panel
      console.log('Toggle notifications')
    }

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/search', query: { q: searchQuery.value } })
      }
    }

    const handleLogout = async () => {
      showUserMenu.value = false
      await authStore.logout()
      router.push('/auth/login')
    }

    return {
      searchQuery,
      showUserMenu,
      unreadCount,
      user,
      breadcrumbs,
      userInitials,
      toggleSidebar,
      toggleUserMenu,
      toggleNotifications,
      handleSearch,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  font-size: 24px;
  color: #6b7280;
  transition: color 0.2s;
}

.menu-toggle:hover {
  color: #111827;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.crumb-item a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.crumb-item a:hover {
  color: #8B4513;
}

.crumb-item span {
  color: #111827;
  font-weight: 500;
}

.crumb-separator {
  color: #d1d5db;
  margin: 0 4px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.navbar-search {
  position: relative;
}

.navbar-search input {
  padding: 8px 36px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  width: 240px;
  transition: all 0.2s;
}

.navbar-search input:focus {
  outline: none;
  border-color: #8B4513;
  width: 280px;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 16px;
}

.navbar-item {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.navbar-item:hover {
  background: #f3f4f6;
}

.notifications .icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #dc2626;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #8B4513;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.dropdown-arrow {
  font-size: 10px;
  color: #6b7280;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 8px 0;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

.dropdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 99;
}

@media (max-width: 768px) {
  .breadcrumb {
    display: none;
  }
  
  .navbar-search input {
    width: 180px;
  }
  
  .user-name {
    display: none;
  }
}
</style>
