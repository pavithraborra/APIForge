import api from './api';

const activityService = {
  getActivities: async (workspaceId, params = {}) => {
    const response = await api.get(`/activities/workspace/${workspaceId}`, { params });
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/activities/recent');
    return response.data;
  }
};

export default activityService;
