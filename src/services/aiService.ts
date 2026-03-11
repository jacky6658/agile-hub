import { api } from './apiConfig';
import type { AIAutomation, ArchSnapshot } from '../types';

export const aiService = {
  // AI 自動化
  getAutomations: (projectId: number) =>
    api.get<AIAutomation[]>(`/ai-automations?project_id=${projectId}`),
  createAutomation: (data: Partial<AIAutomation>) =>
    api.post<AIAutomation>('/ai-automations', data),
  updateAutomation: (id: number, data: Partial<AIAutomation>) =>
    api.patch<AIAutomation>(`/ai-automations/${id}`, data),
  runAutomation: (id: number) =>
    api.post<{ success: boolean; log: string }>(`/ai-automations/${id}/run`, {}),

  // 架構快照
  getSnapshots: (projectId: number) =>
    api.get<ArchSnapshot[]>(`/arch-snapshots?project_id=${projectId}`),
  createSnapshot: (data: Partial<ArchSnapshot>) =>
    api.post<ArchSnapshot>('/arch-snapshots', data),

  // 健康檢查
  checkHealth: (url: string) =>
    fetch(url, { signal: AbortSignal.timeout(10000) })
      .then(r => ({ ok: r.ok, status: r.status }))
      .catch(e => ({ ok: false, status: 0, error: (e as Error).message })),
};
