import { TaskStatus, Priority, SprintStatus, RoadmapStatus } from './types';

// ===== 任務狀態配置 =====
export const TASK_STATUS_CONFIG = {
  [TaskStatus.BACKLOG]: {
    label: 'Backlog',
    color: 'slate',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300'
  },
  [TaskStatus.TODO]: {
    label: '待辦',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300'
  },
  [TaskStatus.IN_PROGRESS]: {
    label: '進行中',
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300'
  },
  [TaskStatus.REVIEW]: {
    label: '審查中',
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-300'
  },
  [TaskStatus.DONE]: {
    label: '完成',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300'
  }
};

// 看板欄位順序（含 Backlog）
export const KANBAN_COLUMNS = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.DONE
];

// ===== 優先級配置 =====
export const PRIORITY_CONFIG = {
  [Priority.P0]: { label: 'P0 緊急', color: 'red', icon: '🔴' },
  [Priority.P1]: { label: 'P1 重要', color: 'orange', icon: '🟠' },
  [Priority.P2]: { label: 'P2 一般', color: 'blue', icon: '🔵' },
  [Priority.P3]: { label: 'P3 低', color: 'gray', icon: '⚪' }
};

// ===== Sprint 狀態配置 =====
export const SPRINT_STATUS_CONFIG = {
  [SprintStatus.PLANNING]: { label: '規劃中', color: 'slate', icon: '📋' },
  [SprintStatus.ACTIVE]: { label: '進行中', color: 'green', icon: '🏃' },
  [SprintStatus.COMPLETED]: { label: '已完成', color: 'blue', icon: '✅' }
};

// ===== Roadmap 狀態配置 =====
export const ROADMAP_STATUS_CONFIG = {
  [RoadmapStatus.PLANNED]: { label: '已規劃', color: 'slate' },
  [RoadmapStatus.IN_PROGRESS]: { label: '開發中', color: 'amber' },
  [RoadmapStatus.DONE]: { label: '已完成', color: 'green' }
};

// ===== API 配置 =====
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// ===== 快取 =====
export const CACHE_EXPIRY = 15 * 60 * 1000; // 15 分鐘
