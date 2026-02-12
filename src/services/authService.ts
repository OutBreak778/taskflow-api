import type { Task } from '../store/useAuthStore';
import API from './api';

export const authAPI = {
  login: (email: string, password: string) =>
    API.post('/api/v1/auth/sign-in', { email, password }),
  
  signup: (name: string, email: string, password: string, role = 'user') =>
    API.post('/api/v1/auth/sign-up', { name, email, password, role }),
  
  logout: () => API.post('/auth/sign-out'),
};

export const taskAPI = {
  getTasks: (filters?: Record<string, string>) =>
    API.get('/api/v1/task', { params: filters }),
  
  getTask: (id: string) => API.get(`/api/v1/task/${id}`),
  
  createTask: (data: Partial<Task>) =>
    API.post('/api/v1/task', data),
  
  updateTask: (id: string, data: Partial<Task>) =>
    API.put(`/api/v1/task/${id}`, data),
  
  deleteTask: (id: string) => API.delete(`/api/v1/task/${id}`),
  
  getStats: () => API.get('/api/v1/task/stats/summary'),
};