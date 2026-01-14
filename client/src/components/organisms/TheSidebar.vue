<template>
  <aside 
    class="sidebar" 
    :class="{ 'is-collapsed': collapsed, 'is-hidden': !isOpen }"
  >
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <h1 v-if="!collapsed">CoffeeShop CMS</h1>
        <h1 v-else>CS</h1>
      </div>
      <button 
        class="sidebar-toggle" 
        @click="toggleCollapse"
        :title="collapsed ? 'Expand' : 'Collapse'"
      >
        <span class="toggle-icon">{{ collapsed ? '→' : '←' }}</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li 
          v-for="item in menuItems" 
          :key="item.id"
          class="nav-item"
          :class="{ 'is-active': isActive(item.route) }"
        >
          <router-link 
            :to="item.route" 
            class="nav-link"
            :title="collapsed ? item.label : ''"
          >
            <span class="nav-icon">
              <PhosphorIcon :name="item.icon" :size="20" />
            </span>
            <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          </router-link>

          <!-- Submenu if has children -->
          <ul v-if="item.children && item.children.length > 0 && !collapsed" class="nav-submenu">
            <li 
              v-for="child in item.children" 
              :key="child.id"
              class="submenu-item"
              :class="{ 'is-active': isActive(child.route) }"
            >
              <router-link :to="child.route" class="submenu-link">
                {{ child.label }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!collapsed">
        <div class="user-avatar">
          <img v-if="user?.avatar" :src="user.avatar" :alt="user.fullName" />
          <span v-else class="avatar-placeholder">{{ userInitials }}</span>
        </div>
        <div class="user-details">
          <p class="user-name">{{ user?.fullName || user?.username }}</p>
          <p class="user-role">{{ user?.role }}</p>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout" :title="collapsed ? 'Logout' : ''">
        <PhosphorIcon name="sign-out" :size="20" />
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useUIStore } from '@/stores/ui.store'
import { getMenuForRole } from '@/config/menu.config'
import { PhHouse, PhShieldCheck, PhLockKey, PhCoffee, PhBooks, PhFileText, PhChartLine, PhGear, PhSignOut } from '@phosphor-icons/vue'

// Simple wrapper for Phosphor icons
const PhosphorIcon = {
  name: 'PhosphorIcon',
  components: { PhHouse, PhShieldCheck, PhLockKey, PhCoffee, PhBooks, PhFileText, PhChartLine, PhGear, PhSignOut },
  props: ['name', 'size'],
  template: `
    <component :is="iconComponent" :size="size" />
  `,
  computed: {
    iconComponent() {
      const iconMap = {
        'house': 'PhHouse',
        'shield-check': 'PhShieldCheck',
        'lock-key': 'PhLockKey',
        'coffee': 'PhCoffee',
        'books': 'PhBooks',
        'file-text': 'PhFileText',
        'chart-line': 'PhChartLine',
        'gear': 'PhGear',
        'sign-out': 'PhSignOut'
      }
      return iconMap[this.name] || 'PhHouse'
    }
  }
}

export default {
  name: 'TheSidebar',
  components: { PhosphorIcon },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const uiStore = useUIStore()

    const user = computed(() => authStore.user)
    const isOpen = computed(() => uiStore.sidebarOpen)
    const collapsed = computed(() => uiStore.sidebarCollapsed)

    const menuItems = computed(() => {
      return getMenuForRole(user.value?.role || 'USER_PUBLIC')
    })

    const userInitials = computed(() => {
      if (user.value?.fullName) {
        return user.value.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      }
      return user.value?.username?.substring(0, 2).toUpperCase() || 'U'
    })

    const isActive = (path) => {
      return route.path === path || route.path.startsWith(path + '/')
    }

    const toggleCollapse = () => {
      uiStore.toggleSidebarCollapse()
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/auth/login')
    }

    return {
      user,
      isOpen,
      collapsed,
      menuItems,
      userInitials,
      isActive,
      toggleCollapse,
      handleLogout
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: linear-gradient(180deg, #2C1810 0%, #1A0F0A 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar.is-collapsed {
  width: 70px;
}

.sidebar.is-hidden {
  transform: translateX(-100%);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-logo h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #F4A460;
}

.sidebar-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.is-active > .nav-link {
  background: rgba(244, 164, 96, 0.2);
  color: #F4A460;
  border-left-color: #F4A460;
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

.nav-submenu {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
}

.submenu-link {
  display: block;
  padding: 8px 20px 8px 52px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s;
}

.submenu-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.submenu-item.is-active .submenu-link {
  color: #F4A460;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #F4A460;
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
  color: #2C1810;
  font-weight: 700;
  font-size: 16px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #FCA5A5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.3);
  border-color: rgba(220, 38, 38, 0.5);
}

.is-collapsed .user-info,
.is-collapsed .logout-btn span {
  display: none;
}

.is-collapsed .logout-btn {
  padding: 10px;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
