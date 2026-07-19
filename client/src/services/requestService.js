import api from './api';

const requestService = {
  getRequests: async (collectionId) => {
    const response = await api.get(`/requests/collection/${collectionId}`);
    return response.data;
  },

  getRequest: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  createRequest: async (data) => {
    const response = await api.post('/requests', data);
    return response.data;
  },

  updateRequest: async (id, data) => {
    const response = await api.put(`/requests/${id}`, data);
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },

  duplicateRequest: async (id) => {
    const response = await api.post(`/requests/${id}/duplicate`);
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await api.put(`/requests/${id}/favorite`);
    return response.data;
  },

  executeRequest: async (id, data) => {
    const response = await api.post(`/requests/${id}/execute`, data);
    return response.data;
  }
};

export default requestService;
