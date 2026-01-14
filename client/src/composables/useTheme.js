/**
 * Theme Composable
 * Dynamic CSS injection for theme customization
 */

export function useTheme() {
    const setTheme = (colorConfig) => {
        const root = document.documentElement

        // Update CSS Variables
        if (colorConfig.primary) {
            root.style.setProperty('--color-primary', colorConfig.primary)
        }
        if (colorConfig.secondary) {
            root.style.setProperty('--color-secondary', colorConfig.secondary)
        }
        if (colorConfig.background) {
            root.style.setProperty('--color-bg', colorConfig.background)
        }
        if (colorConfig.surface) {
            root.style.setProperty('--color-surface', colorConfig.surface)
        }

        // Persist to localStorage
        localStorage.setItem('theme_config', JSON.stringify(colorConfig))
    }

    const loadTheme = () => {
        const saved = localStorage.getItem('theme_config')
        if (saved) {
            try {
                setTheme(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load theme:', e)
            }
        }
    }

    const getTheme = () => {
        const saved = localStorage.getItem('theme_config')
        if (saved) {
            try {
                return JSON.parse(saved)
            } catch (e) {
                return null
            }
        }
        return null
    }

    const resetTheme = () => {
        const defaultTheme = {
            primary: '#8B4513',
            secondary: '#F4A460',
            background: '#F9FAFB',
            surface: '#FFFFFF'
        }
        setTheme(defaultTheme)
        return defaultTheme
    }

    return {
        setTheme,
        loadTheme,
        getTheme,
        resetTheme
    }
}
