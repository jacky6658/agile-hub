import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './init-db.js';
import apiRoutes from './routes-api.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

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
  });
}

start().catch(console.error);
