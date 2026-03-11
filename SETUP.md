# Agile Hub — 新電腦安裝指南

## 專案簡介

Agile Hub 是內部團隊敏捷管理平台，功能包含：
- 看板式任務管理（拖拉 + 認領）
- Sprint 規劃
- 系統架構儀表板
- 團隊協作（站會紀錄）
- 產品路線圖（季度/月份）
- AI 自動化協作

技術棧：React 19 + Vite 7 + TypeScript + Tailwind CSS 4 + Express 5 + PostgreSQL

---

## 環境需求

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **npm** >= 9
- **Git**
- macOS / Linux / Windows（WSL）

---

## 安裝步驟

### Step 1：安裝系統軟體

**macOS（Homebrew）：**
```bash
brew install node
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu / Debian：**
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows：**
- 安裝 [Node.js](https://nodejs.org/)
- 安裝 [PostgreSQL](https://www.postgresql.org/download/windows/)
- 或使用 WSL2 + Ubuntu 按照 Linux 步驟

---

### Step 2：Clone 專案

```bash
cd ~/Downloads
git clone https://github.com/jacky6658/agile-hub.git
cd agile-hub
npm install
```

---

### Step 3：建立 PostgreSQL 資料庫

```bash
# 查看你的系統使用者名稱
whoami

# 建立資料庫（macOS 預設用系統使用者名稱連線）
createdb agile_hub
```

如果出現權限錯誤，試試：
```bash
# macOS
/usr/local/opt/libpq/bin/createdb -U $(whoami) agile_hub

# Linux（需用 postgres 使用者）
sudo -u postgres createdb agile_hub
sudo -u postgres psql -c "CREATE USER 你的使用者名稱 WITH PASSWORD '你的密碼';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE agile_hub TO 你的使用者名稱;"
```

---

### Step 4：設定環境變數

```bash
cp .env.example .env
```

編輯 `.env` 檔案：

```env
# 前端
VITE_API_URL=http://localhost:3001

# 後端
PORT=3001
NODE_ENV=development

# 資料庫連線字串（根據你的環境修改）
# macOS（通常不需要密碼）：
DATABASE_URL=postgresql://你的使用者名稱@localhost:5432/agile_hub

# Linux（需要密碼）：
# DATABASE_URL=postgresql://你的使用者名稱:你的密碼@localhost:5432/agile_hub
```

> 把「你的使用者名稱」替換成 `whoami` 的結果

---

### Step 5：啟動後端

```bash
node server/server.js
```

看到以下輸出代表成功：
```
✅ Seeded demo project + members
✅ Database tables initialized
📦 Database connected
🚀 Agile Hub API running on http://localhost:3001
   Health: http://localhost:3001/api/health
   Auth:   POST http://localhost:3001/api/auth/login
```

> 首次啟動會自動建立所有資料表 + 寫入預設專案和成員

---

### Step 6：寫入 Demo 資料（首次）

開另一個終端：

```bash
cd ~/Downloads/agile-hub
node server/seed-demo.js
```

看到以下輸出代表成功：
```
📦 Seeding data for project #1...
  ✅ Sprints
  ✅ Tasks (40 items)
  ✅ Roadmap Features (21 items)
  ✅ Standup Notes
  ✅ AI Automations
  ✅ Arch Snapshots
🎉 All demo data seeded successfully!
```

> 只需執行一次，重複執行會跳過（不會重複寫入）

---

### Step 7：啟動前端

```bash
npm run dev
```

看到：
```
VITE v7.x.x ready in xxx ms
➜ Local:   http://localhost:3000/
```

---

### Step 8：開啟瀏覽器

打開 http://localhost:3000

---

## 登入帳號

| 姓名 | Email | 密碼 | 角色 |
|------|-------|------|------|
| Jacky | jacky@step1ne.com | agile123 | Admin |
| Phoebe | phoebe@step1ne.com | agile123 | Member |
| Jim | jim@step1ne.com | agile123 | Member |

> 登入頁有「快速登入」按鈕，點擊人名會自動填入帳密

---

## 對外分享（Cloudflare Tunnel）

如果要讓遠端成員存取：

```bash
# 安裝
brew install cloudflared   # macOS
# 或 sudo apt install cloudflared  # Linux

# 啟動（URL 每次會不同）
cloudflared tunnel --url http://localhost:3000
```

把產生的 `https://xxx.trycloudflare.com` 分享給團隊。

> 注意：需要同時開著前端（port 3000）和後端（port 3001），Vite 會自動把 /api 請求 proxy 到後端。

---

## 專案結構

```
agile-hub/
├── src/                    # 前端 React + TypeScript
│   ├── pages/              # 7 個頁面
│   │   ├── LoginPage.tsx   # 登入
│   │   ├── KanbanPage.tsx  # 看板
│   │   ├── SprintPage.tsx  # Sprint
│   │   ├── ArchDashboardPage.tsx  # 架構儀表板
│   │   ├── TeamPage.tsx    # 團隊協作
│   │   ├── RoadmapPage.tsx # 路線圖
│   │   ├── AIAutomationPage.tsx   # AI 自動化
│   │   └── SettingsPage.tsx       # 設定
│   ├── components/         # 共用元件
│   ├── services/           # API 封裝
│   ├── types.ts            # TypeScript 型別
│   └── App.tsx             # 主程式（路由 + 狀態管理）
│
├── server/                 # 後端 Express + PostgreSQL
│   ├── server.js           # 主程式
│   ├── routes-api.js       # CRUD API（受 JWT 保護）
│   ├── routes-auth.js      # 登入/登出/改密碼
│   ├── init-db.js          # 資料庫初始化（8 張表）
│   └── seed-demo.js        # Demo 資料寫入
│
├── .env.example            # 環境變數範本
├── vite.config.ts          # Vite 設定（含 API proxy）
└── package.json
```

---

## 資料庫結構（8 張表）

| 表名 | 用途 |
|------|------|
| projects | 專案（名稱、API URL、GitHub URL） |
| ah_members | 成員（帳號、密碼、角色） |
| sprints | Sprint（名稱、日期、目標） |
| ah_tasks | 任務（狀態、優先級、負責人） |
| roadmap_features | 路線圖功能（季度、里程碑） |
| standup_notes | 站會紀錄（昨天/今天/阻礙） |
| ai_automations | AI 自動化設定 |
| arch_snapshots | 系統架構快照 |

---

## 常用指令

```bash
# 啟動後端
node server/server.js

# 啟動前端
npm run dev

# 同時啟動（兩個終端）
# 終端 1: node server/server.js
# 終端 2: npm run dev

# TypeScript 檢查
npx tsc --noEmit

# Build 生產版本
npm run build

# 重新寫入 Demo 資料
node server/seed-demo.js
```

---

## 問題排除

### PostgreSQL 連不上
```bash
# 確認 PostgreSQL 正在運行
brew services list | grep postgres  # macOS
sudo systemctl status postgresql    # Linux

# 重新啟動
brew services restart postgresql@16  # macOS
sudo systemctl restart postgresql    # Linux
```

### Port 已被佔用
```bash
# 查看 3000 / 3001 port
lsof -i :3000
lsof -i :3001

# 強制關閉
kill $(lsof -ti :3000)
kill $(lsof -ti :3001)
```

### 資料庫不存在
```bash
createdb agile_hub
# 然後重新啟動後端，會自動建表
```
