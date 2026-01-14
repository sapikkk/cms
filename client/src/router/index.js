/**
 * Vue Router Configuration
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Import guards
import { authGuard } from './guards/auth.guard'
import { roleGuard } from './guards/role.guard'

const routes = [
  // ==========================================
  // PUBLIC ROUTES
  // ==========================================
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false
    }
  },
  {
    path: '/access-locked',
    name: 'AccessLocked',
    component: () => import('@/views/auth/AccessLocked.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false
    }
  },

  // ==========================================
  // DASHBOARD ROUTES (Protected)
  // ==========================================
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      layout: 'storefront', // or 'default' if you have one, assuming storefront is public
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/Overview.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // PRODUCT MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/products',
    name: 'ProductList',
    component: () => import('@/views/dashboard/products/ProductList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/products/create',
    name: 'ProductCreate',
    component: () => import('@/views/dashboard/products/ProductForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/products/:id/edit',
    name: 'ProductEdit',
    component: () => import('@/views/dashboard/products/ProductForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/products/calculator',
    name: 'ProductCalculator',
    component: () => import('@/views/dashboard/products/ProductCalculator.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // LIBRARY MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/library',
    name: 'BookList',
    component: () => import('@/views/dashboard/library/BookList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/library/create',
    name: 'BookCreate',
    component: () => import('@/views/dashboard/library/BookForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/library/:id/edit',
    name: 'BookEdit',
    component: () => import('@/views/dashboard/library/BookForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // PAGE BUILDER
  // ==========================================
  {
    path: '/dashboard/pages',
    name: 'PageList',
    component: () => import('@/views/dashboard/pages/PageList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/pages/:id',
    name: 'PageViewer',
    component: () => import('@/views/dashboard/pages/PageViewer.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/pages/:id/builder',
    name: 'PageBuilder',
    component: () => import('@/views/dashboard/pages/PageBuilder.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // EVENT MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/events',
    name: 'EventList',
    component: () => import('@/views/dashboard/events/EventList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/events/create',
    name: 'EventCreate',
    component: () => import('@/views/dashboard/events/EventForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/events/:id/edit',
    name: 'EventEdit',
    component: () => import('@/views/dashboard/events/EventForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // MERCHANDISE MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/merchandise',
    name: 'MerchandiseList',
    component: () => import('@/views/dashboard/merchandise/MerchandiseList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/merchandise/create',
    name: 'MerchandiseCreate',
    component: () => import('@/views/dashboard/merchandise/MerchandiseForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/merchandise/:id/edit',
    name: 'MerchandiseEdit',
    component: () => import('@/views/dashboard/merchandise/MerchandiseForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // FUN FACTS MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/funfacts',
    name: 'FunFactList',
    component: () => import('@/views/dashboard/funfacts/FunFactList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/funfacts/create',
    name: 'FunFactCreate',
    component: () => import('@/views/dashboard/funfacts/FunFactForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/funfacts/:id/edit',
    name: 'FunFactEdit',
    component: () => import('@/views/dashboard/funfacts/FunFactForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // NOTIFICATION MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/notifications',
    name: 'NotificationList',
    component: () => import('@/views/dashboard/notifications/NotificationList.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/notifications/create',
    name: 'NotificationCreate',
    component: () => import('@/views/dashboard/notifications/NotificationForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },
  {
    path: '/dashboard/notifications/:id/edit',
    name: 'NotificationEdit',
    component: () => import('@/views/dashboard/notifications/NotificationForm.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  {
    path: '/dashboard/reports',
    name: 'FinancialReport',
    component: () => import('@/views/dashboard/reports/FinancialReport.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER']
    }
  },

  // ==========================================
  // SETTINGS
  // ==========================================
  {
    path: '/dashboard/settings/theme',
    name: 'ThemeCustomizer',
    component: () => import('@/views/dashboard/settings/ThemeCustomizer.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // CONTENT MANAGEMENT
  // ==========================================
  {
    path: '/dashboard/content',
    name: 'ContentManager',
    component: () => import('@/views/dashboard/content/ContentManager.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN', 'ADMIN_OWNER', 'MEDIA_STAFF']
    }
  },

  // ==========================================
  // MASTER ADMIN ONLY
  // ==========================================
  {
    path: '/dashboard/audit-logs',
    name: 'AuditLogs',
    component: () => import('@/views/master-admin/AuditLogs.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN']
    }
  },
  {
    path: '/dashboard/system-access',
    name: 'SystemAccess',
    component: () => import('@/views/master-admin/SystemAccess.vue'),
    meta: {
      layout: 'dashboard',
      requiresAuth: true,
      roles: ['MASTER_ADMIN']
    }
  },

  // ==========================================
  // STOREFRONT (Public Pages)
  // ==========================================
  {
    path: '/:slug',
    name: 'DynamicPage',
    component: () => import('@/views/storefront/DynamicEntry.vue'),
    meta: {
      layout: 'storefront',
      requiresAuth: false
    }
  },

  // ==========================================
  // 404 NOT FOUND
  // ==========================================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      layout: 'auth',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Check authentication (only for routes that explicitly require auth)
  if (to.meta.requiresAuth === true) {
    const authResult = authGuard(to, from)
    if (authResult !== true) {
      return next(authResult)
    }
  }

  // Check role permissions
  if (to.meta.roles && to.meta.roles.length > 0) {
    const roleResult = roleGuard(to, from)
    if (roleResult !== true) {
      return next(roleResult)
    }
  }

  // Redirect authenticated users away from login
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
