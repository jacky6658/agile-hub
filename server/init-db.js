import pg from 'pg';
import bcrypt from 'bcryptjs';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      -- 專案表
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        api_base_url VARCHAR(500),
        health_url VARCHAR(500),
        repo_url VARCHAR(500),
        icon VARCHAR(10),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 成員表
      CREATE TABLE IF NOT EXISTS ah_members (
        id SERIAL PRIMARY KEY,
        display_name VARCHAR(100) NOT NULL,
        email VARCHAR(200),
        avatar VARCHAR(500),
        role VARCHAR(20) DEFAULT 'member',
        password_hash VARCHAR(200),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Sprint 表
      CREATE TABLE IF NOT EXISTS sprints (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        goal TEXT,
        start_date DATE,
        end_date DATE,
        status VARCHAR(20) DEFAULT 'planning',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 任務表
      CREATE TABLE IF NOT EXISTS ah_tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        sprint_id INTEGER REFERENCES sprints(id) ON DELETE SET NULL,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        status VARCHAR(30) DEFAULT 'backlog',
        priority VARCHAR(10) DEFAULT 'P2',
        assignee_id INTEGER REFERENCES ah_members(id) ON DELETE SET NULL,
        reporter_id INTEGER REFERENCES ah_members(id) ON DELETE SET NULL,
        labels TEXT[] DEFAULT '{}',
        estimated_hours NUMERIC(5,1),
        actual_hours NUMERIC(5,1),
        due_date DATE,
        sort_order INTEGER DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 路線圖功能表
      CREATE TABLE IF NOT EXISTS roadmap_features (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(300) NOT NULL,
        description TEXT,
        quarter VARCHAR(10),
        priority VARCHAR(10) DEFAULT 'P2',
        status VARCHAR(20) DEFAULT 'planned',
        milestone VARCHAR(100),
        depends_on INTEGER[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 站會/工作日誌
      CREATE TABLE IF NOT EXISTS standup_notes (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        member_id INTEGER REFERENCES ah_members(id) ON DELETE CASCADE,
        date DATE DEFAULT CURRENT_DATE,
        yesterday TEXT,
        today TEXT,
        blockers TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- AI 自動化設定
      CREATE TABLE IF NOT EXISTS ai_automations (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        api_endpoint VARCHAR(500),
        method VARCHAR(10) DEFAULT 'POST',
        payload JSONB,
        schedule VARCHAR(50),
        enabled BOOLEAN DEFAULT false,
        last_run_at TIMESTAMPTZ,
        last_run_status VARCHAR(20),
        last_run_log TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 系統架構快照
      CREATE TABLE IF NOT EXISTS arch_snapshots (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        health_data JSONB,
        features_done INTEGER DEFAULT 0,
        features_wip INTEGER DEFAULT 0,
        features_todo INTEGER DEFAULT 0,
        api_count INTEGER DEFAULT 0,
        db_table_count INTEGER DEFAULT 0,
        notes TEXT,
        snapshot_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed demo project if empty
    const { rows } = await client.query('SELECT COUNT(*) FROM projects');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO projects (name, description, api_base_url, health_url, repo_url, icon, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'Step1ne 獵頭 AI 協作系統',
        '獵頭顧問 AI 協作平台 — 候選人管理、AI 評分、自動同步',
        'https://backendstep1ne.zeabur.app/api',
        'https://backendstep1ne.zeabur.app/api/health',
        'https://github.com/jacky6658/step1ne-headhunter-system',
        '🎯',
        'active'
      ]);

      // Seed default members with default password 'agile123'
      const defaultHash = await bcrypt.hash('agile123', 10);
      await client.query(`
        INSERT INTO ah_members (display_name, email, role, password_hash) VALUES
        ('Jacky', 'jacky@step1ne.com', 'admin', $1),
        ('Phoebe', 'phoebe@step1ne.com', 'member', $1),
        ('Jim', 'jim@step1ne.com', 'member', $1)
      `, [defaultHash]);

      console.log('✅ Seeded demo project + members');
    }

    console.log('✅ Database tables initialized');
  } catch (err) {
    console.error('❌ Failed to init database:', err.message);
  } finally {
    client.release();
  }
}

export { pool };
