/**
 * Menu Configuration
 * Sidebar menu structure per role
 */

export const MENU_CONFIG = {
    // Master Admin Menu (Level 0)
    MASTER_ADMIN: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'house',
            route: '/dashboard',
            children: []
        },
        {
            id: 'audit',
            label: 'Audit Logs',
            icon: 'shield-check',
            route: '/master-admin/audit-logs',
            children: []
        },
        {
            id: 'system-access',
            label: 'System Access',
            icon: 'lock-key',
            route: '/master-admin/system-access',
            children: []
        },
        {
            id: 'products',
            label: 'Products',
            icon: 'coffee',
            route: '/dashboard/products',
            children: []
        },
        {
            id: 'library',
            label: 'Book Library',
            icon: 'books',
            route: '/dashboard/library',
            children: []
        },
        {
            id: 'pages',
            label: 'Pages',
            icon: 'file-text',
            route: '/dashboard/pages',
            children: []
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: 'chart-line',
            route: '/dashboard/reports',
            children: []
        },
        {
            id: 'content',
            label: 'Content Manager',
            icon: 'layout',
            route: '/dashboard/content',
            children: []
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'gear',
            route: '/dashboard/settings',
            children: []
        }
    ],

    // Admin Owner Menu (Level 1)
    ADMIN_OWNER: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'house',
            route: '/dashboard',
            children: []
        },
        {
            id: 'products',
            label: 'Products',
            icon: 'coffee',
            route: '/dashboard/products',
            children: [
                {
                    id: 'products-list',
                    label: 'Product List',
                    route: '/dashboard/products'
                },
                {
                    id: 'products-categories',
                    label: 'Categories',
                    route: '/dashboard/products/categories'
                }
            ]
        },
        {
            id: 'library',
            label: 'Book Library',
            icon: 'books',
            route: '/dashboard/library',
            children: []
        },
        {
            id: 'pages',
            label: 'Pages',
            icon: 'file-text',
            route: '/dashboard/pages',
            children: []
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: 'chart-line',
            route: '/dashboard/reports',
            children: []
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'gear',
            route: '/dashboard/settings',
            children: [
                {
                    id: 'settings-theme',
                    label: 'Theme',
                    route: '/dashboard/settings/theme'
                }
            ]
        },
        {
            id: 'content',
            label: 'Content Manager',
            icon: 'layout',
            route: '/dashboard/content',
            children: []
        }
    ],

    // Media Staff Menu (Level 2)
    MEDIA_STAFF: [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: 'house',
            route: '/dashboard',
            children: []
        },
        {
            id: 'products',
            label: 'Products',
            icon: 'coffee',
            route: '/dashboard/products',
            children: []
        },
        {
            id: 'library',
            label: 'Book Library',
            icon: 'books',
            route: '/dashboard/library',
            children: []
        },
        {
            id: 'pages',
            label: 'Pages',
            icon: 'file-text',
            route: '/dashboard/pages',
            children: []
        },
        {
            id: 'content',
            label: 'Content Manager',
            icon: 'layout',
            route: '/dashboard/content',
            children: []
        }
    ],

    // Public User Menu (Level 3)
    USER_PUBLIC: [
        {
            id: 'home',
            label: 'Home',
            icon: 'house',
            route: '/',
            children: []
        },
        {
            id: 'products',
            label: 'Products',
            icon: 'coffee',
            route: '/products',
            children: []
        },
        {
            id: 'library',
            label: 'Library',
            icon: 'books',
            route: '/library',
            children: []
        }
    ]
}

/**
 * Get menu items for a specific role
 */
export function getMenuForRole(role) {
    return MENU_CONFIG[role] || MENU_CONFIG.USER_PUBLIC
}

/**
 * Check if menu item is active
 */
export function isMenuItemActive(item, currentPath) {
    if (item.route === currentPath) {
        return true
    }

    if (item.children && item.children.length > 0) {
        return item.children.some(child => child.route === currentPath)
    }

    return false
}

export default MENU_CONFIG
