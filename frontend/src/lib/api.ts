import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string; errors?: unknown }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Assignment API calls
export const assignmentsApi = {
  list: (params?: { search?: string; status?: string; page?: number }) =>
    apiClient.get('/api/assignments', { params }),

  get: (id: string) => apiClient.get(`/api/assignments/${id}`),

  create: (data: unknown) => apiClient.post('/api/assignments', data),

  delete: (id: string) => apiClient.delete(`/api/assignments/${id}`),

  regenerate: (id: string) =>
    apiClient.post(`/api/assignments/${id}/regenerate`),
};