import axios from 'axios';
import type {
  User,
  UserCreate,
  LoginCredentials,
  Token,
  Task,
  TaskCreate,
  TaskUpdate,
  Stats,
  TaskDeadlineStats,
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v3';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<Token> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<Token>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  getByQuadrant: async (quadrant: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/quadrant/${quadrant}`);
    return response.data;
  },

  getByStatus: async (status: 'completed' | 'pending'): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks/status/${status}`);
    return response.data;
  },

  search: async (query: string): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/search', {
      params: { q: query },
    });
    return response.data;
  },

  getToday: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks/today');
    return response.data;
  },

  create: async (task: TaskCreate): Promise<Task> => {
    const response = await api.post<Task>('/tasks/', task);
    return response.data;
  },

  update: async (id: number, task: TaskUpdate): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  complete: async (id: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/complete`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Stats API
export const statsAPI = {
  getStats: async (): Promise<Stats> => {
    const response = await api.get<Stats>('/stats/');
    return response.data;
  },

  getDeadlines: async (): Promise<TaskDeadlineStats[]> => {
    const response = await api.get<TaskDeadlineStats[]>('/stats/deadlines');
    return response.data;
  },
};

export default api;