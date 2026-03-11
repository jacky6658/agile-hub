# Agile Hub + Step1ne 系統遷移指南

> 本文件供另一台電腦的 AI 或工程師依照步驟完整架設環境

---

## 目錄

1. [系統需求](#1-系統需求)
2. [PostgreSQL 資料庫](#2-postgresql-資料庫)
3. [Agile Hub（敏捷看板）](#3-agile-hub敏捷看板)
4. [Step1ne Headhunter System（獵頭系統）](#4-step1ne-headhunter-system獵頭系統)
5. [Cloudflare Tunnel（外部存取）](#5-cloudflare-tunnel外部存取)
6. [資料庫備份與還原](#6-資料庫備份與還原)
7. [帳號資訊](#7-帳號資訊)
8. [常見問題](#8-常見問題)

---

## 1. 系統需求

| 項目 | 版本 |
|------|------|
| **Node.js** | v22+ (目前使用 v22.22.0) |
| **npm** | v10+ (目前使用 v10.9.4) |
| **PostgreSQL** | 16+ (目前使用 18.1) |
| **Python 3** | 3.10+（Step1ne 的 talent-sourcing 需要） |
| **Git** | 最新版 |
| **作業系統** | macOS / Linux / Windows (WSL) |

---

## 2. PostgreSQL 資料庫

### 2.1 安裝 PostgreSQL

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 建立資料庫

#### Agile Hub 資料庫

```bash
# 建立資料庫（使用你的系統用戶名）
createdb agile_hub

# 驗證
psql -d agile_hub -c "SELECT 1;"
```

> **注意**：Agile Hub 的表會在 server 啟動時自動建立（`server/init-db.js`），不需要手動建表。

#### Step1ne 資料庫

Step1ne 預設連線到 Zeabur 雲端資料庫（見 .env 設定）。如果要用本地資料庫：

```bash
createdb step1ne

# 初始化 schema
cd step1ne-headhunter-system-main
psql -d step1ne -f server/db/init-full-schema.sql
```

### 2.3 Agile Hub 資料庫結構（9 張表）

| 表名 | 用途 |
|------|------|
| `projects` | 專案（名稱、描述、GitHub URL） |
| `ah_members` | 團隊成員（email、密碼 hash、角色） |
| `ah_tasks` | 任務卡片（標題、狀態、優先級、指派人） |
| `sprints` | Sprint 排程 |
| `roadmap_features` | 產品路線圖 |
| `standup_notes` | 每日站會紀錄 |
| `ai_automations` | AI 自動化設定 |
| `arch_snapshots` | 系統架構快照 |
| `task_activities` | 操作歷史紀錄 |

### 2.4 Step1ne 資料庫結構（核心表）

| 表名 | 用途 |
|------|------|
| `candidates` | 人選完整資料（361+ 筆） |
| `candidates_pipeline` | 人選進度追蹤 |
| `jobs` | 職缺資訊（53+ 筆） |
| `google_sheets_sync_log` | Google Sheets 同步紀錄 |
| `sync_tracker` | 同步中繼資料 |

---

## 3. Agile Hub（敏捷看板）

### 3.1 取得程式碼

```bash
git clone https://github.com/jacky6658/agile-hub.git
cd agile-hub
```

### 3.2 安裝依賴

```bash
npm install
```

### 3.3 環境變數

建立 `.env` 檔案（根目錄）：

```env
# Frontend
VITE_API_URL=http://localhost:3001

# Backend
PORT=3001
DATABASE_URL=postgresql://你的用戶名@localhost:5432/agile_hub
NODE_ENV=development
```

> **重要**：`DATABASE_URL` 裡的用戶名要改成你的系統用戶名（macOS 通常是 `whoami` 的結果）。如果 PostgreSQL 有設密碼，格式為：
> `postgresql://用戶名:密碼@localhost:5432/agile_hub`

### 3.4 啟動服務

需要兩個終端：

```bash
# Terminal 1: 後端 API Server (port 3001)
node server/server.js

# Terminal 2: 前端 Vite Dev Server (port 3000)
npm run dev
```

啟動後端時，`init-db.js` 會自動建立所有資料表。

### 3.5 初始化種子資料（首次部署）

後端啟動後，`seed-demo.js` 會自動插入預設成員和專案。如果需要手動執行：

```bash
node server/seed-demo.js
```

### 3.6 存取

- **前端**：http://localhost:3000
- **後端 API**：http://localhost:3001/api
- **健康檢查**：http://localhost:3001/api/health

### 3.7 技術棧

- **前端**：React 19 + Vite 7 + TypeScript + Tailwind CSS 4
- **後端**：Express 5 + PostgreSQL (pg)
- **認證**：JWT（jsonwebtoken + bcryptjs）

### 3.8 Vite Proxy 設定

`vite.config.ts` 已設定 `/api` 代理到 `localhost:3001`，開發時前後端分離但透過 proxy 串接。

---

## 4. Step1ne Headhunter System（獵頭系統）

### 4.1 取得程式碼

```bash
git clone https://github.com/jacky6658/step1ne-headhunter-system.git
cd step1ne-headhunter-system
```

### 4.2 安裝依賴

```bash
npm install
# postinstall 會自動安裝 Python 依賴（talent-sourcing）
```

如果 Python 依賴安裝失敗：

```bash
pip3 install -r server/talent-sourcing/requirements.txt
```

### 4.3 環境變數

建立 `.env` 檔案（根目錄）：

```env
# API Base URL
VITE_API_URL=http://localhost:3001

# Google Sheets 同步（視需要）
SHEET_ID=你的Google_Sheet_ID
GOOGLE_ACCOUNT=你的Google帳號

# Database（二選一）
# 選項 A：使用 Zeabur 雲端資料庫（目前生產環境）
DATABASE_URL=postgresql://root:etUh2zkR4Mr8gfWLs059S7Dm1T6Yby3Q@tpe1.clusters.zeabur.com:27883/zeabur

# 選項 B：使用本地資料庫
# DATABASE_URL=postgresql://你的用戶名@localhost:5432/step1ne

# Perplexity AI（深度分析功能需要）
PERPLEXITY_API_KEY=你的API_Key

# Server
PORT=3001
NODE_ENV=development
```

### 4.4 啟動服務

```bash
# Terminal 1: 後端 (port 3001)
npm run backend
# 或
node server/server.js

# Terminal 2: 前端 (port 3000 或 3002)
npm run dev
```

> **注意**：如果 Agile Hub 已佔用 port 3000，Step1ne 前端會自動用 3002。兩個系統的後端都預設 3001，**不能同時跑兩個後端**，除非改 PORT。

### 4.5 同時運行兩個系統

如果要同時跑 Agile Hub 和 Step1ne：

```bash
# Agile Hub 後端：port 3001
cd agile-hub && PORT=3001 node server/server.js

# Agile Hub 前端：port 3000
cd agile-hub && npm run dev

# Step1ne 後端：port 3002
cd step1ne-headhunter-system && PORT=3002 node server/server.js

# Step1ne 前端：port 3003
cd step1ne-headhunter-system && VITE_API_URL=http://localhost:3002 npm run dev -- --port 3003
```

或修改各自的 `.env` 避免衝突。

### 4.6 技術棧

- **前端**：React 19 + Vite 6 + Tailwind CSS 3
- **後端**：Express 5 + PostgreSQL
- **AI 整合**：Google Gemini (@google/genai)、Perplexity AI
- **文件處理**：pdf-parse、xlsx、tesseract.js、jspdf
- **外部連接**：Google Sheets 雙向同步

---

## 5. Cloudflare Tunnel（外部存取）

讓外部可透過 HTTPS 存取本地服務：

### 5.1 安裝

```bash
# macOS
brew install cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared
sudo mv cloudflared /usr/local/bin/
```

### 5.2 啟動 Tunnel

```bash
# 將 localhost:3000 暴露到外部
cloudflared tunnel --url http://localhost:3000
```

會產生一個隨機 URL 如：`https://xxx-xxx-xxx.trycloudflare.com`

> Vite 已設定允許 `.trycloudflare.com` 域名（`vite.config.ts` 裡的 `allowedHosts`）。

---

## 6. 資料庫備份與還原

### 6.1 從舊電腦匯出

```bash
# 匯出 Agile Hub 資料庫（含資料）
pg_dump -U user -d agile_hub --no-owner --no-acl > agile_hub_backup.sql

# 匯出 Step1ne 本地資料庫（如果有用本地的話）
pg_dump -U user -d step1ne --no-owner --no-acl > step1ne_backup.sql
```

> `--no-owner --no-acl` 確保在新電腦上用不同的系統用戶也能還原。

### 6.2 在新電腦還原

```bash
# 建立資料庫
createdb agile_hub

# 還原
psql -d agile_hub < agile_hub_backup.sql

# 驗證
psql -d agile_hub -c "SELECT count(*) FROM ah_tasks;"
# 應該顯示 49
```

### 6.3 只匯出資料（不含 schema）

如果想讓 server 自動建表，只匯出資料：

```bash
pg_dump -U user -d agile_hub --data-only --no-owner > agile_hub_data.sql
```

還原時先啟動 server 讓它建表，再匯入資料：

```bash
node server/server.js  # 建表
# Ctrl+C 停掉
psql -d agile_hub < agile_hub_data.sql
node server/server.js  # 重新啟動
```

---

## 7. 帳號資訊

### Agile Hub 登入帳號

| 姓名 | Email | 密碼 | 角色 |
|------|-------|------|------|
| Jacky | jacky@step1ne.com | agile123 | admin |
| Phoebe | phoebe@step1ne.com | agile123 | member |
| Jim | jim@step1ne.com | agile123 | member |
| Test User | test@step1ne.com | newpass123 | member |

> 密碼以 bcrypt（10 rounds）儲存在 `ah_members.password_hash`。

### GitHub 倉庫

| 系統 | 倉庫 URL |
|------|----------|
| Agile Hub | https://github.com/jacky6658/agile-hub.git |
| Step1ne Headhunter | https://github.com/jacky6658/step1ne-headhunter-system.git |
| Headhunter Crawler | https://github.com/jacky6658/headhunter-crawler.git |

---

## 8. 常見問題

### Q: 啟動後端出現 database "agile_hub" does not exist

```bash
createdb agile_hub
```

### Q: 連線被拒 (connection refused)

確認 PostgreSQL 正在運行：

```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

### Q: 前端出現白畫面

1. 開瀏覽器 DevTools → Console 看錯誤
2. 確認後端有在跑（`curl http://localhost:3001/api/health`）
3. 確認 `.env` 的 `VITE_API_URL` 正確

### Q: npm install 失敗

```bash
# 清除 cache
rm -rf node_modules package-lock.json
npm install
```

### Q: Port 已被佔用

```bash
# 查看誰佔了 3001
lsof -i :3001

# 殺掉 process
kill -9 <PID>
```

### Q: Agile Hub 看板沒有顯示卡片

1. 確認 API 有回傳資料：`curl http://localhost:3001/api/tasks?project_id=1`
2. 如果是空的，可能資料庫還沒還原 → 匯入 backup
3. 如果 API 有資料但前端沒顯示 → 清瀏覽器快取 + 重整

---

## 快速啟動 Checklist

```
[ ] 1. 安裝 Node.js v22+, PostgreSQL, Python 3, Git
[ ] 2. git clone 兩個倉庫
[ ] 3. createdb agile_hub
[ ] 4. 還原 agile_hub_backup.sql（或讓 server 自動建表+seed）
[ ] 5. 兩個專案都 npm install
[ ] 6. 設定 .env 檔案（注意 DATABASE_URL 的用戶名）
[ ] 7. 啟動 Agile Hub 後端 → node server/server.js
[ ] 8. 啟動 Agile Hub 前端 → npm run dev
[ ] 9. 瀏覽 http://localhost:3000 → 用 jacky@step1ne.com / agile123 登入
[ ] 10. （可選）啟動 Cloudflare Tunnel
[ ] 11. （可選）啟動 Step1ne 系統
```
