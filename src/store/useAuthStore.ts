import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, taskAPI } from '../services/authService';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  user: User | string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;

  // Auth Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // Task Actions
  fetchTasks: () => Promise<void>;
  createTask: (title: string, description?: string, priority?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      tasks: [],
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.login(email, password);
          const { token, data: user } = res.data;
          
          localStorage.setItem('token', token);
          set({ user, token, loading: false });
          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Login failed',
            loading: false
          });
          return false;
        }
      },

      signup: async (name, email, password, role = 'user') => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.signup(name, email, password, role);
          const { token, data: user } = res.data;
          
          localStorage.setItem('token', token);
          set({ user, token, loading: false });
          return true;
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Signup failed',
            loading: false
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null, tasks: [] });
        }
      },

      fetchTasks: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ loading: true });
        try {
          const res = await taskAPI.getTasks();
          set({ tasks: res.data.data, loading: false });
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Failed to fetch tasks',
            loading: false
          });
        }
      },

      createTask: async (title, description = '', priority: any = 'medium') => {
        set({ loading: true });
        try {
          const res = await taskAPI.createTask({
            title,
            description,
            priority,
            status: 'pending'
          });
          
          set(state => ({
            tasks: [res.data.data, ...state.tasks],
            loading: false
          }));
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Failed to create task',
            loading: false
          });
        }
      },

      deleteTask: async (id) => {
        set({ loading: true });
        try {
          await taskAPI.deleteTask(id);
          set(state => ({
            tasks: state.tasks.filter(t => t._id !== id),
            loading: false
          }));
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Failed to delete task',
            loading: false
          });
        }
      },

      updateTaskStatus: async (id, status: any) => {
        set({ loading: true });
        try {
          const res = await taskAPI.updateTask(id, { status });
          set(state => ({
            tasks: state.tasks.map(t => t._id === id ? res.data.data : t),
            loading: false
          }));
        } catch (err: any) {
          set({
            error: err.response?.data?.message || 'Failed to update task',
            loading: false
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }), 
    }
  )
);

export default useAuthStore;