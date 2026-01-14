/**
 * UI Store
 * Manages UI state (sidebar, modals, loading)
 */

import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
    state: () => ({
        sidebarOpen: true,
        sidebarCollapsed: false,

        // Modal states
        modals: {
            confirm: { open: false, data: null },
            imagePreview: { open: false, src: null }
        },

        // Loading states
        globalLoading: false,
        loadingMessage: '',

        // Page title
        pageTitle: 'Dashboard',

        // Breadcrumbs
        breadcrumbs: []
    }),

    getters: {
        isSidebarOpen: (state) => state.sidebarOpen,
        isSidebarCollapsed: (state) => state.sidebarCollapsed,
        isLoading: (state) => state.globalLoading
    },

    actions: {
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen
        },

        setSidebarOpen(open) {
            this.sidebarOpen = open
        },

        toggleSidebarCollapse() {
            this.sidebarCollapsed = !this.sidebarCollapsed
        },

        setSidebarCollapsed(collapsed) {
            this.sidebarCollapsed = collapsed
        },

        openModal(modalName, data = null) {
            if (this.modals[modalName]) {
                this.modals[modalName].open = true
                this.modals[modalName].data = data
            }
        },

        closeModal(modalName) {
            if (this.modals[modalName]) {
                this.modals[modalName].open = false
                this.modals[modalName].data = null
            }
        },

        setLoading(loading, message = '') {
            this.globalLoading = loading
            this.loadingMessage = message
        },

        setPageTitle(title) {
            this.pageTitle = title
            // Update document title
            document.title = title ? `${title} - CoffeeShop CMS` : 'CoffeeShop CMS'
        },

        setBreadcrumbs(crumbs) {
            this.breadcrumbs = crumbs
        }
    }
})
