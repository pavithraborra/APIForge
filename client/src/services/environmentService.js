import api from './api';

const environmentService = {
  getEnvironments: async (workspaceId) => {
    const response = await api.get(`/environments/workspace/${workspaceId}`);
    return response.data;
  },

  getEnvironment: async (id) => {
    const response = await api.get(`/environments/${id}`);
    return response.data;
  },

  createEnvironment: async (data) => {
    const response = await api.post('/environments', data);
    return response.data;
  },

  updateEnvironment: async (id, data) => {
    const response = await api.put(`/environments/${id}`, data);
    return response.data;
  },

  deleteEnvironment: async (id) => {
    const response = await api.delete(`/environments/${id}`);
    return response.data;
  }
};

export default environmentService;
