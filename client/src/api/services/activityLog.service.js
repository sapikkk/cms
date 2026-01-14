import api from '@/api/core/axiosClient'

const RESOURCE = '/activity-logs'

export default {
    getAll(params) {
        return api.get(RESOURCE, { params })
    },

    getStats() {
        return api.get(`${RESOURCE}/stats`)
    },

    getById(id) {
        return api.get(`${RESOURCE}/${id}`)
    },

    getByUserId(userId, params) {
        return api.get(`${RESOURCE}/user/${userId}`, { params })
    }
}
