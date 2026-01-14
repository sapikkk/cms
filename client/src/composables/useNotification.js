/**
 * Notification Composable
 * Toast/Snackbar notifications system
 */

import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
    const show = ({ type = 'info', title, message, duration = 5000 }) => {
        const id = ++notificationId

        const notification = {
            id,
            type, // 'success', 'error', 'warning', 'info'
            title,
            message,
            duration,
            visible: true
        }

        notifications.value.push(notification)

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }

        return id
    }

    const remove = (id) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    const success = (message, title = 'Success') => {
        return show({ type: 'success', title, message })
    }

    const error = (message, title = 'Error') => {
        return show({ type: 'error', title, message, duration: 7000 })
    }

    const warning = (message, title = 'Warning') => {
        return show({ type: 'warning', title, message })
    }

    const info = (message, title = 'Info') => {
        return show({ type: 'info', title, message })
    }

    const clear = () => {
        notifications.value = []
    }

    return {
        // State
        notifications,

        // Methods
        show,
        remove,
        success,
        error,
        warning,
        info,
        clear
    }
}
