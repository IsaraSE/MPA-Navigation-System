import api from './api';

export const reportService = {
  // Create a new report
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  // Get all reports with optional filters
  getReports: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type) params.append('type', filters.type);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },

  // Get a single report by ID
  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Get current user's reports
  getMyReports: async () => {
    const response = await api.get('/reports/user/my-reports');
    return response.data;
  },

  // Update a report
  updateReport: async (id, reportData) => {
    const response = await api.patch(`/reports/${id}`, reportData);
    return response.data;
  },

  // Delete a report
  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Get reports near a location
  getReportsNearLocation: async (latitude, longitude, maxDistance = 50000) => {
    const response = await api.get('/reports/nearby', {
      params: { latitude, longitude, maxDistance }
    });
    return response.data;
  },

  // Toggle report status (admin only)
  toggleReportStatus: async (id) => {
    const response = await api.patch(`/reports/${id}/toggle-status`);
    return response.data;
  }
};

export default reportService;

