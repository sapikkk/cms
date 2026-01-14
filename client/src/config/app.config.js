/**
 * Application Configuration
 * Global constants and settings
 */

export const APP_CONFIG = {
    // Application Info
    name: 'CoffeeShop CMS',
    version: '2.1.0',
    description: 'Enterprise Coffee Shop Content Management System',

    // API Configuration
    api: {
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
        timeout: 30000, // 30 seconds
        version: 'v1'
    },

    // Authentication
    auth: {
        tokenKey: 'auth_token',
        userKey: 'auth_user',
        tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
        refreshThreshold: 5 * 60 * 1000 // Refresh 5 mins before expiry
    },

    // Pagination
    pagination: {
        defaultPage: 1,
        defaultLimit: 10,
        maxLimit: 100,
        pageSizeOptions: [10, 25, 50, 100]
    },

    // File Upload
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        allowedDocTypes: ['application/pdf'],
        imageFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        documentFormats: ['.pdf']
    },

    // Date/Time
    dateTime: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        dateTimeFormat: 'DD/MM/YYYY HH:mm',
        timezone: 'Asia/Jakarta'
    },

    // Locale
    locale: {
        language: 'id',
        currency: 'IDR',
        currencySymbol: 'Rp',
        thousandSeparator: '.',
        decimalSeparator: ','
    },

    // Theme
    theme: {
        defaultMode: 'light',
        storageKey: 'theme_mode'
    },

    // Features
    features: {
        enableCart: true,
        enableBookLibrary: true,
        enableAuditLogs: true,
        enableNotifications: true,
        enableExport: true
    },

    // SEO
    seo: {
        defaultTitle: 'CoffeeShop CMS',
        titleSeparator: ' - ',
        defaultDescription: 'Best coffee in town',
        defaultKeywords: 'coffee, cafe, espresso',
        siteName: 'CoffeeShop CMS'
    }
}

export default APP_CONFIG
