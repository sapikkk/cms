import api from '../core/axiosClient';

const API_URL = '/forum';

/**
 * Forum Service
 * Public API for forum topics (FunFacts) and comments
 */

const forumService = {
    // ==================== FORUM TOPICS ====================

    /**
     * Get all forum topics
     */
    getAllTopics: (params = {}) => {
        return api.get(API_URL, { params });
    },

    /**
     * Get single topic with comments
     */
    getTopicById: (id) => {
        return api.get(`${API_URL}/${id}`);
    },

    /**
     * Like a topic
     */
    likeTopic: (id) => {
        return api.post(`${API_URL}/${id}/like`);
    },

    // ==================== COMMENTS (PUBLIC) ====================

    /**
     * Get comments for a topic
     */
    getComments: (topicId, params = {}) => {
        return api.get(`${API_URL}/${topicId}/comments`, { params });
    },

    /**
     * Add comment (PUBLIC - no auth required)
     */
    addComment: (topicId, data) => {
        return api.post(`${API_URL}/${topicId}/comments`, data);
    },

    // ==================== ADMIN ONLY ====================

    /**
     * Create forum topic (Admin)
     */
    createTopic: (data) => {
        return api.post(API_URL, data);
    },

    /**
     * Update forum topic (Admin)
     */
    updateTopic: (id, data) => {
        return api.put(`${API_URL}/${id}`, data);
    },

    /**
     * Delete forum topic (Admin)
     */
    deleteTopic: (id) => {
        return api.delete(`${API_URL}/${id}`);
    },

    /**
     * Moderate comment (Admin)
     */
    moderateComment: (commentId, data) => {
        return api.patch(`${API_URL}/comments/${commentId}/moderate`, data);
    },

    /**
     * Delete comment (Admin)
     */
    deleteComment: (commentId) => {
        return api.delete(`${API_URL}/comments/${commentId}`);
    }
};

export default forumService;
