import { Router } from 'express';
import { pool } from './init-db.js';

const router = Router();

// ==================== Health ====================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'agile-hub', timestamp: new Date().toISOString() });
});

// ==================== Projects ====================
router.get('/projects', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const { name, description, api_base_url, health_url, repo_url, icon } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO projects (name, description, api_base_url, health_url, repo_url, icon) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, description, api_base_url, health_url, repo_url, icon]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/projects/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(req.body)) {
      if (['name', 'description', 'api_base_url', 'health_url', 'repo_url', 'icon', 'status'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== Members ====================
router.get('/members', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ah_members ORDER BY created_at');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/members', async (req, res) => {
  try {
    const { display_name, email, avatar, role } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO ah_members (display_name, email, avatar, role) VALUES ($1,$2,$3,$4) RETURNING *',
      [display_name, email, avatar, role || 'member']
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/members/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(req.body)) {
      if (['display_name', 'email', 'avatar', 'role'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE ah_members SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== Tasks ====================
router.get('/tasks', async (req, res) => {
  try {
    let query = 'SELECT * FROM ah_tasks';
    const conditions = [];
    const values = [];
    let idx = 1;

    if (req.query.project_id) {
      conditions.push(`project_id = $${idx++}`);
      values.push(req.query.project_id);
    }
    if (req.query.sprint_id) {
      conditions.push(`sprint_id = $${idx++}`);
      values.push(req.query.sprint_id);
    }
    if (req.query.status) {
      conditions.push(`status = $${idx++}`);
      values.push(req.query.status);
    }
    if (req.query.assignee_id) {
      conditions.push(`assignee_id = $${idx++}`);
      values.push(req.query.assignee_id);
    }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY sort_order, created_at';

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const { project_id, sprint_id, title, description, status, priority, assignee_id, reporter_id, labels, estimated_hours, actual_hours, due_date, sort_order, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO ah_tasks (project_id, sprint_id, title, description, status, priority, assignee_id, reporter_id, labels, estimated_hours, actual_hours, due_date, sort_order, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [project_id, sprint_id, title, description, status || 'todo', priority || 'P2', assignee_id, reporter_id, labels || [], estimated_hours, actual_hours, due_date, sort_order || 0, notes]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    const allowed = ['title', 'description', 'status', 'priority', 'assignee_id', 'reporter_id', 'labels', 'estimated_hours', 'actual_hours', 'due_date', 'sort_order', 'notes', 'sprint_id'];
    for (const [key, val] of Object.entries(req.body)) {
      if (allowed.includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    fields.push(`updated_at = NOW()`);
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE ah_tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM ah_tasks WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== Sprints ====================
router.get('/sprints', async (req, res) => {
  try {
    let query = 'SELECT * FROM sprints';
    const values = [];
    if (req.query.project_id) {
      query += ' WHERE project_id = $1';
      values.push(req.query.project_id);
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/sprints', async (req, res) => {
  try {
    const { project_id, name, goal, start_date, end_date, status } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO sprints (project_id, name, goal, start_date, end_date, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [project_id, name, goal, start_date, end_date, status || 'planning']
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/sprints/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(req.body)) {
      if (['name', 'goal', 'start_date', 'end_date', 'status'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE sprints SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/sprints/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sprints WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== Standup Notes ====================
router.get('/standups', async (req, res) => {
  try {
    let query = 'SELECT * FROM standup_notes';
    const conditions = [];
    const values = [];
    let idx = 1;
    if (req.query.project_id) {
      conditions.push(`project_id = $${idx++}`);
      values.push(req.query.project_id);
    }
    if (req.query.date) {
      conditions.push(`date = $${idx++}`);
      values.push(req.query.date);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/standups', async (req, res) => {
  try {
    const { project_id, member_id, date, yesterday, today, blockers } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO standup_notes (project_id, member_id, date, yesterday, today, blockers) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [project_id, member_id, date, yesterday, today, blockers]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== Roadmap Features ====================
router.get('/roadmap-features', async (req, res) => {
  try {
    let query = 'SELECT * FROM roadmap_features';
    if (req.query.project_id) {
      query += ' WHERE project_id = $1';
    }
    query += ' ORDER BY quarter, priority, created_at';
    const { rows } = await pool.query(query, req.query.project_id ? [req.query.project_id] : []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/roadmap-features', async (req, res) => {
  try {
    const { project_id, title, description, quarter, priority, status, milestone, depends_on } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO roadmap_features (project_id, title, description, quarter, priority, status, milestone, depends_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [project_id, title, description, quarter, priority || 'P2', status || 'planned', milestone, depends_on]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/roadmap-features/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(req.body)) {
      if (['title', 'description', 'quarter', 'priority', 'status', 'milestone', 'depends_on'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE roadmap_features SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/roadmap-features/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM roadmap_features WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== AI Automations ====================
router.get('/ai-automations', async (req, res) => {
  try {
    let query = 'SELECT * FROM ai_automations';
    if (req.query.project_id) {
      query += ' WHERE project_id = $1';
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, req.query.project_id ? [req.query.project_id] : []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/ai-automations', async (req, res) => {
  try {
    const { project_id, name, api_endpoint, method, payload, schedule, enabled } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO ai_automations (project_id, name, api_endpoint, method, payload, schedule, enabled) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [project_id, name, api_endpoint, method || 'POST', payload, schedule, enabled || false]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/ai-automations/:id', async (req, res) => {
  try {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [key, val] of Object.entries(req.body)) {
      if (['name', 'api_endpoint', 'method', 'payload', 'schedule', 'enabled', 'last_run_at', 'last_run_status', 'last_run_log'].includes(key)) {
        fields.push(`${key} = $${idx}`);
        values.push(val);
        idx++;
      }
    }
    if (!fields.length) return res.status(400).json({ error: 'No valid fields' });
    values.push(req.params.id);
    const { rows } = await pool.query(`UPDATE ai_automations SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/ai-automations/:id/run', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ai_automations WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const auto = rows[0];
    if (!auto.api_endpoint) return res.status(400).json({ error: 'No endpoint' });

    const start = Date.now();
    const result = await fetch(auto.api_endpoint, {
      method: auto.method || 'GET',
      signal: AbortSignal.timeout(30000),
      headers: { 'Content-Type': 'application/json' },
      body: auto.method !== 'GET' ? JSON.stringify(auto.payload || {}) : undefined,
    });
    const text = await result.text();
    const log = `[${new Date().toISOString()}] ${auto.method} ${auto.api_endpoint}\nStatus: ${result.status}\nTime: ${Date.now() - start}ms\n\n${text.substring(0, 5000)}`;

    await pool.query(
      'UPDATE ai_automations SET last_run_at = NOW(), last_run_status = $1, last_run_log = $2 WHERE id = $3',
      [result.ok ? 'success' : 'error', log, req.params.id]
    );

    res.json({ success: result.ok, log });
  } catch (e) {
    const log = `[${new Date().toISOString()}] Error: ${e.message}`;
    await pool.query(
      'UPDATE ai_automations SET last_run_at = NOW(), last_run_status = $1, last_run_log = $2 WHERE id = $3',
      ['error', log, req.params.id]
    );
    res.json({ success: false, log });
  }
});

// ==================== Arch Snapshots ====================
router.get('/arch-snapshots', async (req, res) => {
  try {
    let query = 'SELECT * FROM arch_snapshots';
    if (req.query.project_id) {
      query += ' WHERE project_id = $1';
    }
    query += ' ORDER BY snapshot_at DESC LIMIT 10';
    const { rows } = await pool.query(query, req.query.project_id ? [req.query.project_id] : []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/arch-snapshots', async (req, res) => {
  try {
    const { project_id, health_data, features_done, features_wip, features_todo, api_count, db_table_count, notes } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO arch_snapshots (project_id, health_data, features_done, features_wip, features_todo, api_count, db_table_count, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [project_id, health_data, features_done, features_wip, features_todo, api_count, db_table_count, notes]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
