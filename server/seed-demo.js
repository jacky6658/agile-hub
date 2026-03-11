/**
 * Seed demo data into PostgreSQL for Agile Hub
 * Run: node server/seed-demo.js
 */
import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    // Check if tasks already exist (avoid double-seeding)
    const { rows: existingTasks } = await client.query('SELECT COUNT(*) FROM ah_tasks');
    if (parseInt(existingTasks[0].count) > 0) {
      console.log('⚠️  Data already exists, skipping seed. To re-seed, run:');
      console.log('   TRUNCATE ah_tasks, sprints, roadmap_features, standup_notes, ai_automations, arch_snapshots RESTART IDENTITY CASCADE;');
      return;
    }

    // Get project ID (should already have the seeded project)
    const { rows: projects } = await client.query('SELECT id FROM projects LIMIT 1');
    const projectId = projects[0]?.id || 1;

    // Get member IDs
    const { rows: memberRows } = await client.query('SELECT id, display_name FROM ah_members ORDER BY id');
    const jackyId = memberRows.find(m => m.display_name === 'Jacky')?.id || 1;
    const phoebeId = memberRows.find(m => m.display_name === 'Phoebe')?.id || 2;

    console.log(`📦 Seeding data for project #${projectId}...`);

    // ===== Sprints =====
    await client.query(`
      INSERT INTO sprints (project_id, name, goal, start_date, end_date, status) VALUES
      ($1, 'Sprint 1 — 核心 MVP', '候選人管理、職缺管理、AI 配對、看板視圖等核心功能', '2026-01-10', '2026-02-28', 'completed'),
      ($1, 'Sprint 2 — 安全修復 & 穩定性', '修復安全漏洞、提升履歷解析穩定性、爬蟲系統進度', '2026-03-01', '2026-03-14', 'active'),
      ($1, 'Sprint 3 — 測試 & CI/CD', '建立自動化測試、GitHub Actions CI、Sentry 監控', '2026-03-15', '2026-03-28', 'planning')
    `, [projectId]);
    console.log('  ✅ Sprints');

    // Get sprint IDs
    const { rows: sprintRows } = await client.query('SELECT id FROM sprints ORDER BY id');
    const sprint1 = sprintRows[0]?.id;
    const sprint2 = sprintRows[1]?.id;

    // ===== Tasks =====
    await client.query(`
      INSERT INTO ah_tasks (project_id, sprint_id, title, status, priority, assignee_id, labels, sort_order, notes) VALUES
      -- Done
      ($1, $2, '候選人管理 CRUD（40+ 欄位）', 'done', 'P0', $4, '{後端,核心}', 0, NULL),
      ($1, $2, '候選人卡片 Phase 1（年齡/產業/語言/證照/薪資）', 'done', 'P0', $4, '{前端,核心}', 1, NULL),
      ($1, $2, '候選人卡片 Phase 3（求職動機/離職原因/競業）', 'done', 'P1', $4, '{前端,核心}', 2, NULL),
      ($1, $2, '五維雷達圖（自動計算 + 手動調整）', 'done', 'P1', $4, '{前端,AI}', 3, NULL),
      ($1, $2, '匿名履歷（雷達圖 + 顧問評語 + Phase 3）', 'done', 'P1', $4, '{前端,匯出}', 4, NULL),
      ($1, $2, '履歷解析（LinkedIn / 104）', 'done', 'P0', $4, '{後端,AI}', 5, NULL),
      ($1, $2, '拖放匯入履歷', 'done', 'P1', $4, '{前端,UX}', 6, NULL),
      ($1, $2, '職缺管理 CRUD + 狀態追蹤', 'done', 'P0', $4, '{後端,核心}', 7, NULL),
      ($1, $2, 'AI 配對推薦（加權評分 P0/P1/P2）', 'done', 'P0', $4, '{AI,核心}', 8, NULL),
      ($1, $2, '看板視圖（Kanban Board）', 'done', 'P1', $4, '{前端,UX}', 9, NULL),
      ($1, $2, 'BD 客戶管理', 'done', 'P1', $5, '{前端,後端}', 10, NULL),
      ($1, $2, 'GitHub 分析整合', 'done', 'P2', $4, '{API,AI}', 11, NULL),
      ($1, $2, 'Google Sheets 同步', 'done', 'P2', $4, '{API,整合}', 12, NULL),
      ($1, $2, '系統操作日誌', 'done', 'P2', $4, '{後端,安全}', 13, NULL),
      ($1, $2, '年齡/年資自動計算', 'done', 'P2', $4, '{後端}', 14, NULL),
      ($1, $2, '使用者權限（ADMIN/REVIEWER）', 'done', 'P1', $4, '{後端,安全}', 15, NULL),
      ($1, $2, '營運儀表板', 'done', 'P1', $4, '{前端}', 16, NULL),
      ($1, $2, '幫助頁面 + 架構文件', 'done', 'P3', $4, '{文件}', 17, NULL),
      -- In Progress
      ($1, $3, '履歷解析穩定性（v2 API 已修復，工作經歷解析需驗證）', 'in_progress', 'P1', $4, '{後端,AI}', 18, 'v2 API 已修復，work history parsing 需驗證'),
      ($1, $3, '爬蟲系統（UI + 路由已建置，需獨立 Crawler 專案）', 'in_progress', 'P1', $4, '{爬蟲,前端}', 19, 'UI + routes built, independent Crawler project needed'),
      ($1, $3, 'Perplexity AI 擴展（Service 已寫，API Key 管理未完成）', 'in_progress', 'P2', $4, '{AI,API}', 20, 'Service written, API Key management incomplete'),
      ($1, $3, '104/1111 職缺爬取（URL 欄位已加，自動同步未實作）', 'in_progress', 'P2', $4, '{爬蟲,整合}', 21, 'URL field added, auto-sync not implemented'),
      -- Todo P0
      ($1, $3, '移除 27 個檔案中的硬編碼 DB 密碼', 'todo', 'P0', $4, '{安全,緊急}', 22, 'CRITICAL: server.js, routes-api.js 等 27 個檔案'),
      ($1, $3, '修復 vite.config 暴露所有環境變數', 'todo', 'P0', $4, '{安全,緊急}', 23, 'vite.config.ts 使用 process.env 暴露所有 env vars'),
      ($1, $3, '驗證履歷匯入工作經歷解析', 'todo', 'P0', $4, '{後端,AI}', 24, NULL),
      -- Todo P1
      ($1, NULL, '前端 Bundle Code-Splitting（目前 1.1MB）', 'todo', 'P1', NULL, '{前端,效能}', 25, 'main bundle 1.1MB, should be split'),
      ($1, NULL, '真正的認證系統 JWT / Firebase Auth', 'todo', 'P1', NULL, '{後端,安全}', 26, '目前用 localStorage 模擬登入狀態'),
      ($1, NULL, '核心服務 Unit Tests', 'todo', 'P1', NULL, '{測試}', 27, '測試覆蓋率 10%'),
      ($1, NULL, 'GitHub Actions CI — Build + Lint', 'todo', 'P1', NULL, '{DevOps,CI/CD}', 28, NULL),
      ($1, NULL, 'Sentry 錯誤監控整合', 'todo', 'P1', NULL, '{DevOps,監控}', 29, NULL),
      -- Backlog P2
      ($1, NULL, 'Docker 容器化', 'backlog', 'P2', NULL, '{DevOps}', 30, NULL),
      ($1, NULL, '通知系統（Email / Line）', 'backlog', 'P2', NULL, '{後端,整合}', 31, NULL),
      ($1, NULL, '更多履歷格式支援（CakeResume 等）', 'backlog', 'P2', NULL, '{後端,AI}', 32, NULL),
      ($1, NULL, 'API Rate Limiting', 'backlog', 'P2', NULL, '{後端,安全}', 33, NULL),
      ($1, NULL, '完整爬蟲引擎整合', 'backlog', 'P2', NULL, '{爬蟲,整合}', 34, NULL),
      -- Backlog P3
      ($1, NULL, 'Swagger / OpenAPI 文件', 'backlog', 'P3', NULL, '{文件,API}', 35, NULL),
      ($1, NULL, 'i18n 國際化（英文介面）', 'backlog', 'P3', NULL, '{前端}', 36, NULL),
      ($1, NULL, 'Mobile RWD 響應式設計', 'backlog', 'P3', NULL, '{前端,UX}', 37, NULL),
      ($1, NULL, 'WebSocket 即時更新', 'backlog', 'P3', NULL, '{後端,前端}', 38, NULL),
      ($1, NULL, 'AI 自動履歷評分', 'backlog', 'P3', NULL, '{AI}', 39, NULL)
    `, [projectId, sprint1, sprint2, jackyId, phoebeId]);
    console.log('  ✅ Tasks (40 items)');

    // ===== Roadmap Features =====
    await client.query(`
      INSERT INTO roadmap_features (project_id, title, description, quarter, priority, status, milestone) VALUES
      -- Q1 Done
      ($1, '候選人管理 CRUD（40+ 欄位）', NULL, '2026-Q1', 'P0', 'done', 'MVP'),
      ($1, 'AI 配對推薦（加權評分）', NULL, '2026-Q1', 'P0', 'done', 'MVP'),
      ($1, '五維雷達圖 + 匿名履歷', NULL, '2026-Q1', 'P1', 'done', 'MVP'),
      ($1, '履歷解析（LinkedIn / 104）', NULL, '2026-Q1', 'P0', 'done', 'MVP'),
      ($1, '看板視圖 + BD 客戶管理', NULL, '2026-Q1', 'P1', 'done', 'MVP'),
      ($1, 'GitHub 分析 + Google Sheets 同步', NULL, '2026-Q1', 'P2', 'done', 'v1.0'),
      ($1, '營運儀表板 + 系統日誌 + 權限', NULL, '2026-Q1', 'P1', 'done', 'v1.0'),
      -- Q1 In Progress
      ($1, '安全修復：移除硬編碼密碼（27 檔案）', 'CRITICAL: server.js, routes-api.js 等 27 個檔案包含硬編碼 DB 密碼', '2026-Q1', 'P0', 'in_progress', 'Security Fix'),
      ($1, '爬蟲系統獨立化', 'UI + 路由已建置，需獨立 Crawler 專案', '2026-Q1', 'P1', 'in_progress', 'v1.1'),
      -- Q2 Planned
      ($1, '自動化測試（Unit + Integration）', '測試覆蓋率目前 10%，需全面補上', '2026-Q2', 'P1', 'planned', 'Quality'),
      ($1, 'JWT / Firebase Auth 認證系統', '取代 localStorage 模擬登入', '2026-Q2', 'P1', 'planned', 'Security'),
      ($1, 'GitHub Actions CI/CD Pipeline', 'Build + Lint + Test 自動化', '2026-Q2', 'P1', 'planned', 'DevOps'),
      ($1, 'Sentry 錯誤監控', NULL, '2026-Q2', 'P1', 'planned', 'DevOps'),
      ($1, '前端 Bundle Code-Splitting', '主包 1.1MB → 分割優化', '2026-Q2', 'P1', 'planned', '效能'),
      -- Q3
      ($1, 'Docker 容器化部署', NULL, '2026-Q3', 'P2', 'planned', 'DevOps'),
      ($1, '通知系統（Email + Line）', NULL, '2026-Q3', 'P2', 'planned', 'v2.0'),
      ($1, 'API Rate Limiting', NULL, '2026-Q3', 'P2', 'planned', 'Security'),
      ($1, '完整爬蟲引擎整合', NULL, '2026-Q3', 'P2', 'planned', 'v2.0'),
      -- Q4
      ($1, 'Swagger / OpenAPI 文件', NULL, '2026-Q4', 'P3', 'planned', 'DX'),
      ($1, 'i18n 國際化 + Mobile RWD', NULL, '2026-Q4', 'P3', 'planned', 'v3.0'),
      ($1, 'WebSocket 即時更新 + AI 自動評分', NULL, '2026-Q4', 'P3', 'planned', 'v3.0')
    `, [projectId]);
    console.log('  ✅ Roadmap Features (21 items)');

    // ===== Standup Notes =====
    await client.query(`
      INSERT INTO standup_notes (project_id, member_id, date, yesterday, today, blockers) VALUES
      ($1, $2, '2026-03-11', '完成 Bot 排程 & Leads 功能清理，建立 .env 配置', '開始建立 Agile Hub 專案骨架', '無'),
      ($1, $3, '2026-03-11', '測試匿名履歷匯出功能', '協助驗證履歷解析穩定性', '等待 v2 API 修復確認'),
      ($1, $2, '2026-03-10', '更新 ARCHITECTURE.md、安全問題盤點', '規劃 DB 密碼移除方案（27 檔案）', '需確認 Zeabur 環境變數注入方式')
    `, [projectId, jackyId, phoebeId]);
    console.log('  ✅ Standup Notes');

    // ===== AI Automations =====
    await client.query(`
      INSERT INTO ai_automations (project_id, name, api_endpoint, method, enabled, schedule) VALUES
      ($1, '系統健康檢查', 'https://backendstep1ne.zeabur.app/api/health', 'GET', true, '*/30 * * * *'),
      ($1, '候選人統計', 'https://backendstep1ne.zeabur.app/api/candidates?limit=1', 'GET', false, NULL),
      ($1, '職缺列表同步', 'https://backendstep1ne.zeabur.app/api/jobs', 'GET', false, NULL)
    `, [projectId]);
    console.log('  ✅ AI Automations');

    // ===== Arch Snapshots =====
    await client.query(`
      INSERT INTO arch_snapshots (project_id, health_data, features_done, features_wip, features_todo, api_count, db_table_count, notes) VALUES
      ($1, $2, 18, 4, 14, 45, 12, '來源：ARCHITECTURE.md（2026-03-11 更新）
技術棧：React 19 + Vite 6 + TypeScript + Tailwind CSS 3
Express 5 + PostgreSQL + Google AI (Gemini)
資料量：1,347 候選人、53 職缺、3 顧問')
    `, [
      projectId,
      JSON.stringify({
        '前端 (React 19)': 95,
        '後端 (Express 5)': 90,
        '資料庫 (PostgreSQL)': 98,
        'AI 整合 (Gemini)': 70,
        '爬蟲系統': 55,
        '安全性': 40,
        '測試覆蓋': 10,
        'CI/CD': 20,
      })
    ]);
    console.log('  ✅ Arch Snapshots');

    console.log('\n🎉 All demo data seeded successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
