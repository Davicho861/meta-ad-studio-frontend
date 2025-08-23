import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = () => api.get('/projects');
export const getKanbanBoard = (projectId: string) => api.get(`/kanban/${projectId}`);
export const getBacklog = (projectId: string) => api.get(`/backlog/${projectId}`);
export const getRoadmap = (projectId: string) => api.get(`/roadmap/${projectId}`);
export const getReport = (projectId: string, reportType: string) => api.get(`/reports/${projectId}/${reportType}`);

export default api;
