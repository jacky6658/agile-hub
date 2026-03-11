import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './init-db.js';
import apiRoutes from './routes-api.js';
import authRoutes, { authMiddleware } from './routes-auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth Routes (public — login 不需要 token)
app.use('/api/auth', authRoutes);

// Protected API Routes (需要 token)
app.use('/api', authMiddleware, apiRoutes);

// Start
async function start() {
  // 如果有 DATABASE_URL 才初始化 DB
  if (process.env.DATABASE_URL) {
    await initDatabase();
    console.log('📦 Database connected');
  } else {
    console.log('⚠️  No DATABASE_URL — running without database');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Agile Hub API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth:   POST http://localhost:${PORT}/api/auth/login`);
  });
}

start().catch(console.error);
