import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import HelpGuide from './components/HelpGuide';
import LoginPage from './pages/LoginPage';
import KanbanPage from './pages/KanbanPage';
import SprintPage from './pages/SprintPage';
import ArchDashboardPage from './pages/ArchDashboardPage';
import TeamPage from './pages/TeamPage';
import RoadmapPage from './pages/RoadmapPage';
import AIAutomationPage from './pages/AIAutomationPage';
import SettingsPage from './pages/SettingsPage';
import type { PageTab, Project, Task, Member, Sprint, StandupNote, RoadmapFeature, AIAutomation, ArchSnapshot, AuthUser } from './types';
import { api } from './services/apiConfig';

// ===== Demo Data — 從 ARCHITECTURE.md 匯入 =====
const DEMO_PROJECT: Project = {
  id: 1, name: 'Step1ne 獵頭 AI 協作系統', icon: '🎯',
  api_base_url: 'https://backendstep1ne.zeabur.app/api',
  health_url: 'https://backendstep1ne.zeabur.app/api/health',
  repo_url: 'https://github.com/jacky6658/step1ne-headhunter-system',
  status: 'active', created_at: '2026-01-01'
};

const DEMO_MEMBERS: Member[] = [
  { id: 1, display_name: 'Jacky', email: 'jacky@step1ne.com', role: 'admin' as const, created_at: '2026-01-01' },
  { id: 2, display_name: 'Phoebe', email: 'phoebe@step1ne.com', role: 'member' as const, created_at: '2026-01-01' },
  { id: 3, display_name: 'Jim', email: 'jim@step1ne.com', role: 'member' as const, created_at: '2026-01-15' },
];

// ===== 從 ARCHITECTURE.md 匯入的完整任務清單 =====
const DEMO_TASKS: Task[] = [
  // ── Done（已完成的核心功能）──
  { id: 1, project_id: 1, sprint_id: 1, title: '候選人管理 CRUD（40+ 欄位）', status: 'done', priority: 'P0', assignee_id: 1, labels: ['後端', '核心'], sort_order: 0, created_at: '2026-01-10', updated_at: '2026-02-01' },
  { id: 2, project_id: 1, sprint_id: 1, title: '候選人卡片 Phase 1（年齡/產業/語言/證照/薪資）', status: 'done', priority: 'P0', assignee_id: 1, labels: ['前端', '核心'], sort_order: 1, created_at: '2026-01-12', updated_at: '2026-02-05' },
  { id: 3, project_id: 1, sprint_id: 1, title: '候選人卡片 Phase 3（求職動機/離職原因/競業）', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端', '核心'], sort_order: 2, created_at: '2026-01-15', updated_at: '2026-02-10' },
  { id: 4, project_id: 1, sprint_id: 1, title: '五維雷達圖（自動計算 + 手動調整）', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端', 'AI'], sort_order: 3, created_at: '2026-01-18', updated_at: '2026-02-12' },
  { id: 5, project_id: 1, sprint_id: 1, title: '匿名履歷（雷達圖 + 顧問評語 + Phase 3）', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端', '匯出'], sort_order: 4, created_at: '2026-01-20', updated_at: '2026-02-15' },
  { id: 6, project_id: 1, sprint_id: 1, title: '履歷解析（LinkedIn / 104）', status: 'done', priority: 'P0', assignee_id: 1, labels: ['後端', 'AI'], sort_order: 5, created_at: '2026-01-22', updated_at: '2026-02-18' },
  { id: 7, project_id: 1, sprint_id: 1, title: '拖放匯入履歷', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端', 'UX'], sort_order: 6, created_at: '2026-01-25', updated_at: '2026-02-20' },
  { id: 8, project_id: 1, sprint_id: 1, title: '職缺管理 CRUD + 狀態追蹤', status: 'done', priority: 'P0', assignee_id: 1, labels: ['後端', '核心'], sort_order: 7, created_at: '2026-01-28', updated_at: '2026-02-22' },
  { id: 9, project_id: 1, sprint_id: 1, title: 'AI 配對推薦（加權評分 P0/P1/P2）', status: 'done', priority: 'P0', assignee_id: 1, labels: ['AI', '核心'], sort_order: 8, created_at: '2026-02-01', updated_at: '2026-02-25' },
  { id: 10, project_id: 1, sprint_id: 1, title: '看板視圖（Kanban Board）', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端', 'UX'], sort_order: 9, created_at: '2026-02-03', updated_at: '2026-02-28' },
  { id: 11, project_id: 1, sprint_id: 1, title: 'BD 客戶管理', status: 'done', priority: 'P1', assignee_id: 2, labels: ['前端', '後端'], sort_order: 10, created_at: '2026-02-05', updated_at: '2026-03-01' },
  { id: 12, project_id: 1, sprint_id: 1, title: 'GitHub 分析整合', status: 'done', priority: 'P2', assignee_id: 1, labels: ['API', 'AI'], sort_order: 11, created_at: '2026-02-07', updated_at: '2026-03-02' },
  { id: 13, project_id: 1, sprint_id: 1, title: 'Google Sheets 同步', status: 'done', priority: 'P2', assignee_id: 1, labels: ['API', '整合'], sort_order: 12, created_at: '2026-02-09', updated_at: '2026-03-03' },
  { id: 14, project_id: 1, sprint_id: 1, title: '系統操作日誌', status: 'done', priority: 'P2', assignee_id: 1, labels: ['後端', '安全'], sort_order: 13, created_at: '2026-02-11', updated_at: '2026-03-04' },
  { id: 15, project_id: 1, sprint_id: 1, title: '年齡/年資自動計算', status: 'done', priority: 'P2', assignee_id: 1, labels: ['後端'], sort_order: 14, created_at: '2026-02-12', updated_at: '2026-03-04' },
  { id: 16, project_id: 1, sprint_id: 1, title: '使用者權限（ADMIN/REVIEWER）', status: 'done', priority: 'P1', assignee_id: 1, labels: ['後端', '安全'], sort_order: 15, created_at: '2026-02-14', updated_at: '2026-03-05' },
  { id: 17, project_id: 1, sprint_id: 1, title: '營運儀表板', status: 'done', priority: 'P1', assignee_id: 1, labels: ['前端'], sort_order: 16, created_at: '2026-02-16', updated_at: '2026-03-06' },
  { id: 18, project_id: 1, sprint_id: 1, title: '幫助頁面 + 架構文件', status: 'done', priority: 'P3', assignee_id: 1, labels: ['文件'], sort_order: 17, created_at: '2026-02-18', updated_at: '2026-03-07' },

  // ── In Progress（進行中）──
  { id: 19, project_id: 1, sprint_id: 2, title: '履歷解析穩定性（v2 API 已修復，工作經歷解析需驗證）', status: 'in_progress', priority: 'P1', assignee_id: 1, labels: ['後端', 'AI'], sort_order: 18, notes: 'v2 API 已修復，work history parsing 需驗證', created_at: '2026-03-01', updated_at: '2026-03-10' },
  { id: 20, project_id: 1, sprint_id: 2, title: '爬蟲系統（UI + 路由已建置，需獨立 Crawler 專案）', status: 'in_progress', priority: 'P1', assignee_id: 1, labels: ['爬蟲', '前端'], sort_order: 19, notes: 'UI + routes built, independent Crawler project needed', created_at: '2026-03-02', updated_at: '2026-03-10' },
  { id: 21, project_id: 1, sprint_id: 2, title: 'Perplexity AI 擴展（Service 已寫，API Key 管理未完成）', status: 'in_progress', priority: 'P2', assignee_id: 1, labels: ['AI', 'API'], sort_order: 20, notes: 'Service written, API Key management incomplete', created_at: '2026-03-03', updated_at: '2026-03-10' },
  { id: 22, project_id: 1, sprint_id: 2, title: '104/1111 職缺爬取（URL 欄位已加，自動同步未實作）', status: 'in_progress', priority: 'P2', assignee_id: 1, labels: ['爬蟲', '整合'], sort_order: 21, notes: 'URL field added, auto-sync not implemented', created_at: '2026-03-04', updated_at: '2026-03-10' },

  // ── P0 待辦（緊急修復 — 安全 & 可用性）──
  { id: 23, project_id: 1, sprint_id: 2, title: '🔴 移除 27 個檔案中的硬編碼 DB 密碼', status: 'todo', priority: 'P0', assignee_id: 1, labels: ['安全', '緊急'], sort_order: 22, estimated_hours: 2, notes: 'CRITICAL: server.js, routes-api.js, routes-openclaw.js, routes-crawler.js 等 27 個檔案', created_at: '2026-03-08', updated_at: '2026-03-08' },
  { id: 24, project_id: 1, sprint_id: 2, title: '🔴 修復 vite.config 暴露所有環境變數', status: 'todo', priority: 'P0', assignee_id: 1, labels: ['安全', '緊急'], sort_order: 23, estimated_hours: 0.5, notes: 'vite.config.ts 使用 process.env 暴露所有 env vars 到瀏覽器', created_at: '2026-03-08', updated_at: '2026-03-08' },
  { id: 25, project_id: 1, sprint_id: 2, title: '驗證履歷匯入工作經歷解析', status: 'todo', priority: 'P0', assignee_id: 1, labels: ['後端', 'AI'], sort_order: 24, estimated_hours: 1, created_at: '2026-03-08', updated_at: '2026-03-08' },

  // ── P1 待辦（短期 1-2 週）──
  { id: 26, project_id: 1, title: '前端 Bundle Code-Splitting（目前 1.1MB）', status: 'todo', priority: 'P1', labels: ['前端', '效能'], sort_order: 25, estimated_hours: 2, notes: 'main bundle 1.1MB, should be split', created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 27, project_id: 1, title: '真正的認證系統 JWT / Firebase Auth', status: 'todo', priority: 'P1', labels: ['後端', '安全'], sort_order: 26, estimated_hours: 8, notes: '目前用 localStorage 模擬登入狀態', created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 28, project_id: 1, title: '核心服務 Unit Tests', status: 'todo', priority: 'P1', labels: ['測試'], sort_order: 27, estimated_hours: 8, notes: '測試覆蓋率 10%，完全缺少', created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 29, project_id: 1, title: 'GitHub Actions CI — Build + Lint', status: 'todo', priority: 'P1', labels: ['DevOps', 'CI/CD'], sort_order: 28, estimated_hours: 3, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 30, project_id: 1, title: 'Sentry 錯誤監控整合', status: 'todo', priority: 'P1', labels: ['DevOps', '監控'], sort_order: 29, estimated_hours: 2, created_at: '2026-03-09', updated_at: '2026-03-09' },

  // ── P2 待辦（中期 1-2 月）──
  { id: 31, project_id: 1, title: 'Docker 容器化', status: 'backlog', priority: 'P2', labels: ['DevOps'], sort_order: 30, estimated_hours: 4, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 32, project_id: 1, title: '通知系統（Email / Line）', status: 'backlog', priority: 'P2', labels: ['後端', '整合'], sort_order: 31, estimated_hours: 16, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 33, project_id: 1, title: '更多履歷格式支援（CakeResume 等）', status: 'backlog', priority: 'P2', labels: ['後端', 'AI'], sort_order: 32, estimated_hours: 8, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 34, project_id: 1, title: 'API Rate Limiting', status: 'backlog', priority: 'P2', labels: ['後端', '安全'], sort_order: 33, estimated_hours: 2, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 35, project_id: 1, title: '完整爬蟲引擎整合', status: 'backlog', priority: 'P2', labels: ['爬蟲', '整合'], sort_order: 34, estimated_hours: 16, created_at: '2026-03-10', updated_at: '2026-03-10' },

  // ── P3 Backlog（長期願景）──
  { id: 36, project_id: 1, title: 'Swagger / OpenAPI 文件', status: 'backlog', priority: 'P3', labels: ['文件', 'API'], sort_order: 35, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 37, project_id: 1, title: 'i18n 國際化（英文介面）', status: 'backlog', priority: 'P3', labels: ['前端'], sort_order: 36, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 38, project_id: 1, title: 'Mobile RWD 響應式設計', status: 'backlog', priority: 'P3', labels: ['前端', 'UX'], sort_order: 37, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 39, project_id: 1, title: 'WebSocket 即時更新', status: 'backlog', priority: 'P3', labels: ['後端', '前端'], sort_order: 38, created_at: '2026-03-10', updated_at: '2026-03-10' },
  { id: 40, project_id: 1, title: 'AI 自動履歷評分', status: 'backlog', priority: 'P3', labels: ['AI'], sort_order: 39, created_at: '2026-03-10', updated_at: '2026-03-10' },
];

const DEMO_SPRINTS: Sprint[] = [
  {
    id: 1, project_id: 1, name: 'Sprint 1 — 核心 MVP',
    goal: '候選人管理、職缺管理、AI 配對、看板視圖等核心功能',
    start_date: '2026-01-10', end_date: '2026-02-28',
    status: 'completed' as const, created_at: '2026-01-10'
  },
  {
    id: 2, project_id: 1, name: 'Sprint 2 — 安全修復 & 穩定性',
    goal: '修復安全漏洞、提升履歷解析穩定性、爬蟲系統進度',
    start_date: '2026-03-01', end_date: '2026-03-14',
    status: 'active' as const, created_at: '2026-03-01'
  },
  {
    id: 3, project_id: 1, name: 'Sprint 3 — 測試 & CI/CD',
    goal: '建立自動化測試、GitHub Actions CI、Sentry 監控',
    start_date: '2026-03-15', end_date: '2026-03-28',
    status: 'planning' as const, created_at: '2026-03-10'
  },
];

// ===== 從 ARCHITECTURE.md 匯入的路線圖 =====
const DEMO_ROADMAP: RoadmapFeature[] = [
  // Q1 — 已完成核心功能
  { id: 1, project_id: 1, title: '候選人管理 CRUD（40+ 欄位）', quarter: '2026-Q1', priority: 'P0', status: 'done', milestone: 'MVP', created_at: '2026-01-01' },
  { id: 2, project_id: 1, title: 'AI 配對推薦（加權評分）', quarter: '2026-Q1', priority: 'P0', status: 'done', milestone: 'MVP', created_at: '2026-01-01' },
  { id: 3, project_id: 1, title: '五維雷達圖 + 匿名履歷', quarter: '2026-Q1', priority: 'P1', status: 'done', milestone: 'MVP', created_at: '2026-01-01' },
  { id: 4, project_id: 1, title: '履歷解析（LinkedIn / 104）', quarter: '2026-Q1', priority: 'P0', status: 'done', milestone: 'MVP', created_at: '2026-01-01' },
  { id: 5, project_id: 1, title: '看板視圖 + BD 客戶管理', quarter: '2026-Q1', priority: 'P1', status: 'done', milestone: 'MVP', created_at: '2026-01-01' },
  { id: 6, project_id: 1, title: 'GitHub 分析 + Google Sheets 同步', quarter: '2026-Q1', priority: 'P2', status: 'done', milestone: 'v1.0', created_at: '2026-01-01' },
  { id: 7, project_id: 1, title: '營運儀表板 + 系統日誌 + 權限', quarter: '2026-Q1', priority: 'P1', status: 'done', milestone: 'v1.0', created_at: '2026-01-01' },

  // Q1 — 進行中
  { id: 8, project_id: 1, title: '安全修復：移除硬編碼密碼（27 檔案）', description: 'CRITICAL: server.js, routes-api.js 等 27 個檔案包含硬編碼 DB 密碼', quarter: '2026-Q1', priority: 'P0', status: 'in_progress', milestone: 'Security Fix', created_at: '2026-03-01' },
  { id: 9, project_id: 1, title: '爬蟲系統獨立化', description: 'UI + 路由已建置，需獨立 Crawler 專案', quarter: '2026-Q1', priority: 'P1', status: 'in_progress', milestone: 'v1.1', created_at: '2026-03-01' },

  // Q2 — 計劃中
  { id: 10, project_id: 1, title: '自動化測試（Unit + Integration）', description: '測試覆蓋率目前 10%，需全面補上', quarter: '2026-Q2', priority: 'P1', status: 'planned', milestone: 'Quality', created_at: '2026-03-10' },
  { id: 11, project_id: 1, title: 'JWT / Firebase Auth 認證系統', description: '取代 localStorage 模擬登入', quarter: '2026-Q2', priority: 'P1', status: 'planned', milestone: 'Security', created_at: '2026-03-10' },
  { id: 12, project_id: 1, title: 'GitHub Actions CI/CD Pipeline', description: 'Build + Lint + Test 自動化', quarter: '2026-Q2', priority: 'P1', status: 'planned', milestone: 'DevOps', created_at: '2026-03-10' },
  { id: 13, project_id: 1, title: 'Sentry 錯誤監控', quarter: '2026-Q2', priority: 'P1', status: 'planned', milestone: 'DevOps', created_at: '2026-03-10' },
  { id: 14, project_id: 1, title: '前端 Bundle Code-Splitting', description: '主包 1.1MB → 分割優化', quarter: '2026-Q2', priority: 'P1', status: 'planned', milestone: '效能', created_at: '2026-03-10' },

  // Q3 — 中期功能
  { id: 15, project_id: 1, title: 'Docker 容器化部署', quarter: '2026-Q3', priority: 'P2', status: 'planned', milestone: 'DevOps', created_at: '2026-03-10' },
  { id: 16, project_id: 1, title: '通知系統（Email + Line）', quarter: '2026-Q3', priority: 'P2', status: 'planned', milestone: 'v2.0', created_at: '2026-03-10' },
  { id: 17, project_id: 1, title: 'API Rate Limiting', quarter: '2026-Q3', priority: 'P2', status: 'planned', milestone: 'Security', created_at: '2026-03-10' },
  { id: 18, project_id: 1, title: '完整爬蟲引擎整合', quarter: '2026-Q3', priority: 'P2', status: 'planned', milestone: 'v2.0', created_at: '2026-03-10' },

  // Q4 — 長期願景
  { id: 19, project_id: 1, title: 'Swagger / OpenAPI 文件', quarter: '2026-Q4', priority: 'P3', status: 'planned', milestone: 'DX', created_at: '2026-03-10' },
  { id: 20, project_id: 1, title: 'i18n 國際化 + Mobile RWD', quarter: '2026-Q4', priority: 'P3', status: 'planned', milestone: 'v3.0', created_at: '2026-03-10' },
  { id: 21, project_id: 1, title: 'WebSocket 即時更新 + AI 自動評分', quarter: '2026-Q4', priority: 'P3', status: 'planned', milestone: 'v3.0', created_at: '2026-03-10' },
];

// ===== 站會紀錄範例 =====
const DEMO_STANDUPS: StandupNote[] = [
  { id: 1, project_id: 1, member_id: 1, date: '2026-03-11', yesterday: '完成 Bot 排程 & Leads 功能清理，建立 .env 配置', today: '開始建立 Agile Hub 專案骨架', blockers: '無', created_at: '2026-03-11T09:00:00Z' },
  { id: 2, project_id: 1, member_id: 2, date: '2026-03-11', yesterday: '測試匿名履歷匯出功能', today: '協助驗證履歷解析穩定性', blockers: '等待 v2 API 修復確認', created_at: '2026-03-11T09:05:00Z' },
  { id: 3, project_id: 1, member_id: 1, date: '2026-03-10', yesterday: '更新 ARCHITECTURE.md、安全問題盤點', today: '規劃 DB 密碼移除方案（27 檔案）', blockers: '需確認 Zeabur 環境變數注入方式', created_at: '2026-03-10T09:00:00Z' },
];

// ===== AI 自動化 =====
const DEMO_AUTOMATIONS: AIAutomation[] = [
  { id: 1, project_id: 1, name: '系統健康檢查', api_endpoint: 'https://backendstep1ne.zeabur.app/api/health', method: 'GET', enabled: true, schedule: '*/30 * * * *', created_at: '2026-03-01' },
  { id: 2, project_id: 1, name: '候選人統計', api_endpoint: 'https://backendstep1ne.zeabur.app/api/candidates?limit=1', method: 'GET', enabled: false, created_at: '2026-03-01' },
  { id: 3, project_id: 1, name: '職缺列表同步', api_endpoint: 'https://backendstep1ne.zeabur.app/api/jobs', method: 'GET', enabled: false, created_at: '2026-03-01' },
];

// ===== 架構快照（來自 ARCHITECTURE.md 健康數據）=====
const DEMO_ARCH_SNAPSHOT: ArchSnapshot[] = [
  {
    id: 1, project_id: 1,
    health_data: {
      '前端 (React 19)': 95,
      '後端 (Express 5)': 90,
      '資料庫 (PostgreSQL)': 98,
      'AI 整合 (Gemini)': 70,
      '爬蟲系統': 55,
      '安全性': 40,
      '測試覆蓋': 10,
      'CI/CD': 20,
    },
    features_done: 18,
    features_wip: 4,
    features_todo: 14,
    api_count: 45,
    db_table_count: 12,
    notes: '來源：ARCHITECTURE.md（2026-03-11 更新）\n技術棧：React 19 + Vite 6 + TypeScript + Tailwind CSS 3\nExpress 5 + PostgreSQL + Google AI (Gemini)\n資料量：1,347 候選人、53 職缺、3 顧問',
    snapshot_at: '2026-03-11T00:00:00Z'
  }
];

export default function App() {
  // ===== Auth State =====
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<PageTab>('kanban');
  const [projects, setProjects] = useState<Project[]>([DEMO_PROJECT]);
  const [currentProject, setCurrentProject] = useState<Project | null>(DEMO_PROJECT);
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);
  const [sprints, setSprints] = useState<Sprint[]>(DEMO_SPRINTS);
  const [standups, setStandups] = useState<StandupNote[]>(DEMO_STANDUPS);
  const [roadmapFeatures, setRoadmapFeatures] = useState<RoadmapFeature[]>(DEMO_ROADMAP);
  const [automations, setAutomations] = useState<AIAutomation[]>(DEMO_AUTOMATIONS);
  const [archSnapshots, setArchSnapshots] = useState<ArchSnapshot[]>(DEMO_ARCH_SNAPSHOT);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // ===== Check existing token on mount =====
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('agile_hub_token');
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const user = await res.json();
          setAuthUser(user);
          setUseApi(true);
        } else {
          localStorage.removeItem('agile_hub_token');
        }
      } catch {
        // Backend offline — allow demo mode without login
        console.log('Backend offline, checking demo mode');
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Listen for forced logout (token expired)
  useEffect(() => {
    const handleLogout = () => {
      setAuthUser(null);
      localStorage.removeItem('agile_hub_token');
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const handleLogin = (user: AuthUser, _token: string) => {
    setAuthUser(user);
    setUseApi(true);
    loadFromApi();
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('agile_hub_token');
  };

  // 嘗試連線後端（僅在已登入時載入資料）
  useEffect(() => {
    if (authUser && useApi) {
      loadFromApi();
    }
  }, [authUser]);

  const loadFromApi = async () => {
    setLoading(true);
    try {
      const pid = currentProject?.id || 1;
      const [p, t, m, s, st, rf, aa, as_] = await Promise.all([
        api.get<Project[]>('/projects'),
        api.get<Task[]>(`/tasks?project_id=${pid}`),
        api.get<Member[]>('/members'),
        api.get<Sprint[]>(`/sprints?project_id=${pid}`),
        api.get<StandupNote[]>(`/standups?project_id=${pid}`),
        api.get<RoadmapFeature[]>(`/roadmap-features?project_id=${pid}`),
        api.get<AIAutomation[]>(`/ai-automations?project_id=${pid}`),
        api.get<ArchSnapshot[]>(`/arch-snapshots?project_id=${pid}`),
      ]);
      if (p.length) setProjects(p);
      if (t.length) setTasks(t);
      if (m.length) setMembers(m);
      if (s.length) setSprints(s);
      if (st.length) setStandups(st);
      if (rf.length) setRoadmapFeatures(rf);
      if (aa.length) setAutomations(aa);
      if (as_.length) setArchSnapshots(as_);
      if (p.length && !currentProject) setCurrentProject(p[0]);
    } catch (e) {
      console.error('Failed to load from API:', e);
    }
    setLoading(false);
  };

  // ===== Task CRUD =====
  const nextId = useCallback((items: { id: number }[]) => {
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
  }, []);

  const handleTaskCreate = useCallback((data: Partial<Task>) => {
    const newTask: Task = {
      id: nextId(tasks),
      project_id: currentProject?.id || 1,
      title: data.title || '新任務',
      description: data.description,
      status: data.status || 'todo' as const,
      priority: data.priority || 'P2' as const,
      assignee_id: data.assignee_id ?? null,
      reporter_id: data.reporter_id ?? null,
      labels: data.labels || [],
      estimated_hours: data.estimated_hours ?? null,
      actual_hours: data.actual_hours ?? null,
      due_date: data.due_date ?? null,
      sort_order: tasks.length,
      sprint_id: data.sprint_id ?? null,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    if (useApi) api.post('/tasks', newTask).catch(console.error);
  }, [tasks, currentProject, useApi, nextId]);

  const handleTaskUpdate = useCallback((id: number, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t));
    if (useApi) api.patch(`/tasks/${id}`, data).catch(console.error);
  }, [useApi]);

  const handleTaskDelete = useCallback((id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (useApi) api.delete(`/tasks/${id}`).catch(console.error);
  }, [useApi]);

  // ===== Sprint CRUD =====
  const handleSprintCreate = useCallback((data: Partial<Sprint>) => {
    const newSprint: Sprint = {
      id: nextId(sprints),
      project_id: currentProject?.id || 1,
      name: data.name || '新 Sprint',
      goal: data.goal,
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status || 'planning' as const,
      created_at: new Date().toISOString()
    };
    setSprints(prev => [...prev, newSprint]);
    if (useApi) api.post('/sprints', newSprint).catch(console.error);
  }, [sprints, currentProject, useApi, nextId]);

  const handleSprintUpdate = useCallback((id: number, data: Partial<Sprint>) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    if (useApi) api.patch(`/sprints/${id}`, data).catch(console.error);
  }, [useApi]);

  const handleSprintDelete = useCallback((id: number) => {
    setSprints(prev => prev.filter(s => s.id !== id));
    if (useApi) api.delete(`/sprints/${id}`).catch(console.error);
  }, [useApi]);

  // ===== Member CRUD =====
  const handleMemberCreate = useCallback((data: Partial<Member>) => {
    const newMember: Member = {
      id: nextId(members),
      display_name: data.display_name || '',
      email: data.email,
      role: data.role || 'member' as const,
      created_at: new Date().toISOString()
    };
    setMembers(prev => [...prev, newMember]);
    if (useApi) api.post('/members', newMember).catch(console.error);
  }, [members, useApi, nextId]);

  // ===== Standup CRUD =====
  const handleStandupCreate = useCallback((data: Partial<StandupNote>) => {
    const newStandup: StandupNote = {
      id: nextId(standups),
      project_id: currentProject?.id || 1,
      member_id: data.member_id || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      yesterday: data.yesterday,
      today: data.today,
      blockers: data.blockers,
      created_at: new Date().toISOString()
    };
    setStandups(prev => [...prev, newStandup]);
    if (useApi) api.post('/standups', newStandup).catch(console.error);
  }, [standups, currentProject, useApi, nextId]);

  // ===== Roadmap CRUD =====
  const handleFeatureCreate = useCallback((data: Partial<RoadmapFeature>) => {
    const newFeature: RoadmapFeature = {
      id: nextId(roadmapFeatures),
      project_id: currentProject?.id || 1,
      title: data.title || '',
      description: data.description,
      quarter: data.quarter,
      priority: data.priority || 'P2' as const,
      status: data.status || 'planned' as const,
      milestone: data.milestone,
      depends_on: data.depends_on,
      created_at: new Date().toISOString()
    };
    setRoadmapFeatures(prev => [...prev, newFeature]);
    if (useApi) api.post('/roadmap-features', newFeature).catch(console.error);
  }, [roadmapFeatures, currentProject, useApi, nextId]);

  const handleFeatureUpdate = useCallback((id: number, data: Partial<RoadmapFeature>) => {
    setRoadmapFeatures(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
    if (useApi) api.patch(`/roadmap-features/${id}`, data).catch(console.error);
  }, [useApi]);

  const handleFeatureDelete = useCallback((id: number) => {
    setRoadmapFeatures(prev => prev.filter(f => f.id !== id));
    if (useApi) api.delete(`/roadmap-features/${id}`).catch(console.error);
  }, [useApi]);

  // ===== AI Automation CRUD =====
  const handleAutomationCreate = useCallback((data: Partial<AIAutomation>) => {
    const newAuto: AIAutomation = {
      id: nextId(automations),
      project_id: currentProject?.id || 1,
      name: data.name || '',
      api_endpoint: data.api_endpoint,
      method: data.method || 'GET',
      payload: data.payload,
      schedule: data.schedule,
      enabled: data.enabled || false,
      created_at: new Date().toISOString()
    };
    setAutomations(prev => [...prev, newAuto]);
    if (useApi) api.post('/ai-automations', newAuto).catch(console.error);
  }, [automations, currentProject, useApi, nextId]);

  const handleAutomationUpdate = useCallback((id: number, data: Partial<AIAutomation>) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    if (useApi) api.patch(`/ai-automations/${id}`, data).catch(console.error);
  }, [useApi]);

  const handleAutomationRun = useCallback(async (id: number) => {
    const auto = automations.find(a => a.id === id);
    if (!auto?.api_endpoint) return;
    try {
      const start = Date.now();
      const res = await fetch(auto.api_endpoint, {
        method: auto.method || 'GET',
        signal: AbortSignal.timeout(30000)
      });
      const text = await res.text();
      handleAutomationUpdate(id, {
        last_run_at: new Date().toISOString(),
        last_run_status: res.ok ? 'success' : 'error',
        last_run_log: `[${new Date().toISOString()}] ${auto.method} ${auto.api_endpoint}\nStatus: ${res.status}\nTime: ${Date.now() - start}ms\n\n${text.substring(0, 2000)}`
      });
    } catch (e) {
      handleAutomationUpdate(id, {
        last_run_at: new Date().toISOString(),
        last_run_status: 'error',
        last_run_log: `[${new Date().toISOString()}] Error: ${(e as Error).message}`
      });
    }
  }, [automations, handleAutomationUpdate]);

  // ===== Project CRUD =====
  const handleProjectCreate = useCallback((data: Partial<Project>) => {
    const newProject: Project = {
      id: nextId(projects),
      name: data.name || '',
      description: data.description,
      api_base_url: data.api_base_url,
      health_url: data.health_url,
      repo_url: data.repo_url,
      icon: data.icon || '📁',
      status: 'active',
      created_at: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    if (useApi) api.post('/projects', newProject).catch(console.error);
  }, [projects, useApi, nextId]);

  const handleProjectUpdate = useCallback((id: number, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    if (currentProject?.id === id) setCurrentProject(prev => prev ? { ...prev, ...data } : prev);
    if (useApi) api.patch(`/projects/${id}`, data).catch(console.error);
  }, [currentProject, useApi]);

  const handleProjectDelete = useCallback((id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (useApi) api.delete(`/projects/${id}`).catch(console.error);
  }, [useApi]);

  // ===== Arch Snapshot =====
  const handleCreateSnapshot = useCallback((data: Partial<ArchSnapshot>) => {
    const newSnapshot: ArchSnapshot = {
      id: nextId(archSnapshots),
      project_id: currentProject?.id || 1,
      health_data: data.health_data || {},
      features_done: data.features_done || 0,
      features_wip: data.features_wip || 0,
      features_todo: data.features_todo || 0,
      api_count: data.api_count || 0,
      db_table_count: data.db_table_count || 0,
      notes: data.notes,
      snapshot_at: new Date().toISOString()
    };
    setArchSnapshots(prev => [newSnapshot, ...prev]);
  }, [archSnapshots, currentProject, nextId]);

  // ===== 依專案篩選資料 =====
  const pid = currentProject?.id;
  const projectTasks = tasks.filter(t => t.project_id === pid);
  const projectSprints = sprints.filter(s => s.project_id === pid);
  const projectStandups = standups.filter(s => s.project_id === pid);
  const projectFeatures = roadmapFeatures.filter(f => f.project_id === pid);
  const projectAutomations = automations.filter(a => a.project_id === pid);
  const projectSnapshots = archSnapshots.filter(s => s.project_id === pid);

  // ===== Render Page =====
  const renderPage = () => {
    switch (activeTab) {
      case 'kanban':
        return <KanbanPage project={currentProject} tasks={projectTasks} members={members} sprints={projectSprints} features={projectFeatures} onTaskCreate={handleTaskCreate} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} onRefresh={loadFromApi} loading={loading} />;
      case 'sprint':
        return <SprintPage project={currentProject} tasks={projectTasks} members={members} sprints={projectSprints} onSprintCreate={handleSprintCreate} onSprintUpdate={handleSprintUpdate} onSprintDelete={handleSprintDelete} onTaskUpdate={handleTaskUpdate} />;
      case 'arch-dashboard':
        return <ArchDashboardPage project={currentProject} snapshots={projectSnapshots} onCreateSnapshot={handleCreateSnapshot} onRefresh={loadFromApi} />;
      case 'team':
        return <TeamPage project={currentProject} members={members} standups={projectStandups} onStandupCreate={handleStandupCreate} onMemberCreate={handleMemberCreate} />;
      case 'roadmap':
        return <RoadmapPage project={currentProject} features={projectFeatures} onFeatureCreate={handleFeatureCreate} onFeatureUpdate={handleFeatureUpdate} onFeatureDelete={handleFeatureDelete} />;
      case 'ai-automation':
        return <AIAutomationPage project={currentProject} automations={projectAutomations} onAutomationCreate={handleAutomationCreate} onAutomationUpdate={handleAutomationUpdate} onAutomationRun={handleAutomationRun} />;
      case 'settings':
        return <SettingsPage projects={projects} currentProject={currentProject} onProjectCreate={handleProjectCreate} onProjectUpdate={handleProjectUpdate} onProjectDelete={handleProjectDelete} />;
      default:
        return <KanbanPage project={currentProject} tasks={projectTasks} members={members} sprints={projectSprints} features={projectFeatures} onTaskCreate={handleTaskCreate} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} onRefresh={loadFromApi} loading={loading} />;
    }
  };

  // ===== Loading / Auth Check =====
  if (authChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">載入中...</p>
        </div>
      </div>
    );
  }

  // ===== Not Logged In → Show Login =====
  if (!authUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // ===== Logged In → Show App =====
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentProject={currentProject}
        projects={projects}
        onProjectChange={setCurrentProject}
        onHelpOpen={() => setShowHelp(true)}
        authUser={authUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
