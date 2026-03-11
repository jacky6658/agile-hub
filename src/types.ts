// ===== Agile Hub Type Definitions =====

// 任務狀態
export const TaskStatus = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done'
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// 優先級
export const Priority = {
  P0: 'P0',
  P1: 'P1',
  P2: 'P2',
  P3: 'P3'
} as const;
export type Priority = typeof Priority[keyof typeof Priority];

// Sprint 狀態
export const SprintStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;
export type SprintStatus = typeof SprintStatus[keyof typeof SprintStatus];

// 成員角色
export const MemberRole = {
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;
export type MemberRole = typeof MemberRole[keyof typeof MemberRole];

// Roadmap 狀態
export const RoadmapStatus = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
} as const;
export type RoadmapStatus = typeof RoadmapStatus[keyof typeof RoadmapStatus];

// 專案
export interface Project {
  id: number;
  name: string;
  description?: string;
  api_base_url?: string;
  health_url?: string;
  repo_url?: string;
  icon?: string;
  status: string;
  created_at: string;
}

// 成員
export interface Member {
  id: number;
  display_name: string;
  email?: string;
  avatar?: string;
  role: MemberRole;
  created_at: string;
}

// 任務
export interface Task {
  id: number;
  project_id: number;
  sprint_id?: number | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee_id?: number | null;
  reporter_id?: number | null;
  assignee?: Member;
  reporter?: Member;
  labels: string[];
  estimated_hours?: number | null;
  actual_hours?: number | null;
  due_date?: string | null;
  sort_order: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Sprint
export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
  status: SprintStatus;
  created_at: string;
  tasks?: Task[];
}

// Roadmap Feature
export interface RoadmapFeature {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  quarter?: string;
  priority: Priority;
  status: RoadmapStatus;
  milestone?: string;
  depends_on?: number[];
  created_at: string;
}

// 站會紀錄
export interface StandupNote {
  id: number;
  project_id: number;
  member_id: number;
  member?: Member;
  date: string;
  yesterday?: string;
  today?: string;
  blockers?: string;
  created_at: string;
}

// AI 自動化
export interface AIAutomation {
  id: number;
  project_id: number;
  name: string;
  api_endpoint?: string;
  method: string;
  payload?: Record<string, unknown>;
  schedule?: string;
  enabled: boolean;
  last_run_at?: string;
  last_run_status?: string;
  last_run_log?: string;
  created_at: string;
}

// 系統架構快照
export interface ArchSnapshot {
  id: number;
  project_id: number;
  health_data: Record<string, number>;
  features_done: number;
  features_wip: number;
  features_todo: number;
  api_count: number;
  db_table_count: number;
  notes?: string;
  snapshot_at: string;
}

// 任務活動紀錄
export interface TaskActivity {
  id: number;
  task_id: number;
  project_id: number;
  actor_id?: number | null;
  actor_name?: string;
  member_name?: string;
  action: string;
  detail?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

// 登入使用者
export interface AuthUser {
  id: number;
  display_name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
}

// 頁面 Tab 類型
export type PageTab =
  | 'kanban'
  | 'sprint'
  | 'arch-dashboard'
  | 'team'
  | 'roadmap'
  | 'ai-automation'
  | 'settings';
