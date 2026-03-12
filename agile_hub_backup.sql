--
-- PostgreSQL database dump
--

\restrict tlOw0beqVhrfHQkzYYU3EGu36ShDaWutu3IMK3tIEp8SP94bDyiTLBftyjuargg

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ah_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ah_members (
    id integer NOT NULL,
    display_name character varying(100) NOT NULL,
    email character varying(200),
    avatar character varying(500),
    role character varying(20) DEFAULT 'member'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    password_hash character varying(200)
);


--
-- Name: ah_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ah_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ah_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ah_members_id_seq OWNED BY public.ah_members.id;


--
-- Name: ah_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ah_tasks (
    id integer NOT NULL,
    project_id integer,
    sprint_id integer,
    title character varying(300) NOT NULL,
    description text,
    status character varying(30) DEFAULT 'backlog'::character varying,
    priority character varying(10) DEFAULT 'P2'::character varying,
    assignee_id integer,
    reporter_id integer,
    labels text[] DEFAULT '{}'::text[],
    estimated_hours numeric(5,1),
    actual_hours numeric(5,1),
    due_date date,
    sort_order integer DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    spec text
);


--
-- Name: ah_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ah_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ah_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ah_tasks_id_seq OWNED BY public.ah_tasks.id;


--
-- Name: ai_automations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_automations (
    id integer NOT NULL,
    project_id integer,
    name character varying(200) NOT NULL,
    api_endpoint character varying(500),
    method character varying(10) DEFAULT 'POST'::character varying,
    payload jsonb,
    schedule character varying(50),
    enabled boolean DEFAULT false,
    last_run_at timestamp with time zone,
    last_run_status character varying(20),
    last_run_log text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ai_automations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_automations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_automations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_automations_id_seq OWNED BY public.ai_automations.id;


--
-- Name: arch_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.arch_snapshots (
    id integer NOT NULL,
    project_id integer,
    health_data jsonb,
    features_done integer DEFAULT 0,
    features_wip integer DEFAULT 0,
    features_todo integer DEFAULT 0,
    api_count integer DEFAULT 0,
    db_table_count integer DEFAULT 0,
    notes text,
    snapshot_at timestamp with time zone DEFAULT now()
);


--
-- Name: arch_snapshots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.arch_snapshots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: arch_snapshots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.arch_snapshots_id_seq OWNED BY public.arch_snapshots.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    api_base_url character varying(500),
    health_url character varying(500),
    repo_url character varying(500),
    icon character varying(10),
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: roadmap_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_features (
    id integer NOT NULL,
    project_id integer,
    title character varying(300) NOT NULL,
    description text,
    quarter character varying(10),
    priority character varying(10) DEFAULT 'P2'::character varying,
    status character varying(20) DEFAULT 'planned'::character varying,
    milestone character varying(100),
    depends_on integer[],
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: roadmap_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roadmap_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roadmap_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roadmap_features_id_seq OWNED BY public.roadmap_features.id;


--
-- Name: sprints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sprints (
    id integer NOT NULL,
    project_id integer,
    name character varying(100) NOT NULL,
    goal text,
    start_date date,
    end_date date,
    status character varying(20) DEFAULT 'planning'::character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: sprints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sprints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sprints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sprints_id_seq OWNED BY public.sprints.id;


--
-- Name: standup_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.standup_notes (
    id integer NOT NULL,
    project_id integer,
    member_id integer,
    date date DEFAULT CURRENT_DATE,
    yesterday text,
    today text,
    blockers text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: standup_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.standup_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: standup_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.standup_notes_id_seq OWNED BY public.standup_notes.id;


--
-- Name: task_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_activities (
    id integer NOT NULL,
    task_id integer,
    project_id integer,
    actor_id integer,
    actor_name character varying(100),
    action character varying(50) NOT NULL,
    detail text,
    old_value character varying(200),
    new_value character varying(200),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: task_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.task_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: task_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.task_activities_id_seq OWNED BY public.task_activities.id;


--
-- Name: ah_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_members ALTER COLUMN id SET DEFAULT nextval('public.ah_members_id_seq'::regclass);


--
-- Name: ah_tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks ALTER COLUMN id SET DEFAULT nextval('public.ah_tasks_id_seq'::regclass);


--
-- Name: ai_automations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_automations ALTER COLUMN id SET DEFAULT nextval('public.ai_automations_id_seq'::regclass);


--
-- Name: arch_snapshots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.arch_snapshots ALTER COLUMN id SET DEFAULT nextval('public.arch_snapshots_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: roadmap_features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features ALTER COLUMN id SET DEFAULT nextval('public.roadmap_features_id_seq'::regclass);


--
-- Name: sprints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sprints ALTER COLUMN id SET DEFAULT nextval('public.sprints_id_seq'::regclass);


--
-- Name: standup_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standup_notes ALTER COLUMN id SET DEFAULT nextval('public.standup_notes_id_seq'::regclass);


--
-- Name: task_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities ALTER COLUMN id SET DEFAULT nextval('public.task_activities_id_seq'::regclass);


--
-- Data for Name: ah_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ah_members (id, display_name, email, avatar, role, created_at, password_hash) FROM stdin;
1	Jacky	jacky@step1ne.com	\N	admin	2026-03-11 18:00:21.434369+08	$2b$10$EKxvW05EZINdbr0VhiqfZeSu/2ikQVLF5KC8mikQ/R/e2huMAImRG
2	Phoebe	phoebe@step1ne.com	\N	member	2026-03-11 18:00:21.434369+08	$2b$10$EKxvW05EZINdbr0VhiqfZeSu/2ikQVLF5KC8mikQ/R/e2huMAImRG
3	Jim	jim@step1ne.com	\N	member	2026-03-11 18:00:21.434369+08	$2b$10$EKxvW05EZINdbr0VhiqfZeSu/2ikQVLF5KC8mikQ/R/e2huMAImRG
4	Test User	test@step1ne.com	\N	member	2026-03-11 19:32:48.46949+08	$2b$10$j9lf7OMxnLCn/YPFs8Rbr.ZQAXy1CYaleOqog5wTa.Lc6nmv39K6K
\.


--
-- Data for Name: ah_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ah_tasks (id, project_id, sprint_id, title, description, status, priority, assignee_id, reporter_id, labels, estimated_hours, actual_hours, due_date, sort_order, notes, created_at, updated_at, spec) FROM stdin;
49	1	\N	讓系統了解職缺與人選認知（加速顧問作業、減少學習成本）	\N	todo	P1	1	\N	{AI,核心,UX}	\N	\N	\N	0	\N	2026-03-11 21:12:19.822011+08	2026-03-11 21:13:20.761563+08	## 功能需求\n讓系統內建「職缺知識」與「人選認知」，新顧問打開系統就能快速理解每個職缺在找什麼人、每個人選的核心價值，不用逐筆閱讀所有資料。\n\n## 痛點\n- 新顧問接手職缺時，需花大量時間閱讀 JD、了解客戶文化、搞懂選才標準\n- 人選資料散落在多個欄位（履歷、工作經歷、GitHub、AI 報告），沒有統整摘要\n- 既有的 company_profile / talent_profile 欄位需手動填寫，多數為空\n\n## 現有基礎\n- **jobs_pipeline** 已有：`job_description`、`talent_profile`（理想人選畫像）、`company_profile`（企業文化）、`key_skills`、`search_primary/secondary`\n- **candidates_pipeline** 已有：`ai_report`、`ai_match_result`（JSONB）、`work_history`（JSONB）、`personality_type`\n- **personaService.js**：Python 腳本產生候選人/公司畫像 + 配對（目前未串前端觸發）\n- **perplexityService.js**：可查詢候選人/公司公開資訊\n- **gradingService.js**：規則引擎自動評等\n\n## 執行步驟\n\n### A. 職缺認知摘要（Job Intelligence Card）\n1. 新增 API `POST /api/jobs/:id/generate-summary`\n   - 讀取 JD + company_profile + talent_profile + key_skills\n   - 呼叫 AI（Perplexity 或 OpenAI）產生結構化摘要：\n     - 🎯 這個職缺在找什麼人（一句話）\n     - 📋 必備條件 vs 加分條件\n     - 🏢 公司文化/團隊風格\n     - ⚠️ 選才地雷（不適合的人選特徵）\n     - 💰 薪資競爭力分析（對比市場）\n   - 結果存入 `jobs_pipeline.ai_summary`（新增 TEXT 欄位）\n2. 前端 JobsPage.tsx 職缺詳情加「AI 摘要」區塊\n   - 若 ai_summary 為空，顯示「產生 AI 摘要」按鈕\n   - 有摘要時直接展示，支援重新產生\n\n### B. 人選認知摘要（Candidate Intelligence Card）\n1. 新增 API `POST /api/candidates/:id/generate-summary`\n   - 整合：履歷 + work_history + ai_report + GitHub 分析 + 技能\n   - AI 產生結構化摘要：\n     - 👤 一句話描述這個人\n     - 💪 核心競爭力（3-5 點）\n     - 🔄 職涯軌跡（穩定度 + 成長趨勢）\n     - 🎯 最適合的職缺類型\n     - ⚡ 快速判斷：推薦 / 觀望 / 不推薦\n   - 結果存入 `candidates_pipeline.ai_summary`（新增 TEXT 欄位）\n2. 前端 CandidateModal.tsx 卡片頂部加「AI 摘要」\n   - 摺疊區塊，預設展開\n   - 一眼看完這個人選的核心價值\n\n### C. 職缺 ↔ 人選 快速配對理由\n1. 在 AI 配對頁 (AIMatchingPage)，每筆配對結果附帶「為什麼推薦」\n   - 現有 ai_match_result 已有分數，但缺乏人話解釋\n   - 新增 `match_reason` 欄位（一段自然語言說明）\n\n### D. 新顧問 Onboarding 儀表板（選做）\n1. 登入後首頁加「快速上手」區塊\n   - 顯示目前最活躍的 3 個職缺 + AI 摘要\n   - 顯示最近匯入的 5 個人選 + AI 摘要\n   - 「本週待辦」清單\n\n## 驗收標準（AC）\n- [ ] 職缺詳情頁可一鍵產生 AI 摘要，顯示結構化卡片\n- [ ] 候選人 Modal 頂部顯示 AI 摘要，新顧問 3 秒內理解人選\n- [ ] AI 配對結果含自然語言推薦理由\n- [ ] 已有 company_profile / talent_profile 的職缺，AI 摘要整合這些資訊\n- [ ] 沒有任何欄位資料的職缺/人選，AI 摘要顯示「資料不足，請補充」\n\n## 技術備註\n- AI 摘要用 Perplexity（已有 service）或串 OpenAI，prompt 需中文輸出\n- 摘要結果快取到 DB 欄位，不重複呼叫 API（除非手動重新產生）\n- personaService.js 的 Python 畫像邏輯可做為 fallback 或整合來源\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
43	1	2	移除 Leads 案件管理功能	\N	done	P2	1	\N	{前端,後端,清理}	\N	\N	\N	43	移除 Leads module + talent-sourcing Python 腳本	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.095328+08	## 功能需求\n移除 Leads（案件管理）功能，簡化系統。業務功能已由 BD 客戶管理取代。\n\n## 已實作內容\n- **移除**：Leads 相關頁面和路由\n- **替代**：BDClientsPage.tsx 已承接客戶開發追蹤功能\n\n## 驗收標準（AC）\n- [x] Leads 路由已移除\n- [x] Sidebar 連結已移除\n- [x] BD 客戶管理功能完整替代\n\n## 技術備註\n- Leads 原先用途與 BD 客戶管理重疊\n- DB 中 leads 相關表可保留但不再使用\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
2	1	1	候選人卡片 Phase 1（年齡/產業/語言/證照/薪資）	\N	done	P0	1	\N	{前端,核心}	\N	\N	\N	1	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.87246+08	## 功能需求\n候選人卡片第一階段，顯示核心資訊：年齡、產業經驗、語言能力、證照、薪資範圍。\n\n## 已實作內容\n- **前端**：components/CandidateModal.tsx 上半部卡片區域\n- **欄位**：年齡（自動計算）、產業（Chip 標籤）、語言（多語言列表）、證照（Chip）、期望/目前薪資\n\n## 驗收標準（AC）\n- [x] 卡片顯示所有 Phase 1 欄位\n- [x] 年齡根據出生年自動計算\n- [x] 產業經驗以標籤形式展示\n- [x] 薪資範圍可編輯\n\n## 技術備註\n- 年齡計算：utils/dateFormat.ts\n- 產業/語言/證照用 multi-select chip 元件\n- 薪資格式：數字 + K（如 80K-120K）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
12	1	1	GitHub 分析整合	\N	done	P2	1	\N	{API,AI}	\N	\N	\N	11	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.931286+08	## 功能需求\n透過 GitHub API 分析候選人的技術能力，包含 repo 數量、語言分佈、貢獻頻率等。\n\n## 已實作內容\n- **後端**：server/githubAnalysisService.js\n- **功能**：\n  - 輸入 GitHub URL → 抓取公開 profile 和 repos\n  - 分析：語言分佈、星星數、commit 頻率、貢獻圖\n  - 結果存入候選人備註/報告\n- **欄位**：candidates_pipeline.github_url\n\n## 驗收標準（AC）\n- [x] 輸入 GitHub URL 觸發分析\n- [x] 語言分佈統計正確\n- [x] 分析結果可查看\n\n## 技術備註\n- GitHub REST API v3\n- 無需 token 可抓公開資料（rate limit 60/hr）\n- 有 token 可提升到 5000/hr\n- 分析結果影響五維雷達「技術能力」維度\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
17	1	1	營運儀表板	\N	done	P1	1	\N	{前端}	\N	\N	\N	16	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.979733+08	## 功能需求\n營運數據儀表板，呈現關鍵指標：候選人數量、Pipeline 漏斗、職缺狀態、顧問績效等。\n\n## 已實作內容\n- **前端**：pages/OperationsDashboardPage.tsx\n- **指標**：\n  - 候選人總數 / 本月新增\n  - Pipeline 各階段人數\n  - 職缺統計（開放/已關閉）\n  - 顧問推薦數排名\n  - 成交率\n\n## 驗收標準（AC）\n- [x] 儀表板數據正確顯示\n- [x] 圖表渲染正常\n- [x] 數據即時更新\n- [x] 支援時間範圍篩選\n\n## 技術備註\n- 數據從多個 API 聚合\n- 圖表可能用 Canvas 或 SVG\n- 重要 KPI：推薦數、面試率、成交率、平均結案天數\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
34	1	\N	API Rate Limiting	\N	backlog	P2	\N	\N	{後端,安全}	\N	\N	\N	33	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.051792+08	## 功能需求\n為所有 API 端點加入 Rate Limiting，防止暴力破解、DDoS 攻擊和 API 濫用。\n\n## 執行步驟\n1. 安裝 express-rate-limit 套件\n2. 全域限制：\n   - 所有 API：100 requests / 15 min per IP\n   - 套用到 app.use("/api", limiter)\n3. 針對性限制：\n   - 登入 API：5 requests / 15 min per IP（防暴力破解）\n   - 履歷解析：10 requests / hour per user（AI API 成本）\n   - AI 配對：20 requests / hour per user\n4. 回應格式：\n   - 429 Too Many Requests\n   - 回傳 Retry-After header\n   - JSON body: { error: "請求過於頻繁，請稍後再試" }\n5. 進階（可選）：\n   - Redis store（多實例共享計數）\n   - 白名單 IP（內部服務）\n   - 依 user role 不同限制（admin 較寬鬆）\n6. 前端處理：\n   - 收到 429 時顯示友善提示\n   - 自動 retry with backoff\n\n## 驗收標準（AC）\n- [ ] 全域 rate limit 正常運作\n- [ ] 登入 API 5 次失敗後鎖定\n- [ ] 429 回應格式正確\n- [ ] 前端有 429 處理\n- [ ] 正常使用不會觸發限制\n\n## 技術備註\n- express-rate-limit 預設用 memory store\n- Production 建議用 rate-limit-redis\n- Zeabur 部署需注意 proxy 後的真實 IP（trust proxy）\n- X-Forwarded-For header 處理\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
6	1	1	履歷解析（LinkedIn / 104）	\N	done	P0	1	\N	{後端,AI}	\N	\N	\N	5	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.908646+08	## 功能需求\n上傳 LinkedIn PDF 或 104 HTML 履歷，自動解析並填入候選人欄位。\n\n## 已實作內容\n- **前端**：pages/ResumeImportPage.tsx（上傳頁面 + 解析結果預覽）\n- **後端**：server/resumeService.js（解析核心邏輯）、server/resumePDFService.js（PDF 處理）\n- **支援格式**：LinkedIn PDF、104 HTML export\n- **解析欄位**：姓名、職稱、公司、學歷、技能、工作經歷\n\n## 驗收標準（AC）\n- [x] LinkedIn PDF 上傳 → 自動解析\n- [x] 104 HTML 上傳 → 自動解析\n- [x] 解析結果可預覽和修正\n- [x] 確認後自動建立候選人\n\n## 技術備註\n- PDF 解析：pdf-parse 套件\n- HTML 解析：cheerio\n- v2 API 使用 OpenAI 輔助結構化\n- 上傳用 multer（memory storage，Zeabur 友善）\n- 檔案大小限制 10MB（server.js 已設定）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
50	1	\N	AI 提示詞資料庫（人選認知 / 職缺分析 Prompt Library）	\N	todo	P1	1	\N	{AI,核心,UX}	\N	\N	\N	0	\N	2026-03-11 21:14:59.842401+08	2026-03-11 21:16:12.351713+08	## 功能需求\n建立系統內建的 AI 提示詞資料庫（Prompt Library），讓顧問可以：\n1. 從預設模板庫選取提示詞，帶入人選/職缺資料一鍵執行 AI 分析\n2. 自訂、儲存、分享常用的提示詞模板\n3. 分類管理提示詞：人選認知類、職缺分析類、配對類、報告類\n\n## 痛點\n- 目前系統的 AI 功能（Perplexity、評分、配對）都是硬編碼的 prompt，顧問無法自訂\n- server/perplexityService.js 的 systemPrompt 寫死在程式裡，每次修改要改 code 重部署\n- 不同顧問有不同的分析習慣，無法個人化 prompt\n- 好的 prompt 無法在團隊間共享\n\n## 現有基礎\n- **perplexityService.js**：已有 `callPerplexity(systemPrompt, userPrompt)` 通用呼叫函式\n- **server/guides/**：6 份 AI 操作指南（RESUME-ANALYSIS、SCORING 等），可轉為預設模板\n- **docs/ai-prompts/**：2 份 AI 模組文件，包含提示詞範例\n- **gradingService.js**：評分規則引擎（可做為 prompt 變數來源）\n- **personaService.js**：畫像產生 Python 腳本（prompt 在 .py 內）\n\n## 執行步驟\n\n### 1. 資料庫設計\n新增 `prompt_templates` 表：\n```sql\nCREATE TABLE prompt_templates (\n  id SERIAL PRIMARY KEY,\n  title VARCHAR(100) NOT NULL,          -- 模板名稱\n  category VARCHAR(50) NOT NULL,        -- 分類：candidate / job / matching / report\n  description TEXT,                      -- 用途說明\n  system_prompt TEXT NOT NULL,           -- System prompt 內容\n  user_prompt_template TEXT NOT NULL,    -- User prompt 模板（含 {{變數}} 佔位符）\n  variables JSONB DEFAULT '[]',         -- 可用變數清單 [{"key":"name","label":"人選姓名","source":"candidate.name"}]\n  is_system BOOLEAN DEFAULT false,      -- 系統預設（不可刪除）\n  created_by INTEGER REFERENCES ah_members(id),\n  is_shared BOOLEAN DEFAULT true,       -- 是否共享給團隊\n  usage_count INTEGER DEFAULT 0,        -- 使用次數（排序用）\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n```\n\n### 2. 後端 API\n- `GET /api/prompts` — 列出所有模板（支援 ?category= 篩選）\n- `POST /api/prompts` — 新增模板\n- `PATCH /api/prompts/:id` — 編輯模板\n- `DELETE /api/prompts/:id` — 刪除（系統預設不可刪）\n- `POST /api/prompts/:id/execute` — 執行模板\n  - body: `{ candidate_id?, job_id? }` \n  - 後端自動代入變數 → 呼叫 callPerplexity → 回傳結果\n  - usage_count++\n\n### 3. 預設模板（Seed Data）\n\n**人選認知類：**\n- 「人選核心競爭力分析」— 帶入 work_history + skills → AI 輸出重點摘要\n- 「人選穩定度評估」— 帶入 job_changes + avg_tenure → AI 判斷風險\n- 「人選面試準備包」— 帶入履歷 → AI 產出建議面試問題\n- 「人選推薦信撰寫」— 帶入人選資料 → AI 產出推薦信草稿\n\n**職缺分析類：**\n- 「職缺重點摘要」— 帶入 JD + company_profile → 結構化摘要\n- 「理想人才畫像產生」— 帶入 JD → AI 生成 talent_profile\n- 「職缺薪資競爭力」— 帶入職缺條件 → AI 分析市場水準\n- 「面試流程建議」— 帶入職缺 → AI 建議面試關卡\n\n**配對類：**\n- 「人選 vs 職缺適配分析」— 帶入雙方資料 → AI 輸出匹配報告\n- 「推薦理由撰寫」— 帶入配對結果 → AI 寫推薦信給客戶\n\n### 4. 前端 UI\n\n**A. Prompt Library 管理頁（新頁面或 Settings 子頁）**\n- 模板卡片列表，按分類 tab 切換\n- 每張卡片：標題 + 分類標籤 + 使用次數 + 編輯/刪除\n- 「新增模板」按鈕 → 表單：標題、分類、system prompt、user prompt template、變數設定\n\n**B. 快速執行入口**\n- CandidateModal.tsx：加「AI 分析」下拉選單 → 列出 candidate 類模板 → 選擇後一鍵執行\n- JobsPage.tsx：職缺詳情加「AI 分析」按鈕 → 列出 job 類模板\n- AIMatchingPage.tsx：配對結果旁加「產生推薦理由」按鈕\n\n**C. 執行結果面板**\n- 執行後彈出結果 Modal，顯示 AI 輸出\n- 可「複製到剪貼板」或「存入人選/職缺備註」\n\n### 5. 變數系統\n模板中的 `{{變數}}` 自動替換：\n- `{{candidate.name}}` → 人選姓名\n- `{{candidate.skills}}` → 技能\n- `{{candidate.work_history}}` → 工作經歷 JSON\n- `{{candidate.ai_report}}` → 現有 AI 報告\n- `{{job.title}}` → 職缺名稱\n- `{{job.job_description}}` → JD 全文\n- `{{job.company_profile}}` → 企業畫像\n- `{{job.talent_profile}}` → 人才畫像\n- `{{job.key_skills}}` → 關鍵技能\n\n## 驗收標準（AC）\n- [ ] 系統預設 10+ 個提示詞模板（人選/職缺/配對各類）\n- [ ] 顧問可在人選 Modal 選模板 → 一鍵 AI 分析 → 看結果\n- [ ] 顧問可在職缺頁選模板 → 一鍵 AI 分析 → 看結果\n- [ ] 可新增/編輯/刪除自訂模板，支援 {{變數}} 自動替換\n- [ ] 模板執行結果可複製或存回系統欄位\n- [ ] perplexityService.js 的 callPerplexity() 作為統一 AI 執行引擎\n\n## 技術備註\n- 後端 callPerplexity(systemPrompt, userPrompt) 已是通用函式，Prompt Library 直接調用\n- 變數替換在後端做（安全），不在前端拼接\n- 未來可擴展支援 OpenAI / Claude 等多模型切換\n- 預設模板用 seed SQL 或啟動時自動建立（類似現有的 ALTER TABLE migration 模式）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
25	1	2	驗證履歷匯入工作經歷解析	\N	todo	P0	1	\N	{後端,AI}	\N	\N	\N	24	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.018472+08	## 功能需求\n驗證並修復履歷解析 v2 API 對工作經歷的解析正確性，確保 LinkedIn/104 履歷匯入後工作經歷欄位完整。\n\n## 執行步驟\n1. 準備 3 份測試履歷：LinkedIn PDF、104 HTML、一般 PDF 履歷\n2. 透過拖放匯入功能上傳每份履歷\n3. 檢查解析結果中的工作經歷欄位：\n   - 公司名稱\n   - 職位名稱\n   - 任職期間（起迄日）\n   - 工作描述\n4. 對比原始履歷與解析結果，標記遺漏或錯誤\n5. 若有解析錯誤，檢查 resume-parser service 的正則/AI prompt\n6. 修復解析邏輯，重新測試\n7. 補充邊界案例：多段工作經歷、跨國經歷、空白期間\n\n## 驗收標準（AC）\n- [ ] LinkedIn PDF 工作經歷正確解析（公司/職位/期間/描述）\n- [ ] 104 HTML 工作經歷正確解析\n- [ ] 一般 PDF 至少 80% 欄位正確\n- [ ] 多段工作經歷（3+）能全部解析\n- [ ] 解析失敗時有明確錯誤提示\n\n## 技術備註\n- v2 API 已修復基本解析，但工作經歷部分需人工驗證\n- 注意日期格式差異（2020/01 vs Jan 2020 vs 2020年1月）\n- 104 履歷的 HTML 結構可能隨時變動\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
7	1	1	拖放匯入履歷	\N	done	P1	1	\N	{前端,UX}	\N	\N	\N	6	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.912147+08	## 功能需求\n支援拖放（Drag & Drop）上傳履歷檔案，簡化操作流程。\n\n## 已實作內容\n- **前端**：ResumeImportPage.tsx 中的拖放區域\n- **功能**：拖放 PDF → 自動觸發上傳 → 解析 → 預覽\n- **支援**：單檔拖放、點擊選檔\n\n## 驗收標準（AC）\n- [x] 拖放 PDF 到指定區域觸發上傳\n- [x] 拖入時有視覺回饋（邊框變色）\n- [x] 檔案格式驗證（僅 PDF）\n- [x] 上傳中顯示進度\n\n## 技術備註\n- 用 HTML5 Drag & Drop API\n- onDragOver/onDrop 事件處理\n- 搭配 multer memory storage 上傳\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
8	1	1	職缺管理 CRUD + 狀態追蹤	\N	done	P0	1	\N	{後端,核心}	\N	\N	\N	7	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.916317+08	## 功能需求\n完整職缺管理系統，含 CRUD 操作和狀態追蹤（開放中/暫停/已關閉）。\n\n## 已實作內容\n- **前端**：pages/JobsPage.tsx（列表 + 編輯）\n- **後端**：server/jobsService.js + routes-api.js（/api/jobs CRUD）\n- **功能**：職缺建立/編輯/刪除、狀態切換、關聯 BD 客戶、104/1111 URL 欄位\n\n## 主要欄位\n職稱、公司（關聯 BD 客戶）、薪資範圍、工作地點、工作內容、要求條件、職缺狀態、104 URL、1111 URL、負責顧問、建立時間\n\n## 驗收標準（AC）\n- [x] 職缺 CRUD 正常\n- [x] 狀態追蹤（開放→暫停→關閉）\n- [x] 關聯 BD 客戶\n- [x] 104/1111 URL 欄位\n\n## 技術備註\n- 職缺表：jobs（PostgreSQL）\n- 狀態影響 AI 配對（只配對開放中職缺）\n- jobsService.js 處理業務邏輯\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
24	1	2	修復 vite.config 暴露所有環境變數	\N	todo	P0	1	\N	{安全,緊急}	\N	\N	\N	23	vite.config.ts 使用 process.env 暴露所有 env vars	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.015113+08	## Bug 描述\nvite.config.ts 第 27 行 `process.env: JSON.stringify(process.env)` 將所有伺服器端環境變數暴露給前端 bundle。\n\n## 重現步驟\n1. npm run dev 啟動前端\n2. 打開瀏覽器 DevTools Console\n3. 輸入 process.env\n4. 可看到 DATABASE_URL、所有 API Key 等敏感資訊\n\n## 預期行為\n前端只能存取 VITE_ 開頭的環境變數。\n\n## 修復方案\n**檔案**：vite.config.ts\n1. 移除第 27 行 `process.env: JSON.stringify(process.env)`\n2. 只保留第 25 行 process.env.NODE_ENV 定義\n3. 前端需要的環境變數改用 VITE_ 前綴：\n   - VITE_API_URL（如需要）\n   - VITE_SENTRY_DSN（未來）\n4. 前端存取方式：import.meta.env.VITE_XXX\n5. 重新 build 後用 grep 檢查 dist/ 無敏感字串\n\n## 驗收標準（AC）\n- [ ] vite.config.ts 不再暴露完整 process.env\n- [ ] dist/ bundle 中無 DATABASE_URL\n- [ ] 前端功能正常\n\n## 技術備註\n- 此為嚴重安全漏洞，P0 優先\n- config/api.ts 中的 API baseURL 可改用 import.meta.env\n- Zeabur 部署時 Vite build 也會暴露\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
26	1	\N	前端 Bundle Code-Splitting（目前 1.1MB）	\N	todo	P1	\N	\N	{前端,效能}	\N	\N	\N	25	main bundle 1.1MB, should be split	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.02336+08	## 功能需求\n前端 bundle 目前約 1.1MB，需透過 Code-Splitting 將首次載入大小降到 300KB 以下，提升載入速度。\n\n## 執行步驟\n1. 分析目前 bundle 組成：npx vite-bundle-visualizer\n2. 找出最大的依賴（預估：chart.js、lodash、moment 等）\n3. 路由層級 lazy loading：\n   - React.lazy() + Suspense 包裹每個頁面元件\n   - 候選人頁、職缺頁、配對頁、儀表板等獨立 chunk\n4. 大型依賴動態載入：\n   - chart.js → 只在儀表板頁載入\n   - 履歷解析相關 → 只在匯入時載入\n5. 第三方庫分離：vite build 設定 manualChunks\n   - vendor chunk：react, react-dom\n   - ui chunk：UI 元件庫\n6. 圖片/Icon 優化：tree-shaking unused icons\n7. 重新 build 後驗證 chunk 大小\n\n## 驗收標準（AC）\n- [ ] 首頁 bundle < 300KB（gzip 後）\n- [ ] 每個路由頁面獨立 chunk\n- [ ] Lighthouse Performance 分數 > 80\n- [ ] 路由切換時有 loading fallback\n- [ ] 無功能迴歸\n\n## 技術備註\n- Vite 內建支援動態 import() code splitting\n- React.lazy 搭配 Suspense fallback\n- manualChunks 設定在 vite.config.ts build.rollupOptions\n- 注意：chart.js 若用 tree-shaking 需改用 chart.js/auto\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
28	1	\N	核心服務 Unit Tests	\N	todo	P1	\N	\N	{測試}	\N	\N	\N	27	測試覆蓋率 10%	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.030704+08	## 功能需求\n為核心業務邏輯建立 Unit Test 覆蓋，確保候選人管理、職缺配對、履歷解析等核心功能穩定。\n\n## 執行步驟\n1. 測試框架建置：\n   - 安裝 vitest + @testing-library/react\n   - 後端安裝 jest + supertest\n   - 設定 vitest.config.ts / jest.config.js\n2. 後端 API 測試（supertest）：\n   - Auth：登入/登出/token 驗證/權限檢查\n   - 候選人 CRUD：建立/讀取/更新/刪除/列表篩選\n   - 職缺 CRUD：建立/狀態變更/配對觸發\n   - AI 配對：評分計算/加權邏輯/排序正確性\n   - 履歷解析：解析成功/格式錯誤/欄位驗證\n3. 前端元件測試（testing-library）：\n   - CandidateCard：資料渲染/雷達圖/操作按鈕\n   - JobForm：表單驗證/必填欄位/提交\n   - KanbanBoard：拖放邏輯/狀態更新\n4. 服務層單元測試：\n   - 五維雷達計算邏輯\n   - 匿名履歷遮罩邏輯\n   - 年齡/年資自動計算\n5. 設定覆蓋率報告（istanbul）\n\n## 驗收標準（AC）\n- [ ] 後端 API 測試覆蓋率 > 70%\n- [ ] 核心計算邏輯覆蓋率 > 90%\n- [ ] 前端關鍵元件有基礎渲染測試\n- [ ] 所有測試可 `npm test` 一鍵執行\n- [ ] CI 可整合（exit code 0/1）\n\n## 技術備註\n- 測試用 DB 建議用 SQLite in-memory 或 test schema\n- Mock 外部 API（OpenAI、Google Sheets）\n- 前端測試用 MSW (Mock Service Worker) mock API\n- 優先測試有 bug 歷史的模組\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
29	1	\N	GitHub Actions CI — Build + Lint	\N	todo	P1	\N	\N	{DevOps,CI/CD}	\N	\N	\N	28	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.034269+08	## 功能需求\n建立 GitHub Actions CI pipeline，每次 push/PR 自動執行 build、lint、type-check，確保程式碼品質。\n\n## 執行步驟\n1. 建立 .github/workflows/ci.yml\n2. CI 觸發條件：\n   - push to main/develop\n   - pull_request to main\n3. Job 1 — Lint & Type Check：\n   - npm ci\n   - npx eslint src/ --ext .ts,.tsx\n   - npx tsc --noEmit\n4. Job 2 — Build：\n   - npm run build\n   - 確認 dist/ 產出正常\n5. Job 3 — Test（依賴 Task #28）：\n   - npm test\n   - 上傳覆蓋率報告\n6. 設定 ESLint 規則（若尚未有）：\n   - @typescript-eslint/recommended\n   - react-hooks/recommended\n7. package.json 加入 scripts：\n   - "lint": "eslint src/ --ext .ts,.tsx"\n   - "type-check": "tsc --noEmit"\n8. 加入 PR status check 保護 main branch\n\n## 驗收標準（AC）\n- [ ] Push 後 GitHub 自動觸發 CI\n- [ ] Lint 通過無 error\n- [ ] TypeScript 編譯通過\n- [ ] Build 成功產出 dist/\n- [ ] PR 上可看到 CI 狀態 ✅/❌\n- [ ] CI 失敗會阻擋 merge（建議）\n\n## 技術備註\n- Node.js 版本用 20.x\n- npm ci 比 npm install 更適合 CI\n- 可加 cache: npm 加速重複 build\n- 未來可擴展：自動部署 Zeabur\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
30	1	\N	Sentry 錯誤監控整合	\N	todo	P1	\N	\N	{DevOps,監控}	\N	\N	\N	29	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.038184+08	## 功能需求\n整合 Sentry 錯誤監控，自動捕捉前後端未處理例外，提供即時告警和錯誤追蹤。\n\n## 執行步驟\n1. 建立 Sentry 專案（sentry.io 免費方案）：\n   - 建 2 個專案：headhunter-frontend、headhunter-backend\n   - 取得 DSN（Data Source Name）\n2. 前端整合：\n   - npm install @sentry/react\n   - main.tsx 初始化 Sentry.init({ dsn, environment, release })\n   - 加入 Sentry.ErrorBoundary 包裹 App\n   - 設定 tracesSampleRate: 0.2（20% 效能追蹤）\n3. 後端整合：\n   - npm install @sentry/node\n   - Express middleware: Sentry.Handlers.requestHandler()\n   - 錯誤處理: Sentry.Handlers.errorHandler()\n   - 手動 captureException 在 catch 區塊\n4. Source Map 上傳：\n   - vite build 產出 sourcemap\n   - sentry-cli upload-sourcemaps dist/\n   - Production 關閉 sourcemap 暴露\n5. 告警設定：\n   - 新錯誤 → Slack/Email 通知\n   - 錯誤頻率 > 10/min → 緊急告警\n\n## 驗收標準（AC）\n- [ ] 前端 JS 錯誤自動回報 Sentry\n- [ ] 後端 API 錯誤自動回報\n- [ ] Sentry Dashboard 可看到錯誤詳情\n- [ ] Source Map 正確（可看到原始碼位置）\n- [ ] 告警通知正常運作\n\n## 技術備註\n- DSN 放環境變數 VITE_SENTRY_DSN / SENTRY_DSN\n- 免費方案：5K errors/month, 1 user\n- 注意不要把 sourcemap 部署到 production CDN\n- Release 版本建議用 git commit hash\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
31	1	\N	Docker 容器化	\N	backlog	P2	\N	\N	{DevOps}	\N	\N	\N	30	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.04163+08	## 功能需求\n將前後端和 PostgreSQL 容器化，實現一鍵部署和開發環境統一。\n\n## 執行步驟\n1. 後端 Dockerfile：\n   - Node.js 20-alpine base image\n   - 多階段 build（build stage + production stage）\n   - 設定 healthcheck endpoint\n2. 前端 Dockerfile：\n   - Build stage: npm run build\n   - Production stage: nginx:alpine 靜態檔服務\n   - nginx.conf 設定 SPA fallback + API proxy\n3. docker-compose.yml：\n   - postgres: 16-alpine, volume 持久化, init scripts\n   - backend: 依賴 postgres, 環境變數, port 3001\n   - frontend: 依賴 backend, port 80\n   - network: 內部網路通訊\n4. 環境設定：\n   - .env.docker 範本\n   - docker-compose.override.yml（開發用 hot reload）\n5. 開發便利性：\n   - Makefile: make dev, make build, make up, make down\n   - Volume mount src/ 實現 hot reload\n\n## 驗收標準（AC）\n- [ ] docker-compose up -d 一鍵啟動所有服務\n- [ ] 前端可正常存取（localhost:80）\n- [ ] 後端 API 正常運作\n- [ ] DB 資料持久化（重啟不遺失）\n- [ ] docker-compose down && up 後狀態恢復\n\n## 技術備註\n- 前端 build 約 60MB image\n- 後端 node_modules 約 200MB，用 alpine 壓縮\n- DB volume: ./docker/postgres-data\n- 部署到 Zeabur 可能需另外設定\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
32	1	\N	通知系統（Email / Line）	\N	backlog	P2	\N	\N	{後端,整合}	\N	\N	\N	31	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.044979+08	## 功能需求\n建立通知系統，在關鍵事件（新候選人、面試提醒、職缺狀態變更）時透過 Email 或 Line 通知相關人員。\n\n## 執行步驟\n1. 通知服務架構：\n   - 建立 NotificationService 基礎類別\n   - 支援多管道：Email / Line / 系統內通知\n   - 通知佇列機制（避免瞬間大量發送）\n2. Email 通知：\n   - 整合 Nodemailer + Gmail SMTP（或 SendGrid）\n   - Email 範本系統（HTML template）\n   - 通知類型：新候選人、面試提醒、職缺關閉、配對結果\n3. Line Notify 整合：\n   - 申請 Line Notify API token\n   - 群組/個人通知\n   - 重要事件即時推送\n4. 系統內通知：\n   - 通知 bell icon + dropdown\n   - 已讀/未讀狀態\n   - 通知歷史列表\n5. 通知偏好設定：\n   - 每位使用者可設定接收管道\n   - 各通知類型可單獨開關\n\n## 驗收標準（AC）\n- [ ] Email 通知成功發送\n- [ ] Line 通知成功推送\n- [ ] 系統內通知顯示正常\n- [ ] 使用者可管理通知偏好\n- [ ] 通知佇列防止重複發送\n\n## 技術備註\n- Gmail SMTP 需應用程式密碼（2FA 後）\n- SendGrid 免費 100 emails/day\n- Line Notify 免費無上限\n- 建議用 Bull Queue（Redis）管理通知佇列\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
21	1	2	Perplexity AI 擴展（Service 已寫，API Key 管理未完成）	\N	in_progress	P2	1	\N	{AI,API}	\N	\N	\N	20	Service written, API Key management incomplete	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.004375+08	## 功能需求\n主系統的 Perplexity AI 功能，讓顧問在系統內做候選人/公司 AI 調研。\n\n## 目前狀態\n- **主系統**：server/perplexityService.js 已寫基礎 API 呼叫，API Key 管理未完成\n- **Crawler**（獨立工具）：已完整實作 Perplexity，包含：\n  - enrichment/perplexity_client.py\n  - enrichment/contextual_scorer.py（5 維度評分）\n  - enrichment/prompts.py（prompt 範本）\n  - Settings 頁可設定 API Key\n\n## 主系統待完成\nCrawler 是獨立本地端工具，主系統若要有 Perplexity 功能仍需自己實作 UI：\n\n1. **API Key 管理**：\n   - 設定頁新增 Perplexity API Key 欄位\n   - 加密存入 DB 或環境變數\n   - 驗證 Key（GET /chat/completions ping）\n2. **候選人研究按鈕**：\n   - CandidateModal 新增「AI 調研」按鈕\n   - 呼叫 perplexityService.js\n   - 產生摘要存入候選人 notes\n3. **公司調研按鈕**：\n   - BDClientsPage 新增「AI 調研」按鈕\n   - 搜尋公司動態 / 融資 / 徵才趨勢\n\n## 驗收標準（AC）\n- [ ] 設定頁可輸入並儲存 API Key\n- [ ] 候選人頁可觸發 AI 調研\n- [ ] 調研結果存入候選人紀錄\n- [ ] Key 無效時有錯誤提示\n\n## 技術備註\n- Perplexity API 相容 OpenAI SDK 格式\n- Model: sonar-pro / sonar\n- perplexityService.js 已有 enrichCandidate, saveEnrichment\n- 費用：sonar-pro ~$0.003/query\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
33	1	\N	更多履歷格式支援（CakeResume 等）	\N	backlog	P2	\N	\N	{後端,AI}	\N	\N	\N	32	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.048349+08	## 功能需求\n擴展履歷解析支援更多平台格式：CakeResume、Yourator、Meet.jobs 等台灣常用求職平台。\n\n## 執行步驟\n1. 研究各平台履歷格式：\n   - CakeResume：PDF export 格式分析\n   - Yourator：PDF/HTML 格式分析\n   - Meet.jobs：PDF 格式分析\n   - 自製 Word 履歷（.docx）\n2. 建立格式偵測器：\n   - 上傳履歷時自動偵測來源平台\n   - 根據 PDF metadata / 內容特徵判斷\n3. 各平台專用解析器：\n   - CakeResumeParser：區塊識別（個人資訊/經歷/技能/作品集）\n   - YouratorParser：類似結構\n   - GenericParser：通用 AI 解析（fallback）\n4. 統一輸出格式：\n   - 所有解析器輸出統一的 CandidateData interface\n   - 遺失欄位標記為 null（不 crash）\n5. 測試與驗證：\n   - 每個平台至少 3 份測試履歷\n   - 正確率統計報告\n\n## 驗收標準（AC）\n- [ ] CakeResume PDF 解析成功率 > 85%\n- [ ] Yourator 解析成功率 > 80%\n- [ ] .docx 格式支援\n- [ ] 格式自動偵測正確\n- [ ] 解析失敗有 fallback（AI 通用解析）\n\n## 技術備註\n- CakeResume PDF 通常排版較複雜（多欄式）\n- mammoth 套件處理 .docx\n- 各平台 PDF 結構可能隨更新變動\n- 建議維護平台格式版本追蹤\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
36	1	\N	Swagger / OpenAPI 文件	\N	backlog	P3	\N	\N	{文件,API}	\N	\N	\N	35	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.059009+08	## 功能需求\n建立 Swagger/OpenAPI 3.0 文件，提供互動式 API 文件供前端開發和第三方整合使用。\n\n## 執行步驟\n1. 安裝套件：swagger-jsdoc + swagger-ui-express\n2. OpenAPI 3.0 基礎設定：\n   - info（title, version, description）\n   - servers（development, production）\n   - securityDefinitions（Bearer JWT）\n3. 為每個 API 端點撰寫 JSDoc：\n   - Auth: POST /login, POST /change-password\n   - Candidates: CRUD + search + filter\n   - Jobs: CRUD + status + matching\n   - Resume: upload + parse\n   - AI Match: trigger + results\n   - Admin: create user + reset password\n4. Schema 定義：\n   - Candidate, Job, Match, User 等 model\n   - Request/Response body 格式\n   - Error response 格式統一\n5. 掛載 Swagger UI：\n   - GET /api-docs → Swagger UI 頁面\n   - GET /api-docs.json → OpenAPI JSON spec\n6. 加入 Try it out 功能（需 JWT token 輸入）\n\n## 驗收標準（AC）\n- [ ] /api-docs 可存取 Swagger UI\n- [ ] 所有 API 端點有文件\n- [ ] Request/Response schema 完整\n- [ ] 可直接在 UI 上測試 API\n- [ ] JWT 認證流程可在 Swagger 操作\n\n## 技術備註\n- swagger-jsdoc 從程式碼註解自動產生\n- Production 可考慮關閉 Swagger UI\n- 維護成本：每次新增 API 需同步更新註解\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
37	1	\N	i18n 國際化（英文介面）	\N	backlog	P3	\N	\N	{前端}	\N	\N	\N	36	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.069056+08	## 功能需求\n將系統 UI 文字國際化，支援中文（預設）和英文切換，方便國際客戶或外國顧問使用。\n\n## 執行步驟\n1. i18n 框架建置：\n   - 安裝 react-i18next + i18next\n   - 設定 i18n.ts 初始化（defaultLang: zh-TW）\n   - Language detector（localStorage / browser）\n2. 翻譯檔案建立：\n   - locales/zh-TW/common.json — 共用文字\n   - locales/zh-TW/candidate.json — 候選人模組\n   - locales/zh-TW/job.json — 職缺模組\n   - locales/en/common.json — 英文翻譯\n   - 其他模組依此類推\n3. 前端改造：\n   - 所有硬編碼中文 → t("key")\n   - 組件內 useTranslation() hook\n   - 日期格式本地化\n   - 數字格式本地化\n4. 語言切換 UI：\n   - Sidebar 或 Header 加語言切換按鈕\n   - 即時切換無需 reload\n5. 後端訊息國際化：\n   - API error message 依 Accept-Language header\n   - 或統一用 error code，前端翻譯\n\n## 驗收標準（AC）\n- [ ] 切換英文後所有 UI 文字為英文\n- [ ] 切換中文後恢復中文\n- [ ] 語言偏好記住（localStorage）\n- [ ] 無遺漏的硬編碼文字\n- [ ] 日期/數字格式隨語言變化\n\n## 技術備註\n- react-i18next 是 React 最成熟的 i18n 方案\n- 用 namespace 拆分翻譯檔，避免單檔過大\n- 翻譯 key 用英文語意（如 candidate.name 而非 t1）\n- 可考慮 AI 輔助翻譯初稿\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
38	1	\N	Mobile RWD 響應式設計	\N	backlog	P3	\N	\N	{前端,UX}	\N	\N	\N	37	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.072816+08	## 功能需求\n全站響應式設計，確保手機和平板可正常操作所有功能。\n\n## 執行步驟\n1. 響應式斷點定義：\n   - mobile: < 640px\n   - tablet: 640px - 1024px\n   - desktop: > 1024px\n2. 全域 Layout 改造：\n   - Sidebar：手機版改為 bottom tab bar 或 hamburger menu\n   - Header：壓縮按鈕、隱藏次要操作\n3. 各頁面響應式：\n   - 候選人列表：手機用卡片式、桌面用表格\n   - 候選人詳情：Tab 切換取代多欄並列\n   - 職缺列表：類似候選人處理\n   - 看板：手機版 Tab 切換欄位（已實作類似邏輯）\n   - 儀表板：圖表自適應寬度\n4. 表單響應式：\n   - 多欄表單 → 手機單欄\n   - 按鈕大小適配觸控（最小 44px）\n   - 下拉選單適配手機\n5. 觸控優化：\n   - 拖放操作加觸控替代方案\n   - 長按選單\n   - 滑動手勢\n6. 測試：\n   - Chrome DevTools 各裝置模擬\n   - 實機測試（iPhone / Android）\n\n## 驗收標準（AC）\n- [ ] iPhone SE（375px）可正常操作\n- [ ] iPad（768px）排版合理\n- [ ] 所有功能在手機可存取\n- [ ] 觸控操作流暢\n- [ ] 無水平捲軸\n\n## 技術備註\n- Tailwind CSS 響應式前綴：sm:, md:, lg:\n- 注意 Sidebar 在手機版的處理\n- 圖表元件需設定 responsive: true\n- 拖放用 touch events 或 dnd-kit 觸控支援\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
3	1	1	候選人卡片 Phase 3（求職動機/離職原因/競業）	\N	done	P1	1	\N	{前端,核心}	\N	\N	\N	2	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.898073+08	## 功能需求\n候選人卡片第三階段，深度資訊：求職動機、離職原因、競業條款等面談資訊。\n\n## 已實作內容\n- **前端**：CandidateModal.tsx 下半部詳細資訊區\n- **欄位**：求職動機（textarea）、離職原因（textarea）、競業條款（是/否 + 描述）、面試紀錄、顧問評語\n\n## 驗收標準（AC）\n- [x] 求職動機/離職原因可編輯\n- [x] 競業條款有開關 + 詳細描述欄\n- [x] 面試紀錄支援多筆\n- [x] 顧問評語可新增/編輯\n\n## 技術備註\n- 這些欄位在匿名履歷中也會用到（ResumeGenerator.tsx）\n- 競業資訊對職缺配對有影響\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
5	1	1	匿名履歷（雷達圖 + 顧問評語 + Phase 3）	\N	done	P1	1	\N	{前端,匯出}	\N	\N	\N	4	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.905381+08	## 功能需求\n產生匿名履歷（隱藏姓名/公司），包含雷達圖 + 顧問評語 + Phase 3 深度資訊，供客戶審閱。\n\n## 已實作內容\n- **前端**：components/ResumeGenerator.tsx（匿名履歷產生器）\n- **後端**：server/anonymousResumeService.js（PDF 產生邏輯）\n- **功能**：\n  - 自動遮罩姓名（顯示姓氏 + X）、公司名稱\n  - 嵌入五維雷達圖\n  - 顯示顧問推薦評語\n  - 包含求職動機、離職原因（脫敏版）\n  - 匯出 PDF\n\n## 驗收標準（AC）\n- [x] 匿名履歷正確遮罩個資\n- [x] 雷達圖嵌入正常\n- [x] PDF 匯出功能正常\n- [x] 排版專業可發送客戶\n\n## 技術備註\n- PDF 產生用 html2canvas + jsPDF\n- 匿名規則：姓名→X先生/小姐，公司→某知名科技公司\n- 支援繁體中文字型\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
40	1	\N	AI 自動履歷評分	\N	backlog	P3	\N	\N	{AI}	\N	\N	\N	39	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.07979+08	## 功能需求\n候選人匯入或更新時，AI 自動評分（已有 ai_score/ai_grade/ai_report 欄位在 candidates_pipeline 表），結合五維雷達和 OpenClaw 分析。\n\n## 執行步驟\n1. 評分觸發時機：\n   - 新候選人建立後自動觸發\n   - 手動點擊「重新評分」按鈕\n   - 履歷匯入解析完成後\n2. 評分邏輯（server/gradingService.js 擴展）：\n   - 輸入：候選人完整資料 + 五維雷達分數\n   - AI 分析面向：\n     a. 技術深度（根據經歷年資、技能清單）\n     b. 產業匹配度（根據產業經驗）\n     c. 溝通能力（語言能力 + 面試紀錄）\n     d. 穩定度（跳槽頻率、離職原因）\n     e. 市場價值（薪資範圍 vs 市場行情）\n   - 輸出：0-100 分數 + A/B/C/D 等級 + 文字報告\n3. 寫入 DB：\n   - UPDATE candidates_pipeline SET ai_score, ai_grade, ai_report\n   - 記錄評分時間（可加 ai_scored_at 欄位）\n4. 前端顯示：\n   - CandidatesPage 列表顯示 ai_grade badge\n   - CandidateModal 詳情頁顯示完整 ai_report\n   - 支援按 ai_score 排序\n5. 批次評分：\n   - 管理員可批次對所有未評分候選人執行\n   - 進度條顯示\n\n## 驗收標準（AC）\n- [ ] 新候選人自動觸發 AI 評分\n- [ ] 評分結果寫入 DB（ai_score/ai_grade/ai_report）\n- [ ] 列表可見 A/B/C/D 等級標籤\n- [ ] 詳情頁可看完整報告\n- [ ] 批次評分功能可用\n\n## 技術備註\n- ai_score/ai_grade/ai_report 欄位已在 routes-api.js 中 ALTER TABLE 建立\n- gradingService.js 可能已有基礎邏輯\n- 使用 OpenAI GPT-4 做文字分析\n- 每次評分約 $0.01-0.03（依 token 用量）\n- 批次時注意 rate limit（加 delay）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
9	1	1	AI 配對推薦（加權評分 P0/P1/P2）	\N	done	P0	1	\N	{AI,核心}	\N	\N	\N	8	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.920133+08	## 功能需求\nAI 驅動的候選人-職缺配對推薦，使用加權評分（P0/P1/P2 優先級）計算匹配度。\n\n## 已實作內容\n- **前端**：pages/AIMatchingPage.tsx（配對結果介面）\n- **後端**：routes-api.js 中 AI 配對邏輯、server/personaService.js\n- **評分維度**：\n  - P0（必要條件）：技能匹配、年資、語言\n  - P1（重要條件）：產業經驗、薪資範圍、地點\n  - P2（加分條件）：證照、學歷、管理經驗\n- **加權計算**：P0 × 3 + P1 × 2 + P2 × 1\n\n## 驗收標準（AC）\n- [x] 選擇職缺 → AI 推薦候選人排名\n- [x] 顯示匹配分數和匹配原因\n- [x] P0/P1/P2 加權邏輯正確\n- [x] 結果存入 ai_match_result JSONB 欄位\n\n## 技術備註\n- personaService.js 用 OpenAI 做語義匹配\n- server/persona-matching/ 目錄含配對邏輯\n- ai_match_result 存入 candidates_pipeline 表\n- backfill-ai-match.js 可批次重算\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
10	1	1	看板視圖（Kanban Board）	\N	done	P1	1	\N	{前端,UX}	\N	\N	\N	9	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.924152+08	## 功能需求\n候選人 Pipeline 看板（Kanban Board），以拖放方式管理候選人在各招募階段的進度。\n\n## 已實作內容\n- **前端**：pages/PipelinePage.tsx（看板主頁）\n- **欄位**：初篩 → 電話面談 → 推薦客戶 → 客戶面試 → Offer → 報到 → 結案\n- **功能**：拖放移動候選人、篩選器、候選人卡片摘要\n- **追蹤**：progress_tracking JSONB 記錄每次移動時間\n\n## 驗收標準（AC）\n- [x] 看板欄位正確顯示\n- [x] 拖放移動候選人\n- [x] 移動記錄寫入 progress_tracking\n- [x] 候選人卡片顯示摘要資訊\n\n## 技術備註\n- HTML5 Drag & Drop API\n- progress_tracking: [{stage, movedAt, movedBy}]\n- 欄位在 routes-api.js ALTER TABLE 自動建立\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
11	1	1	BD 客戶管理	\N	done	P1	2	\N	{前端,後端}	\N	\N	\N	10	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.927911+08	## 功能需求\nBD（Business Development）客戶管理系統，追蹤客戶開發狀態和聯繫紀錄。\n\n## 已實作內容\n- **前端**：pages/BDClientsPage.tsx（客戶列表 + 詳情 + 聯繫紀錄）\n- **後端**：routes-api.js（/api/bd-clients CRUD）\n- **型別**：types.ts（Client, BDContact, BDStatus, BD_STATUS_CONFIG）\n- **狀態流**：開發中 → 接洽中 → 提案中 → 合約階段 → 合作中（或暫停/流失）\n\n## 主要功能\n- 客戶 CRUD（公司名、產業、規模、網站）\n- 聯繫人管理（姓名、職稱、Email、電話、LinkedIn）\n- 聯繫紀錄（日期、方式、摘要、下次行動）\n- 合約管理（類型、抽佣比例、起迄日）\n- 關聯職缺數量統計\n\n## 驗收標準（AC）\n- [x] 客戶 CRUD 正常\n- [x] BD 狀態流轉正常\n- [x] 聯繫紀錄可新增/查看\n- [x] 104/1111 URL 欄位\n\n## 技術備註\n- BD_STATUS_CONFIG 定義在 types.ts（含 icon/color/bg）\n- user_contacts 表（routes-api.js 自動建立）\n- 合約類型：RPO / 獵才 / 派遣\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
13	1	1	Google Sheets 同步	\N	done	P2	1	\N	{API,整合}	\N	\N	\N	12	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.934759+08	## 功能需求\n與 Google Sheets 雙向同步候選人資料，方便團隊協作和資料匯入匯出。\n\n## 已實作內容\n- **後端**：server/sheetsService.js（主服務）、sheetsService-v2.js、sheetsService-v2-sql.js、sheetsService-csv.js\n- **前端**：services/sheetsService.ts（API 呼叫）\n- **功能**：\n  - Google Sheets → DB 匯入\n  - DB → Google Sheets 匯出\n  - CSV 格式支援\n  - 欄位映射設定\n\n## 驗收標準（AC）\n- [x] 從 Google Sheets 匯入候選人\n- [x] 匯出候選人到 Sheets\n- [x] 欄位映射正確\n- [x] 重複偵測\n\n## 技術備註\n- 環境變數 SHEET_ID 指定 Google Sheet\n- v2-sql 版本直接寫入 PostgreSQL\n- 多版本是歷史演進（sheetsService → v2 → v2-sql）\n- import-from-sheets.js / import-via-gog.js 為匯入腳本\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
15	1	1	年齡/年資自動計算	\N	done	P2	1	\N	{後端}	\N	\N	\N	14	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.941625+08	## 功能需求\n根據出生年和入行年自動計算候選人年齡和年資，無需手動維護。\n\n## 已實作內容\n- **前端**：utils/dateFormat.ts（計算函式）\n- **計算邏輯**：\n  - 年齡 = 當前年 - 出生年\n  - 年資 = 當前年 - 入行年（或第一份工作起始年）\n- **顯示**：CandidateModal 和列表中自動顯示\n\n## 驗收標準（AC）\n- [x] 年齡自動計算正確\n- [x] 年資自動計算正確\n- [x] 跨年正確處理\n- [x] 空值不 crash\n\n## 技術備註\n- 純前端計算，不存 DB（即時計算）\n- dateFormat.ts 也處理日期格式化（YYYY/MM/DD）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
16	1	1	使用者權限（ADMIN/REVIEWER）	\N	done	P1	1	\N	{後端,安全}	\N	\N	\N	15	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.950714+08	## 功能需求\n使用者角色權限系統，區分 ADMIN 和 REVIEWER 不同操作權限。\n\n## 已實作內容\n- **型別**：types.ts（enum Role { ADMIN, REVIEWER }）\n- **前端**：pages/MembersPage.tsx（成員管理）\n- **後端**：routes-api.js（登入時返回 role）\n- **權限控制**：\n  - ADMIN：完整 CRUD + 設定 + 成員管理\n  - REVIEWER：僅可查看候選人資料和新增備註\n\n## 驗收標準（AC）\n- [x] 登入後正確識別角色\n- [x] REVIEWER 無法刪除候選人\n- [x] ADMIN 可管理成員\n- [x] UI 根據角色隱藏/顯示操作按鈕\n\n## 技術備註\n- 角色存在 users 表的 role 欄位\n- 前端用 authUser.role 控制 UI\n- 後端目前主要靠前端控制（可加 middleware 強化）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
41	1	2	密碼登入系統 + Sidebar 收合功能	\N	done	P1	1	\N	{前端,安全}	\N	\N	\N	41	點擊用戶卡片後需輸入密碼，Sidebar 可收合成 icon-only	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.08397+08	## 功能需求\n密碼登入認證系統（取代原本的 Firebase Auth）和 Sidebar 收合功能。\n\n## 已實作內容\n- **前端**：pages/LoginPage.tsx（登入頁）、components/Sidebar.tsx（可收合側邊欄）\n- **後端**：routes-api.js（POST /api/auth/login, POST /api/auth/change-password）\n- **認證**：bcryptjs 密碼 hash + JWT token\n- **Sidebar**：收合/展開切換、記住狀態（localStorage）\n\n## 驗收標準（AC）\n- [x] 密碼登入正常\n- [x] bcrypt hash 驗證\n- [x] JWT token 發放\n- [x] Sidebar 可收合/展開\n- [x] 收合狀態持久化\n\n## 技術備註\n- bcryptjs 10 salt rounds\n- JWT 含 id, email, role\n- Sidebar 用 Tailwind transition 動畫\n- firebase.ts 仍保留但非必要\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
42	1	2	移除候選人看板功能（CandidateKanbanPage）	\N	done	P2	1	\N	{前端,清理}	\N	\N	\N	42	刪除 KanbanPage + import/route/sidebar 清理	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.091816+08	## 功能需求\n移除舊版候選人看板頁面（CandidateKanbanPage），因功能已合併到 PipelinePage。\n\n## 已實作內容\n- **移除**：pages/CandidateKanbanPage.tsx（保留檔案但功能已棄用或重構）\n- **替代**：PipelinePage.tsx 已承接所有看板功能\n\n## 驗收標準（AC）\n- [x] CandidateKanbanPage 路由已移除或重導\n- [x] 相關 Sidebar 連結已更新\n- [x] 無殘留引用\n\n## 技術備註\n- 檔案可能仍存在但不再被路由引用\n- App.tsx 中路由已指向 PipelinePage\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
44	1	2	移除 AI Bot 排程功能	\N	done	P2	1	\N	{前端,清理}	\N	\N	\N	44	UI+設定已建但排程引擎未串接，整體移除	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.098756+08	## 功能需求\n移除 AI Bot 排程功能，因功能過於實驗性且有安全疑慮（Bot 帶來的 ID 引號問題）。\n\n## 已實作內容\n- **移除**：AI Bot 排程相關頁面和路由\n- **保留**：routes-api.js 中 sanitizeId() 防禦性處理（處理 Bot 遺留的引號 ID）\n\n## 驗收標準（AC）\n- [x] AI Bot 排程路由已移除\n- [x] Sidebar 連結已移除\n- [x] sanitizeId 保護機制保留\n\n## 技術備註\n- sanitizeId() 在 routes-api.js 用 router.param 全域套用\n- 功能：清除 ID 中的多餘引號（如 \\"184\\" → 184）\n- docs/examples/nodejs-bot.js 保留為參考\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
45	1	2	更新 API 文件（與後端一致）	\N	done	P2	1	\N	{文件,API}	\N	\N	\N	45	API.md 全面更新 + AIBOT/GITHUB/RESUME/SCORING Guide 修正	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.102343+08	## 功能需求\n更新 API 文件，確保文件描述與實際後端 API 一致。\n\n## 已實作內容\n- **文件**：docs/api/ 目錄\n- **涵蓋**：\n  - Auth API（login, change-password）\n  - Candidates API（CRUD + search + filter）\n  - Jobs API（CRUD + status）\n  - BD Clients API（CRUD + contacts）\n  - AI Match API\n  - Resume API（upload + parse）\n  - System Logs API\n\n## 驗收標準（AC）\n- [x] 所有 API 端點有文件\n- [x] Request/Response 格式正確\n- [x] 認證方式說明\n- [x] 錯誤碼說明\n\n## 技術備註\n- 文件在 docs/api/ 目錄\n- 與 routes-api.js 實際端點對齊\n- 包含 routes-crawler.js 和 routes-openclaw.js 的 API\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
46	1	2	更新 ARCHITECTURE.md（反映清理後狀態）	\N	done	P3	1	\N	{文件}	\N	\N	\N	46	頁面 26→15、API 端點 55+→~45、Python 7→0	2026-03-11 18:43:17.629934+08	2026-03-11 21:06:57.105911+08	## 功能需求\n更新系統架構文件，反映清理後的最新系統狀態。\n\n## 已實作內容\n- **文件**：docs/technical/ 目錄\n- **內容**：\n  - 系統架構圖（前端 + 後端 + DB + 外部服務）\n  - 技術棧說明（React, Express, PostgreSQL, OpenAI）\n  - 目錄結構說明\n  - 部署架構（Zeabur）\n  - 已移除功能記錄\n\n## 驗收標準（AC）\n- [x] 架構圖與現況一致\n- [x] 已移除功能有說明\n- [x] 新增功能有說明\n- [x] 部署流程文件化\n\n## 技術備註\n- 前端結構：App.tsx → pages/ → components/ → services/\n- 後端結構：server.js → routes-*.js → *Service.js\n- DB：Zeabur PostgreSQL（DATABASE_URL / POSTGRES_URI）\n- 外部服務：OpenAI, Google Sheets, GitHub API, Perplexity\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
4	1	1	五維雷達圖（自動計算 + 手動調整）	\N	done	P1	1	\N	{前端,AI}	\N	\N	\N	3	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.901396+08	## 功能需求\n候選人五維能力雷達圖，支援自動計算（根據資料）和手動調整。\n\n## 已實作內容\n- **前端**：components/RadarChart.tsx（Canvas 繪製五角形雷達圖）\n- **五維度**：技術能力、溝通表達、產業經驗、穩定度、市場價值\n- **自動計算**：根據候選人欄位數據自動推算初始分數\n- **手動調整**：顧問可拖動或輸入微調每個維度\n\n## 驗收標準（AC）\n- [x] 五角形雷達圖正確渲染\n- [x] 自動計算邏輯正常\n- [x] 手動調整後即時更新圖形\n- [x] 分數存入 DB 並可讀取\n- [x] 在匿名履歷中顯示\n\n## 技術備註\n- 用 Canvas API 手繪（非 chart.js），保持輕量\n- 分數範圍 1-10 每個維度\n- 存入 candidates_pipeline 的 radar_* 欄位\n- 計算公式在 RadarChart.tsx 內\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
14	1	1	系統操作日誌	\N	done	P2	1	\N	{後端,安全}	\N	\N	\N	13	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.93819+08	## 功能需求\n記錄所有系統操作（CRUD、狀態變更、AI 操作等），供管理員審計追蹤。\n\n## 已實作內容\n- **前端**：pages/SystemLogPage.tsx（日誌列表 + 篩選）\n- **後端**：routes-api.js（system_logs 表自動建立 + 寫入邏輯）\n- **DB 表**：system_logs（id, action, actor, actor_type, candidate_id, candidate_name, detail, created_at）\n\n## 記錄事件\n- 候選人 CRUD\n- Pipeline 階段移動\n- AI 配對觸發\n- 職缺狀態變更\n- 使用者登入/登出\n\n## 驗收標準（AC）\n- [x] 所有操作自動記錄\n- [x] 日誌可篩選（動作類型、操作者、時間範圍）\n- [x] 區分 HUMAN / AI 操作者\n- [x] 日誌不可修改\n\n## 技術備註\n- actor_type: HUMAN / AI\n- detail: JSONB 存放操作詳情\n- system_logs 表在 routes-api.js 啟動時自動 CREATE IF NOT EXISTS\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
18	1	1	幫助頁面 + 架構文件	\N	done	P3	1	\N	{文件}	\N	\N	\N	17	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.984166+08	## 功能需求\n系統使用說明和架構文件，幫助新使用者上手和開發者理解系統。\n\n## 已實作內容\n- **前端**：pages/HelpPage.tsx（使用說明頁面）\n- **文件**：\n  - docs/api/ — API 文件\n  - docs/technical/ — 技術架構\n  - docs/setup/ — 環境建置\n  - docs/rules/ — 業務規則\n  - docs/ai-prompts/ — AI prompt 範本\n  - docs/archive/ — 歷史版本記錄\n\n## 驗收標準（AC）\n- [x] HelpPage 顯示功能說明\n- [x] API 文件涵蓋所有端點\n- [x] 架構文件描述系統組成\n- [x] 環境建置步驟完整\n\n## 技術備註\n- 文件目錄：docs/（6 個子目錄）\n- HelpPage 用 Markdown-like 格式呈現\n- docs/examples/nodejs-bot.js 是 bot 範例\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
23	1	2	移除 27 個檔案中的硬編碼 DB 密碼	\N	todo	P0	1	\N	{安全,緊急}	\N	\N	\N	22	CRITICAL: server.js, routes-api.js 等 27 個檔案	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.011579+08	## 功能需求\n移除所有硬編碼的資料庫密碼，改用環境變數統一管理，消除安全風險。\n\n## 影響檔案\n目前硬編碼密碼出現在：\n- server/server.js — Pool connectionString 有 Zeabur 密碼\n- server/routes-api.js — DATABASE_URL fallback 有 Zeabur 密碼\n- server/init-db.js, sqlService.js 等多個 server/*.js\n- vite.config.ts — process.env 暴露（見 Task #24）\n\n## 執行步驟\n1. 全域搜尋：grep -r "zeabur" server/ --include="*.js" 找出所有含密碼的檔案\n2. 建立統一 config：\n   - server/config.js：module.exports = { DATABASE_URL: process.env.DATABASE_URL }\n   - 移除所有 fallback 硬編碼連線字串\n3. 確保 .env 有 DATABASE_URL（本地開發用）\n4. 確認 .env 在 .gitignore\n5. 建立 .env.example 範本\n6. 逐一修改所有 server/*.js 中的 new Pool({ connectionString: ... })\n7. 測試所有功能正常\n\n## 驗收標準（AC）\n- [ ] grep -r "etUh2zkR" 搜不到任何結果\n- [ ] 所有 server/*.js 用統一 config\n- [ ] .env.example 完整\n- [ ] Zeabur 部署正常（環境變數 POSTGRES_URI）\n- [ ] 本地開發正常（.env）\n\n## 技術備註\n- Zeabur 自動注入 POSTGRES_URI 環境變數\n- server.js 已有 POSTGRES_URI → DATABASE_URL 相容邏輯\n- dotenv 已安裝（require("dotenv").config()）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
1	1	1	候選人管理 CRUD（40+ 欄位）	\N	done	P0	1	\N	{後端,核心}	\N	\N	\N	0	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.842829+08	## 功能需求\n完整的候選人資料管理系統，支援 40+ 欄位的 CRUD 操作，包含個人資料、工作經歷、技能、薪資等。\n\n## 已實作內容\n- **前端**：pages/CandidatesPage.tsx（列表 + 篩選）、components/CandidateModal.tsx（詳情編輯）\n- **後端**：server/routes-api.js（GET/POST/PUT/DELETE /api/candidates）\n- **DB**：candidates_pipeline 表（40+ 欄位）\n- **服務層**：services/candidateService.ts（前端 API 呼叫）\n\n## 主要欄位\n姓名、年齡、性別、學歷、科系、現職公司、現職職稱、產業經驗、年資、語言能力、證照、期望薪資、目前薪資、求職動機、離職原因、競業條款、linkedin_url、github_url、email、五維雷達分數（5 個維度）、Pipeline 階段、備註等\n\n## 驗收標準（AC）\n- [x] 候選人列表可搜尋/篩選\n- [x] 新增候選人（必填：姓名）\n- [x] 編輯候選人所有欄位\n- [x] 刪除候選人（確認對話框）\n- [x] 資料持久化（PostgreSQL）\n\n## 技術備註\n- DB 連線：process.env.DATABASE_URL → Zeabur PostgreSQL\n- 前端用 Tailwind CSS + React 表單\n- 搜尋支援模糊匹配（ILIKE）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
20	1	2	爬蟲系統（UI + 路由已建置，需獨立 Crawler 專案）	\N	in_progress	P1	1	\N	{爬蟲,前端}	\N	\N	\N	19	UI + routes built, independent Crawler project needed	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.993158+08	## 功能需求\n獨立爬蟲工具（本地端運行），搜尋候選人後匯入主系統。\nRepo: https://github.com/jacky6658/headhunter-crawler.git\n\n## 已完成功能 ✅\n- LinkedIn 4 層搜尋（Playwright → Google → Bing → Brave API）\n- GitHub API 搜尋（多 Token 輪換、深度分析）\n- AI 評分（Perplexity sonar-pro 5 維度加權）\n- 規則評分（hard skills + domain + constraints）\n- AI 豐富化（LinkedIn API → Perplexity → Jina 3 層 fallback）\n- APScheduler 排程（once/daily/weekly/interval）\n- Web UI 5 頁（Dashboard/Tasks/Results/Logs/Settings）\n- REST API 20+ 端點\n- LocalStore JSON 儲存\n- Telegram 通知\n- 反偵測（UA 輪換、stealth、backoff）\n- Step1ne push candidates 對接\n\n## Crawler 內部仍待完成 ❌\n1. **104/1111 爬蟲**（見 Task #22）— 目前只有 LinkedIn + GitHub\n2. **安全性**：credentials.json（Google SA Key）直接 commit 到 repo，需移到 .env\n3. **前端重構**：tasks.html 和 results.html 各 40KB inline JS，維護困難\n4. **測試不足**：僅 6 個 test 檔，無整合測試、無 E2E 測試\n5. **單進程架構**：任務在 Flask thread 內執行，大量任務可能卡住\n6. **Config 硬編碼路徑**：default.yaml 有絕對路徑，換機器需手動改\n7. **Google Sheets Store 過時**：已遷移到 LocalStore，但 sheets_store.py 可能不同步\n\n## 驗收標準（AC）\n- [ ] 上述 7 項逐步改善\n- [ ] 新增 104/1111 爬蟲模組\n- [ ] credentials 移除出 repo\n- [ ] 測試覆蓋率提升\n\n## 技術備註\n- Python 3 + Flask + Playwright + APScheduler\n- 本地端執行，結果透過 integration/step1ne_client.py push 回主系統\n- 不需與主系統合併部署\n\n---\n📦 **GitHub 倉庫**\n- 爬蟲系統：https://github.com/jacky6658/headhunter-crawler
22	1	2	104/1111 職缺爬取（URL 欄位已加，自動同步未實作）	\N	in_progress	P2	1	\N	{爬蟲,整合}	\N	\N	\N	21	URL field added, auto-sync not implemented	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.008078+08	## 功能需求\n在 headhunter-crawler 專案中新增 104/1111 職缺爬蟲模組，擴展現有的 LinkedIn + GitHub 來源。\n\n## 目前狀態\n- Crawler repo: github.com/jacky6658/headhunter-crawler\n- 現有爬蟲：crawler/linkedin.py, crawler/github.py\n- 缺少：104, 1111 模組\n- 主系統 BD 客戶表已有 url_104, url_1111 欄位\n\n## 執行步驟\n1. 新增 crawler/job104.py：\n   - 104 AJAX API: GET https://www.104.com.tw/job/ajax/content/{job_id}\n   - 職缺搜尋：關鍵字 + 地區 + 產業篩選\n   - 解析欄位：職稱、公司、薪資、工作內容、條件、地點\n   - 配合現有 anti_detect.py 做延遲和 UA 輪換\n2. 新增 crawler/job1111.py：\n   - 1111 無公開 API，用 requests + BeautifulSoup 解析 HTML\n   - 類似欄位映射\n3. 整合到 engine.py：\n   - SearchTask 新增 source 選項：linkedin / github / 104 / 1111\n   - 搜尋任務可選來源組合\n4. 整合到 Web UI：\n   - tasks.html 建立任務時可勾選 104/1111 來源\n   - results.html 顯示來源標籤\n5. 整合到 API：\n   - api/routes.py 新增 104/1111 相關端點\n   - 支援單一 URL 快速擷取\n\n## 驗收標準（AC）\n- [ ] crawler/job104.py 可搜尋並解析 104 職缺\n- [ ] crawler/job1111.py 可搜尋並解析 1111 職缺\n- [ ] Web UI 可選 104/1111 來源\n- [ ] 結果與 LinkedIn/GitHub 統一格式存入 LocalStore\n- [ ] Rate limit 控制（每小時 < 100 requests）\n\n## 技術備註\n- 104 AJAX API 不需登入即可抓公開職缺\n- 1111 可能有 Cloudflare，需用 Playwright 或加 headers\n- 遵循現有架構：crawler/ 目錄放爬蟲模組\n- 用現有 scoring/engine.py 對爬回的職缺做配對評分\n- 加入 config/default.yaml 設定區塊\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system\n- 爬蟲系統：https://github.com/jacky6658/headhunter-crawler
19	1	2	履歷解析穩定性（v2 API 已修復，工作經歷解析需驗證）	\N	in_progress	P1	1	\N	{後端,AI}	\N	\N	\N	18	v2 API 已修復，work history parsing 需驗證	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:56.987906+08	## 功能需求\nv2 API 已修復基礎解析，但工作經歷解析仍需驗證和強化。\n\n## 相關檔案\n- server/resumeService.js — 履歷解析核心邏輯\n- server/resumePDFService.js — PDF 文字擷取\n- pages/ResumeImportPage.tsx — 前端上傳 + 預覽\n- server/server.js — multer 設定（memory storage, 10MB limit）\n\n## 執行步驟\n1. 準備 3 份測試履歷：LinkedIn PDF、104 HTML、一般 PDF\n2. 透過 ResumeImportPage 拖放上傳\n3. 檢查 resumeService.js 解析結果：\n   - 公司名稱、職位名稱、任職期間、工作描述\n4. 對比原始履歷標記遺漏或錯誤\n5. 修復 resumeService.js 中的正則/AI prompt\n6. 補充日期格式支援：2020/01, Jan 2020, 2020年1月, Present/至今\n7. 加入 fallback：正則失敗 → AI 輔助 → 返回原文手動填\n\n## 驗收標準（AC）\n- [ ] LinkedIn PDF 工作經歷正確解析\n- [ ] 104 HTML 工作經歷正確解析\n- [ ] 多段工作經歷能全部解析\n- [ ] 解析逾時（>30s）有保護機制\n- [ ] 失敗有明確錯誤訊息\n\n## 技術備註\n- PDF 解析用 pdf-parse（resumePDFService.js）\n- HTML 解析用 cheerio\n- AI 輔助用 OpenAI（personaService.js 已有整合）\n- server.js multer 限制 10MB、僅 PDF\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
27	1	\N	真正的認證系統 JWT / Firebase Auth	\N	todo	P1	\N	\N	{後端,安全}	\N	\N	\N	26	已有 localStorage + 密碼驗證登入，但尚未用 JWT/Firebase Auth	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.027097+08	## 功能需求\n將現有簡易密碼認證升級為完整 JWT 認證系統，支援 token refresh、安全登出、Session 管理。可選整合 Firebase Auth 提供 Google/GitHub SSO。\n\n## 執行步驟\n1. JWT 強化：\n   - Access Token 設定短效期（15 分鐘）\n   - 新增 Refresh Token（7 天效期）存入 httpOnly cookie\n   - POST /api/auth/refresh 端點自動續簽\n2. 安全強化：\n   - 密碼改用 bcrypt 12 rounds（目前 10）\n   - 加入登入失敗次數限制（5 次鎖定 15 分鐘）\n   - JWT secret 從環境變數讀取（不硬編碼）\n3. 前端 Token 管理：\n   - Axios interceptor 自動附加 Bearer token\n   - 401 時自動用 refresh token 重新取得 access token\n   - Token 過期自動導向登入頁\n4. （可選）Firebase Auth 整合：\n   - firebase-admin SDK 驗證前端 Firebase token\n   - 支援 Google / GitHub OAuth 登入\n   - 後端以 Firebase UID 對應本地用戶\n5. 登出機制：\n   - 清除前端 token\n   - 清除 httpOnly refresh cookie\n   - 可選：維護 token blacklist（Redis）\n\n## 驗收標準（AC）\n- [ ] Access Token 15 分鐘過期，自動 refresh\n- [ ] Refresh Token httpOnly cookie\n- [ ] 登入失敗 5 次鎖定\n- [ ] 前端 401 自動重新認證\n- [ ] 登出清除所有 token\n- [ ] JWT secret 從環境變數讀取\n\n## 技術備註\n- jsonwebtoken 套件已在用\n- refresh token 可存 DB 或 Redis\n- httpOnly cookie 需設 sameSite: strict\n- CORS 設定需允許 credentials\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
35	1	\N	完整爬蟲引擎整合	\N	backlog	P2	\N	\N	{爬蟲,整合}	\N	\N	\N	34	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.055624+08	## 功能需求\n強化 Crawler 專案本身的架構和穩定性，使其成為可靠的本地端工具。\nRepo: github.com/jacky6658/headhunter-crawler\n\n## 待強化項目\n\n### 1. 安全性修復\n- 移除 credentials.json 出 repo（加入 .gitignore）\n- Telegram Bot Token 從程式碼移到 .env\n- 建立 .env.example 完整範本\n\n### 2. 新增爬蟲來源\n- crawler/job104.py — 104 人力銀行（見 Task #22）\n- crawler/job1111.py — 1111 人力銀行\n- 統一 BaseCrawler interface\n\n### 3. 前端改善\n- tasks.html（40KB）和 results.html（40KB）的 inline JS 過於龐大\n- 選項：重構為模組化 JS / 或遷移到 Vue/React 輕量前端\n- 至少拆分 JS 到 static/js/ 獨立檔案\n\n### 4. 測試強化\n- 目前 6 個 test 檔覆蓋不足\n- 補充：crawler 模組 mock 測試、scoring 邏輯測試、API 端點測試\n- 加入 pytest-cov 覆蓋率報告\n- 目標覆蓋率 > 60%\n\n### 5. 架構改善\n- 目前單進程 Flask thread 執行任務\n- 大量並行任務可能卡住\n- 選項：Celery + Redis / 或 multiprocessing\n- 至少加入任務佇列避免 overload\n\n### 6. Config 改善\n- default.yaml 有硬編碼絕對路徑\n- 改為相對路徑或自動偵測\n- 支援多環境（dev/prod）設定檔\n\n### 7. Google Sheets 清理\n- sheets_store.py 已不是主要 storage\n- 決定：保留並同步更新 / 或標記為 deprecated\n\n## 驗收標準（AC）\n- [ ] credentials 不在 repo 中\n- [ ] 測試覆蓋率 > 60%\n- [ ] 前端 JS 拆分到獨立檔案\n- [ ] Config 無硬編碼路徑\n- [ ] 新增至少 1 個爬蟲來源（104）\n\n## 技術備註\n- 這是本地端工具，不需雲端部署架構\n- 結果透過 step1ne_client.py push 回主系統即可\n- 優先順序：安全 > 新來源 > 測試 > 前端 > 架構\n\n---\n📦 **GitHub 倉庫**\n- 爬蟲系統：https://github.com/jacky6658/headhunter-crawler
39	1	\N	WebSocket 即時更新	\N	backlog	P3	\N	\N	{後端,前端}	\N	\N	\N	38	\N	2026-03-11 18:02:27.610312+08	2026-03-11 21:06:57.076214+08	## 功能需求\n將目前 polling 機制升級為 WebSocket，讓多位顧問同時操作時能即時看到候選人狀態、Pipeline 移動等更新。\n\n## 執行步驟\n1. 後端 WebSocket 建置：\n   - 安裝 socket.io（server/server.js 已用 Express）\n   - 在 server.js 中 const io = new Server(httpServer)\n   - 建立 namespace: /candidates, /jobs, /pipeline\n2. 事件定義：\n   - candidate:created — 新增候選人\n   - candidate:updated — 候選人資料更新\n   - pipeline:moved — 候選人 Pipeline 階段移動\n   - job:statusChanged — 職缺狀態變更\n   - match:completed — AI 配對完成\n3. 後端觸發：\n   - routes-api.js 中各 POST/PUT/DELETE 成功後 emit 事件\n   - 帶上異動的完整資料或 diff\n4. 前端整合：\n   - services/ 新增 socketService.ts\n   - 各頁面 useEffect 監聽相關事件\n   - 收到更新 → 自動刷新 state（不需手動 refresh）\n5. 連線管理：\n   - 自動重連（reconnection: true）\n   - 連線狀態指示器（Sidebar 綠/紅燈）\n   - 離線時 fallback 回 polling\n\n## 驗收標準（AC）\n- [ ] 顧問 A 新增候選人 → 顧問 B 即時看到\n- [ ] Pipeline 拖動 → 其他使用者即時更新\n- [ ] 斷線後自動重連\n- [ ] 離線指示器正常顯示\n\n## 技術備註\n- socket.io 相容 Zeabur 部署（WebSocket + polling fallback）\n- 注意 CORS 設定需同步（allowedOrigins 已定義在 server.js）\n- 大量使用者時考慮 Redis adapter\n- 前端用 React context 管理 socket 實例\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
47	1	\N	即時聽人選語音去分析人選的程度評估	開發即時語音分析功能，在面試或通話時即時收聽人選語音，透過 AI 語音辨識與 NLP 分析人選的專業程度、表達能力、態度等指標，產出評估報告供顧問參考。	todo	P1	1	1	{AI,語音分析,人選評估}	\N	\N	\N	0	需串接 Whisper API 或 Google Speech-to-Text，搭配 GPT 進行語意分析	2026-03-11 18:49:36.809735+08	2026-03-11 21:06:57.109608+08	## 功能需求\n在候選人面談過程中，即時錄製語音並透過 AI 分析候選人的溝通能力、語言程度、專業度等面向，自動產生評估報告。\n\n## 執行步驟\n1. 前端整合 Web Audio API + MediaRecorder 錄音功能\n2. 在候選人詳情頁新增「語音評估」區塊，含錄音/停止按鈕\n3. 錄音完成後將音檔（WebM/WAV）上傳至後端\n4. 後端串接 Speech-to-Text API（Whisper / Google STT）轉文字\n5. 將轉錄文字送入 AI 分析（GPT-4 / Claude）進行評估：\n   - 語言流暢度（1-10）\n   - 專業術語使用\n   - 溝通邏輯性\n   - 自信程度\n   - 整體建議\n6. 評估結果存入候選人資料，可在卡片上查看\n7. 支援多段錄音與歷史記錄\n\n## 驗收標準（AC）\n- [ ] 前端可錄音、播放、上傳\n- [ ] STT 轉錄準確率 > 85%（中/英文）\n- [ ] AI 分析產出結構化評估報告\n- [ ] 評估結果自動關聯候選人\n- [ ] 歷史錄音可回放\n- [ ] 錄音檔案有適當存儲管理（S3/本地）\n\n## 技術備註\n- 瀏覽器錄音需 HTTPS 或 localhost\n- Whisper API 每分鐘音檔約 $0.006\n- 建議先用 OpenAI Whisper，未來可換 self-hosted\n- 音檔大小限制建議 25MB（約 30 分鐘）\n- 需考慮隱私法規（錄音告知同意）\n\n---\n📦 **GitHub 倉庫**\n- 主系統：https://github.com/jacky6658/step1ne-headhunter-system
\.


--
-- Data for Name: ai_automations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_automations (id, project_id, name, api_endpoint, method, payload, schedule, enabled, last_run_at, last_run_status, last_run_log, created_at) FROM stdin;
1	1	系統健康檢查	https://backendstep1ne.zeabur.app/api/health	GET	\N	*/30 * * * *	t	\N	\N	\N	2026-03-11 18:02:27.617839+08
3	1	職缺列表同步	https://backendstep1ne.zeabur.app/api/jobs	GET	\N	\N	f	2026-03-11 19:36:50.69+08	success	[2026-03-11T11:36:50.690Z] GET https://backendstep1ne.zeabur.app/api/jobs\nStatus: 200\nTime: 130ms\n\n{"success":true,"data":[{"id":230,"position_name":"PM（專案經理）","client_company":"仁大資訊","department":"","open_positions":"2","salary_range":"待遇面議（經常性薪資達 4 萬元以上）","key_skills":"專案管理, PM, PMP, 需求分析, 文件撰寫, 跨單位協作, C#, JavaScript, SQL, Stored Procedure, UAT, 系統測試, 成本控管, 風險管理, 進度控管","experience_required":"3年以上，資訊管理/企業管理相關科系，大學或碩士","education_required":"大學、碩士（資訊管理相關、企業管理相關）","location":"新北市五股區（新北產業園區）","job_status":"招募中","language_required":"","special_conditions":"具備人員管理/團隊管理經驗尤佳；具備 PMP 認證者尤佳；需出差","industry_background":"","team_size":"","key_challenges":"","attractive_points":"","recruitment_difficulty":"急","interview_process":"","consultant_notes":"仁大資訊新職缺，1人需求，緊急程度：急，Jacky匯入 2026-03-11，104來源: https://www.104.com.tw/job/8t2ss","job_description":"仁大資訊為一專業的系統整合維運公司，提供客戶端全方位的軟硬體系統整合、維運、開發等服務。歡迎對IT產業具熱忱的夥伴加入仁大的團隊！\\n\\n【你將在團隊參與】\\n1. 負責參與客戶專案進度討論會議、與客戶溝通協調\\n2. 分析需求規格書、流程說明、功能說明等專案文件\\n3. 協調開發、測試與客戶端單位，追蹤問題修正與專案進度\\n4. 必要時參與測試工作，協助功能測試與驗證，確保系統符合需求\\n5. 管控專案里程碑（開發、測試、驗收、上線），並定期向主管回報專案狀態\\n6. 彙整專案成果與交付文件，支援系統驗收與上線作業\\n7. 其他主管交辦事務\\n\\n【我們期待優秀的「專案管理人員」具備這樣的能力】\\n1. 三年以上工作經驗，具專案管理、系統規劃或資訊相關工作經驗\\n2. 具良好需求分析、文件撰寫與溝通協調能力\\n3. 能獨立追蹤專案時程、問題處理與跨單位協作\\n4. 熟悉 Excel、Word、PowerPoint 等文件與報告工具\\n\\n【加分條件（非必要）】\\n1. 曾擔任系統專案 PM、SA 或參與軟體開發專案\\n2. 了解 C#、JavaScript 或資料庫（SQL / Stored Procedure）者\\n3. 具系統測試（Test Case、UAT）、系統導入或報表專案經驗","company_profile":"","talent_profile":"3年以上 IT PM，能獨立追蹤里程碑、協調開發測試與客戶端，具文件撰寫與溝通能力，PMP/SA 背景加分","search_primary":"PM, 專案經理, Project Manager, IT PM","search_secondary":"PMP, Scrum, Agile, Jira, Confluence, 專案管理, 里程碑","welfare_tags":"","welfare_detail":"","work_hours":"日班 08:30-17:30，依公司規定休假","vacation_policy":"","remote_work":"","business_trip":"需出差，一年累積時間未定","job_url":"https://www.104.com.tw/job/8t2ss","lastUpdated":"2026-03-11T03:16:54.782Z"},{"id":229,"position_name":"SD（系統設計師）","client_company":"仁大資訊","department":"","open_positions":"1","salary_range":"月薪 NT$55,000~80,000（依經驗面議）","key_skills":"系統架構設計, SDD, API設計, 資料流設計, 分層架構, 設計模式, SQL, 資料表設計, Code Review, 微服務, Redis, Docker, Kubernetes	2026-03-11 18:02:27.617839+08
2	1	候選人統計	https://backendstep1ne.zeabur.app/api/candidates?limit=1	GET	\N	\N	f	2026-03-11 19:36:51.758+08	success	[2026-03-11T11:36:51.758Z] GET https://backendstep1ne.zeabur.app/api/candidates?limit=1\nStatus: 200\nTime: 15ms\n\n{"success":true,"data":[{"id":"2","name":"黃柔蓁","email":"","phone":"0965-806-936","location":"","position":"餐飲服務/外場管理/活動企劃","years":2,"jobChanges":0,"avgTenure":0,"lastGap":0,"skills":"客戶服務,活動企劃,咖啡師,食品安全,溝通協調","education":"學士","source":"Gmail","status":"爬蟲初篩","consultant":"Phoebe","notes":"","stabilityScore":45,"createdAt":"2026-02-25T12:34:47.319Z","updatedAt":"2026-03-11T04:28:13.372Z","createdBy":"system","linkedinUrl":"","githubUrl":"","resumeLink":"rouzhen1030@gmail.com","workHistory":[],"quitReasons":"","educationJson":[],"discProfile":"","progressTracking":[{"by":"Unknown","date":"2026-02-26","event":"婉拒"},{"by":"Unknown","date":"2026-02-26","event":"婉拒"},{"by":"system","date":"2026-03-10","event":"爬蟲初篩"}],"aiMatchResult":null,"contact_link":"rouzhen1030@gmail.com","current_position":"餐飲服務/外場管理/活動企劃","years_experience":"2","job_changes":"","avg_tenure_months":"","recent_gap_months":"","work_history":[],"leaving_reason":"","stability_score":"45","education_details":[],"personality_type":"","recruiter":"Phoebe","talent_level":"","targetJobId":null,"targetJobLabel":null,"interviewRound":null,"age":null,"ageEstimated":true,"industry":"","languages":"","certifications":"","currentSalary":"","expectedSalary":"","noticePeriod":"","managementExperience":false,"teamSize":"","consultantEvaluation":{"stability":2,"evaluatedAt":"2026-03-11T04:28:13.339Z","evaluatedBy":"Admin","personality":3,"communication":4,"industryMatch":3,"overallRating":3,"technicalDepth":3},"jobSearchStatus":"","reasonForChange":"","motivation":"","dealBreakers":"","competingOffers":"","relationshipLevel":""}],"count":1}	2026-03-11 18:02:27.617839+08
\.


--
-- Data for Name: arch_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.arch_snapshots (id, project_id, health_data, features_done, features_wip, features_todo, api_count, db_table_count, notes, snapshot_at) FROM stdin;
1	1	{"CI/CD": 20, "安全性": 40, "測試覆蓋": 10, "爬蟲系統": 55, "前端 (React 19)": 95, "AI 整合 (Gemini)": 70, "後端 (Express 5)": 90, "資料庫 (PostgreSQL)": 98}	24	4	14	45	12	來源：ARCHITECTURE.md（2026-03-11 更新）\n技術棧：React 19 + Vite 6 + TypeScript + Tailwind CSS 3\nExpress 5 + PostgreSQL + Google AI (Gemini)\n資料量：1,347 候選人、53 職缺、3 顧問\n頁面：15 個（已清理移除 Bot/Leads/看板）\n最新：新增密碼登入、移除 Leads/Bot/候選人看板	2026-03-11 18:02:27.61937+08
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, name, description, api_base_url, health_url, repo_url, icon, status, created_at) FROM stdin;
1	Step1ne 獵頭 AI 協作系統	獵頭顧問 AI 協作平台 — 候選人管理、AI 評分、自動同步	https://backendstep1ne.zeabur.app/api	https://backendstep1ne.zeabur.app/api/health	https://github.com/jacky6658/step1ne-headhunter-system	🎯	active	2026-03-11 18:00:21.433248+08
\.


--
-- Data for Name: roadmap_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roadmap_features (id, project_id, title, description, quarter, priority, status, milestone, depends_on, created_at) FROM stdin;
1	1	候選人管理 CRUD（40+ 欄位）	\N	2026-Q1	P0	done	MVP	\N	2026-03-11 18:02:27.613785+08
2	1	AI 配對推薦（加權評分）	\N	2026-Q1	P0	done	MVP	\N	2026-03-11 18:02:27.613785+08
3	1	五維雷達圖 + 匿名履歷	\N	2026-Q1	P1	done	MVP	\N	2026-03-11 18:02:27.613785+08
4	1	履歷解析（LinkedIn / 104）	\N	2026-Q1	P0	done	MVP	\N	2026-03-11 18:02:27.613785+08
5	1	看板視圖 + BD 客戶管理	\N	2026-Q1	P1	done	MVP	\N	2026-03-11 18:02:27.613785+08
6	1	GitHub 分析 + Google Sheets 同步	\N	2026-Q1	P2	done	v1.0	\N	2026-03-11 18:02:27.613785+08
7	1	營運儀表板 + 系統日誌 + 權限	\N	2026-Q1	P1	done	v1.0	\N	2026-03-11 18:02:27.613785+08
8	1	安全修復：移除硬編碼密碼（27 檔案）	CRITICAL: server.js, routes-api.js 等 27 個檔案包含硬編碼 DB 密碼	2026-Q1	P0	in_progress	Security Fix	\N	2026-03-11 18:02:27.613785+08
9	1	爬蟲系統獨立化	UI + 路由已建置，需獨立 Crawler 專案	2026-Q1	P1	in_progress	v1.1	\N	2026-03-11 18:02:27.613785+08
10	1	自動化測試（Unit + Integration）	測試覆蓋率目前 10%，需全面補上	2026-Q2	P1	planned	Quality	\N	2026-03-11 18:02:27.613785+08
11	1	JWT / Firebase Auth 認證系統	取代 localStorage 模擬登入	2026-Q2	P1	planned	Security	\N	2026-03-11 18:02:27.613785+08
12	1	GitHub Actions CI/CD Pipeline	Build + Lint + Test 自動化	2026-Q2	P1	planned	DevOps	\N	2026-03-11 18:02:27.613785+08
13	1	Sentry 錯誤監控	\N	2026-Q2	P1	planned	DevOps	\N	2026-03-11 18:02:27.613785+08
14	1	前端 Bundle Code-Splitting	主包 1.1MB → 分割優化	2026-Q2	P1	planned	效能	\N	2026-03-11 18:02:27.613785+08
15	1	Docker 容器化部署	\N	2026-Q3	P2	planned	DevOps	\N	2026-03-11 18:02:27.613785+08
16	1	通知系統（Email + Line）	\N	2026-Q3	P2	planned	v2.0	\N	2026-03-11 18:02:27.613785+08
17	1	API Rate Limiting	\N	2026-Q3	P2	planned	Security	\N	2026-03-11 18:02:27.613785+08
18	1	完整爬蟲引擎整合	\N	2026-Q3	P2	planned	v2.0	\N	2026-03-11 18:02:27.613785+08
19	1	Swagger / OpenAPI 文件	\N	2026-Q4	P3	planned	DX	\N	2026-03-11 18:02:27.613785+08
20	1	i18n 國際化 + Mobile RWD	\N	2026-Q4	P3	planned	v3.0	\N	2026-03-11 18:02:27.613785+08
21	1	WebSocket 即時更新 + AI 自動評分	\N	2026-Q4	P3	planned	v3.0	\N	2026-03-11 18:02:27.613785+08
22	1	密碼登入系統	用戶卡片 + 密碼驗證 + Sidebar 收合	2026-Q1	P1	done	v1.0	\N	2026-03-11 18:43:17.674469+08
23	1	功能清理：移除 Leads/Bot/看板	移除未完成或不需要的模組，頁面 26→15	2026-Q1	P2	done	v1.0	\N	2026-03-11 18:43:17.674469+08
\.


--
-- Data for Name: sprints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sprints (id, project_id, name, goal, start_date, end_date, status, created_at) FROM stdin;
1	1	Sprint 1 — 核心 MVP	候選人管理、職缺管理、AI 配對、看板視圖等核心功能	2026-01-10	2026-02-28	completed	2026-03-11 18:02:27.607304+08
2	1	Sprint 2 — 安全修復 & 穩定性	修復安全漏洞、提升履歷解析穩定性、爬蟲系統進度	2026-03-01	2026-03-14	active	2026-03-11 18:02:27.607304+08
3	1	Sprint 3 — 測試 & CI/CD	建立自動化測試、GitHub Actions CI、Sentry 監控	2026-03-15	2026-03-28	planning	2026-03-11 18:02:27.607304+08
\.


--
-- Data for Name: standup_notes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.standup_notes (id, project_id, member_id, date, yesterday, today, blockers, created_at) FROM stdin;
1	1	1	2026-03-11	完成 Bot 排程 & Leads 功能清理，建立 .env 配置	開始建立 Agile Hub 專案骨架	無	2026-03-11 18:02:27.61612+08
2	1	2	2026-03-11	測試匿名履歷匯出功能	協助驗證履歷解析穩定性	等待 v2 API 修復確認	2026-03-11 18:02:27.61612+08
3	1	1	2026-03-10	更新 ARCHITECTURE.md、安全問題盤點	規劃 DB 密碼移除方案（27 檔案）	需確認 Zeabur 環境變數注入方式	2026-03-11 18:02:27.61612+08
\.


--
-- Data for Name: task_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_activities (id, task_id, project_id, actor_id, actor_name, action, detail, old_value, new_value, created_at) FROM stdin;
1	47	1	1	jacky@step1ne.com	create	建立任務：即時聽人選語音去分析人選的程度評估	\N	\N	2026-03-11 18:49:36.813476+08
2	47	1	1	jacky@step1ne.com	status_change	狀態變更：todo → in_progress	todo	in_progress	2026-03-11 18:49:50.859051+08
3	47	1	1	jacky@step1ne.com	assign	認領/指派任務		1	2026-03-11 18:49:50.945271+08
4	47	1	1	jacky@step1ne.com	comment	AI 建議：可考慮使用 OpenAI Whisper API 進行即時語音轉文字，搭配 GPT-4 做語意分析評估。	\N	\N	2026-03-11 18:49:50.965852+08
5	47	1	1	jacky@step1ne.com	status_change	狀態變更：in_progress → todo	in_progress	todo	2026-03-11 18:50:06.354828+08
7	49	1	1	jacky@step1ne.com	create	建立任務：讓系統了解職缺與人選認知（加速顧問作業、減少學習成本）	\N	\N	2026-03-11 21:12:19.865167+08
8	50	1	1	jacky@step1ne.com	create	建立任務：AI 提示詞資料庫（人選認知 / 職缺分析 Prompt Library）	\N	\N	2026-03-11 21:14:59.844922+08
\.


--
-- Name: ah_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ah_members_id_seq', 4, true);


--
-- Name: ah_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ah_tasks_id_seq', 50, true);


--
-- Name: ai_automations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ai_automations_id_seq', 3, true);


--
-- Name: arch_snapshots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.arch_snapshots_id_seq', 1, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, true);


--
-- Name: roadmap_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roadmap_features_id_seq', 23, true);


--
-- Name: sprints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sprints_id_seq', 3, true);


--
-- Name: standup_notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.standup_notes_id_seq', 3, true);


--
-- Name: task_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.task_activities_id_seq', 8, true);


--
-- Name: ah_members ah_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_members
    ADD CONSTRAINT ah_members_pkey PRIMARY KEY (id);


--
-- Name: ah_tasks ah_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks
    ADD CONSTRAINT ah_tasks_pkey PRIMARY KEY (id);


--
-- Name: ai_automations ai_automations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_automations
    ADD CONSTRAINT ai_automations_pkey PRIMARY KEY (id);


--
-- Name: arch_snapshots arch_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.arch_snapshots
    ADD CONSTRAINT arch_snapshots_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: roadmap_features roadmap_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features
    ADD CONSTRAINT roadmap_features_pkey PRIMARY KEY (id);


--
-- Name: sprints sprints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sprints
    ADD CONSTRAINT sprints_pkey PRIMARY KEY (id);


--
-- Name: standup_notes standup_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standup_notes
    ADD CONSTRAINT standup_notes_pkey PRIMARY KEY (id);


--
-- Name: task_activities task_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_pkey PRIMARY KEY (id);


--
-- Name: idx_task_activities_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_activities_created ON public.task_activities USING btree (created_at DESC);


--
-- Name: idx_task_activities_project; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_activities_project ON public.task_activities USING btree (project_id);


--
-- Name: idx_task_activities_task; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_task_activities_task ON public.task_activities USING btree (task_id);


--
-- Name: ah_tasks ah_tasks_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks
    ADD CONSTRAINT ah_tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.ah_members(id) ON DELETE SET NULL;


--
-- Name: ah_tasks ah_tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks
    ADD CONSTRAINT ah_tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: ah_tasks ah_tasks_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks
    ADD CONSTRAINT ah_tasks_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.ah_members(id) ON DELETE SET NULL;


--
-- Name: ah_tasks ah_tasks_sprint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ah_tasks
    ADD CONSTRAINT ah_tasks_sprint_id_fkey FOREIGN KEY (sprint_id) REFERENCES public.sprints(id) ON DELETE SET NULL;


--
-- Name: ai_automations ai_automations_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_automations
    ADD CONSTRAINT ai_automations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: arch_snapshots arch_snapshots_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.arch_snapshots
    ADD CONSTRAINT arch_snapshots_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: roadmap_features roadmap_features_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_features
    ADD CONSTRAINT roadmap_features_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: sprints sprints_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sprints
    ADD CONSTRAINT sprints_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: standup_notes standup_notes_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standup_notes
    ADD CONSTRAINT standup_notes_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.ah_members(id) ON DELETE CASCADE;


--
-- Name: standup_notes standup_notes_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.standup_notes
    ADD CONSTRAINT standup_notes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: task_activities task_activities_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.ah_members(id) ON DELETE SET NULL;


--
-- Name: task_activities task_activities_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: task_activities task_activities_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_activities
    ADD CONSTRAINT task_activities_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.ah_tasks(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict tlOw0beqVhrfHQkzYYU3EGu36ShDaWutu3IMK3tIEp8SP94bDyiTLBftyjuargg

