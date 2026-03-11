import { api } from './apiConfig';
import type { Member, StandupNote } from '../types';

export const teamService = {
  getMembers: () => api.get<Member[]>('/members'),
  getMember: (id: number) => api.get<Member>(`/members/${id}`),
  createMember: (data: Partial<Member>) => api.post<Member>('/members', data),
  updateMember: (id: number, data: Partial<Member>) => api.patch<Member>(`/members/${id}`, data),

  // 站會紀錄
  getStandups: (projectId: number, date?: string) =>
    api.get<StandupNote[]>(`/standups?project_id=${projectId}${date ? `&date=${date}` : ''}`),
  createStandup: (data: Partial<StandupNote>) => api.post<StandupNote>('/standups', data),
};
