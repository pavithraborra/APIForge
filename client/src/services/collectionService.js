import api from './api';

const collectionService = {
  getCollections: async (workspaceId) => {
    const response = await api.get(`/collections/workspace/${workspaceId}`);
    return response.data;
  },

  getCollection: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },

  createCollection: async (data) => {
    const response = await api.post('/collections', data);
    return response.data;
  },

  updateCollection: async (id, data) => {
    const response = await api.put(`/collections/${id}`, data);
    return response.data;
  },

  deleteCollection: async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await api.put(`/collections/${id}/favorite`);
    return response.data;
  },

  togglePin: async (id) => {
    const response = await api.put(`/collections/${id}/pin`);
    return response.data;
  },

  reorderCollections: async (data) => {
    const response = await api.put('/collections/reorder', data);
    return response.data;
  }
};

export default collectionService;
