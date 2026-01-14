/**
 * Vue Application Entry Point
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Styles
import './assets/styles/main.css'

// Theme
import { useTheme } from './composables/useTheme'

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Load saved theme
const { loadTheme } = useTheme()

// Mount app
app.mount('#app')

// Load theme after mount
loadTheme()
