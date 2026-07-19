import api from './api';

const historyService = {
  getHistory: async (workspaceId, params = {}) => {
    const response = await api.get(`/history/workspace/${workspaceId}`, { params });
    return response.data;
  },

  getHistoryById: async (id) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },

  deleteHistory: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },

  clearHistory: async (workspaceId) => {
    const response = await api.delete(`/history/workspace/${workspaceId}`);
    return response.data;
  }
};

export default historyService;
