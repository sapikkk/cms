import { ref } from 'vue'

const isOpen = ref(false)
const dialogConfig = ref({
    title: 'Konfirmasi',
    message: 'Apakah Anda yakin?',
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'warning'
})

let resolvePromise = null
let rejectPromise = null

export function useConfirm() {
    const confirm = (config = {}) => {
        dialogConfig.value = {
            title: config.title || 'Konfirmasi',
            message: config.message || 'Apakah Anda yakin?',
            confirmText: config.confirmText || 'Ya, Lanjutkan',
            cancelText: config.cancelText || 'Batal',
            variant: config.variant || 'warning'
        }

        isOpen.value = true

        return new Promise((resolve, reject) => {
            resolvePromise = resolve
            rejectPromise = reject
        })
    }

    const handleConfirm = () => {
        isOpen.value = false
        if (resolvePromise) {
            resolvePromise(true)
            resolvePromise = null
            rejectPromise = null
        }
    }

    const handleCancel = () => {
        isOpen.value = false
        if (resolvePromise) {
            resolvePromise(false)
            resolvePromise = null
            rejectPromise = null
        }
    }

    return {
        isOpen,
        dialogConfig,
        confirm,
        handleConfirm,
        handleCancel
    }
}
