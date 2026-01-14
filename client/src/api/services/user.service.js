import api from '@/api/core/axiosClient'

const RESOURCE = '/users'

export default {
    getAll(params) {
        return api.get(RESOURCE, { params })
    },

    create(data) {
        return api.post(RESOURCE, data)
    },

    getById(id) {
        return api.get(`${RESOURCE}/${id}`)
    },

    updateRole(id, role) {
        return api.patch(`${RESOURCE}/${id}/role`, { role })
    },

    lock(id) {
        return api.post(`${RESOURCE}/${id}/lock`)
    },

    unlock(id) {
        return api.post(`${RESOURCE}/${id}/unlock`)
    },

    delete(id) {
        return api.delete(`${RESOURCE}/${id}`)
    }
}
