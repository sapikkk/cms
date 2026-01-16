import api from '../core/axiosClient';

const API_URL = '/blog';

export default {
    // Public
    getAll(params) {
        return api.get(API_URL, { params });
    },

    getBySlug(slug) {
        return api.get(`${API_URL}/${slug}`);
    },

    likePost(id) {
        return api.post(`${API_URL}/${id}/like`);
    },

    // Admin
    create(data) {
        return api.post(API_URL, data);
    },

    update(id, data) {
        return api.put(`${API_URL}/${id}`, data);
    },

    delete(id) {
        return api.delete(`${API_URL}/${id}`);
    }
};
