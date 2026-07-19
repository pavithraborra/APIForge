import api from './api';

const workspaceService = {
  getWorkspaces: async () => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  getWorkspace: async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (data) => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  updateWorkspace: async (id, data) => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  deleteWorkspace: async (id) => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  // Members
  getMembers: async (id) => {
    const response = await api.get(`/workspaces/${id}/members`);
    return response.data;
  },

  inviteMember: async (id, data) => {
    const response = await api.post(`/workspaces/${id}/invite`, data);
    return response.data;
  },

  removeMember: async (workspaceId, userId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    return response.data;
  },

  updateRole: async (workspaceId, userId, data) => {
    const response = await api.put(`/workspaces/${workspaceId}/members/${userId}/role`, data);
    return response.data;
  },

  // Analytics
  getAnalytics: async (id) => {
    const response = await api.get(`/workspaces/${id}/analytics`);
    return response.data;
  }
};

export default workspaceService;
