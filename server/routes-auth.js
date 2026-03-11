import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './init-db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'agile-hub-secret-key-2026';
const JWT_EXPIRES = '7d';

// ==================== Login ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: '請輸入 Email 和密碼' });
    }

    const { rows } = await pool.query(
      'SELECT id, display_name, email, avatar, role, password_hash FROM ah_members WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (!rows.length) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const member = rows[0];
    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const token = jwt.sign(
      { id: member.id, email: member.email, role: member.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: {
        id: member.id,
        display_name: member.display_name,
        email: member.email,
        avatar: member.avatar,
        role: member.role,
      }
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: '登入失敗' });
  }
});

// ==================== Get Current User ====================
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未登入' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      'SELECT id, display_name, email, avatar, role FROM ah_members WHERE id = $1',
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ error: '使用者不存在' });
    }

    res.json(rows[0]);
  } catch (e) {
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token 無效或已過期' });
    }
    res.status(500).json({ error: '取得使用者資料失敗' });
  }
});

// ==================== Change Password ====================
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: '未登入' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: '請輸入目前密碼和新密碼' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: '新密碼至少 6 個字元' });
    }

    const { rows } = await pool.query(
      'SELECT password_hash FROM ah_members WHERE id = $1',
      [decoded.id]
    );

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: '目前密碼錯誤' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE ah_members SET password_hash = $1 WHERE id = $2',
      [newHash, decoded.id]
    );

    res.json({ message: '密碼更新成功' });
  } catch (e) {
    res.status(500).json({ error: '密碼更新失敗' });
  }
});

// ==================== Auth Middleware ====================
export function authMiddleware(req, res, next) {
  // Public routes that don't require auth
  const publicPaths = ['/auth/login', '/health'];
  if (publicPaths.some(p => req.path.startsWith(p))) {
    return next();
  }

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: '未登入，請先登入' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token 無效或已過期' });
  }
}

export default router;
