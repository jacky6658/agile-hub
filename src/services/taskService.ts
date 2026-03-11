import { api } from './apiConfig';
import type { Task } from '../types';

export const taskService = {
  getByProject: (projectId: number) => api.get<Task[]>(`/tasks?project_id=${projectId}`),
  getBySprint: (sprintId: number) => api.get<Task[]>(`/tasks?sprint_id=${sprintId}`),
  getById: (id: number) => api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: number, data: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  updateStatus: (id: number, status: string) => api.patch<Task>(`/tasks/${id}`, { status }),
  assign: (id: number, assignee_id: number) => api.patch<Task>(`/tasks/${id}`, { assignee_id }),
};
