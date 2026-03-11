import { api } from './apiConfig';
import type { Sprint } from '../types';

export const sprintService = {
  getByProject: (projectId: number) => api.get<Sprint[]>(`/sprints?project_id=${projectId}`),
  getById: (id: number) => api.get<Sprint>(`/sprints/${id}`),
  create: (data: Partial<Sprint>) => api.post<Sprint>('/sprints', data),
  update: (id: number, data: Partial<Sprint>) => api.patch<Sprint>(`/sprints/${id}`, data),
  delete: (id: number) => api.delete(`/sprints/${id}`),
};
