import { toast } from 'vue-sonner'

/**
 * Toast notification helpers
 */
export const showToast = {
    success: (message, description) => {
        toast.success(message, {
            description,
            duration: 3000,
        })
    },

    error: (message, description) => {
        toast.error(message, {
            description,
            duration: 4000,
        })
    },

    info: (message, description) => {
        toast.info(message, {
            description,
            duration: 3000,
        })
    },

    warning: (message, description) => {
        toast.warning(message, {
            description,
            duration: 3500,
        })
    },

    loading: (message) => {
        return toast.loading(message)
    },

    promise: (promise, messages) => {
        return toast.promise(promise, {
            loading: messages.loading || 'Loading...',
            success: messages.success || 'Success!',
            error: messages.error || 'Error occurred',
        })
    }
}
