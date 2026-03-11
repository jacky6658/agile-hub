import { useState, useEffect } from 'react';
import { Activity, Server, Database, GitBranch, RefreshCw, Check, AlertCircle, ShieldAlert, FileText, Code, Users } from 'lucide-react';
import type { Project, ArchSnapshot } from '../types';
import HealthBar from '../components/HealthBar';

interface ArchDashboardPageProps {
  project: Project | null;
  snapshots: ArchSnapshot[];
  onCreateSnapshot: (data: Partial<ArchSnapshot>) => void;
  onRefresh: () => void;
}

// 預設 Step1ne 架構數據（中文標籤）
const DEFAULT_HEALTH_DATA: Record<string, number> = {
  '前端 (React 19)': 95,
  '後端 (Express 5)': 90,
  '資料庫 (PostgreSQL)': 98,
  'AI 整合 (Gemini)': 70,
  '爬蟲系統': 55,
  '安全性': 40,
  '測試覆蓋': 10,
  'CI/CD': 20,
};

export default function ArchDashboardPage({ project, snapshots }: ArchDashboardPageProps) {
  const [healthStatus, setHealthStatus] = useState<{ ok: boolean; loading: boolean; error?: string }>({ ok: false, loading: false });

  const latestSnapshot = snapshots[0];
  const healthData = latestSnapshot?.health_data || DEFAULT_HEALTH_DATA;
  const featuresDone = latestSnapshot?.features_done || 18;
  const featuresWip = latestSnapshot?.features_wip || 4;
  const featuresTodo = latestSnapshot?.features_todo || 14;
  const apiCount = latestSnapshot?.api_count || 45;
  const dbTableCount = latestSnapshot?.db_table_count || 10;

  const totalFeatures = featuresDone + featuresWip + featuresTodo;
  const overallHealth = Object.values(healthData).reduce((a, b) => a + b, 0) / Object.keys(healthData).length;

  // Check health endpoint
  const checkHealth = async () => {
    if (!project?.health_url) return;
    setHealthStatus({ ok: false, loading: true });
    try {
      const res = await fetch(project.health_url, { signal: AbortSignal.timeout(10000) });
      setHealthStatus({ ok: res.ok, loading: false });
    } catch (e) {
      setHealthStatus({ ok: false, loading: false, error: (e as Error).message });
    }
  };

  useEffect(() => {
    if (project?.health_url) checkHealth();
  }, [project?.id]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
          {project?.icon} 系統架構儀表板
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={checkHealth} className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
            <RefreshCw size={14} /> 檢查健康
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Overall Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">整體健康度</span>
              <Activity size={18} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{Math.round(overallHealth)}%</div>
            <div className="mt-2 h-2 bg-slate-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${overallHealth}%` }} />
            </div>
          </div>

          {/* API Health */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">API 狀態</span>
              {healthStatus.loading ? (
                <RefreshCw size={18} className="text-amber-500 animate-spin" />
              ) : healthStatus.ok ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <AlertCircle size={18} className="text-red-500" />
              )}
            </div>
            <div className="text-lg font-semibold">
              {healthStatus.loading ? '檢查中...' : healthStatus.ok ? '✅ 正常' : '❌ 離線'}
            </div>
            <div className="text-xs text-slate-400 mt-1 truncate">{project?.health_url || '未設定'}</div>
          </div>

          {/* API Count */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">API 端點</span>
              <Server size={18} className="text-violet-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{apiCount}</div>
            <div className="text-xs text-slate-400 mt-1">endpoints</div>
          </div>

          {/* DB Tables */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">資料表</span>
              <Database size={18} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-slate-800">{dbTableCount}</div>
            <div className="text-xs text-slate-400 mt-1">tables</div>
          </div>
        </div>

        {/* Health Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">模組健康度</h3>
            <div className="space-y-3">
              {Object.entries(healthData).map(([key, value]) => (
                <HealthBar key={key} label={key} value={value as number} />
              ))}
            </div>
          </div>

          {/* Feature Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">功能完成度</h3>

            {/* Donut-like stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">{featuresDone}</div>
                <div className="text-xs text-green-600 mt-1">已完成</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-600">{featuresWip}</div>
                <div className="text-xs text-amber-600 mt-1">進行中</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-50">
                <div className="text-2xl font-bold text-slate-600">{featuresTodo}</div>
                <div className="text-xs text-slate-600 mt-1">待開發</div>
              </div>
            </div>

            {/* Stacked progress bar */}
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex">
              <div className="bg-green-500 transition-all" style={{ width: `${(featuresDone / totalFeatures) * 100}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${(featuresWip / totalFeatures) * 100}%` }} />
            </div>
            <div className="text-xs text-slate-500 text-center mt-2">
              {Math.round((featuresDone / totalFeatures) * 100)}% 完成
            </div>

            {/* Repository info */}
            {project?.repo_url && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <GitBranch size={12} />
                  <a href={project.repo_url} target="_blank" rel="noopener" className="hover:text-blue-500 transition-colors truncate">
                    {project.repo_url}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Alerts + Tech Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Security Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-500" /> 安全性問題
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-red-700 bg-red-200 px-1.5 py-0.5 rounded">CRITICAL</span>
                  <span className="text-sm font-medium text-red-800">硬編碼 DB 密碼</span>
                </div>
                <p className="text-xs text-red-600">27 個檔案包含明碼資料庫密碼（server.js, routes-api.js, init-db.js 等）</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded">MEDIUM</span>
                  <span className="text-sm font-medium text-amber-800">vite.config 環境變數暴露</span>
                </div>
                <p className="text-xs text-amber-600">process.env 整體暴露到瀏覽器端</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-700 bg-amber-200 px-1.5 py-0.5 rounded">MEDIUM</span>
                  <span className="text-sm font-medium text-amber-800">認證系統不完整</span>
                </div>
                <p className="text-xs text-amber-600">使用 localStorage 模擬登入狀態，非真正認證</p>
              </div>
            </div>
          </div>

          {/* Tech Stack & Data Scale */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Code size={18} className="text-blue-500" /> 技術棧 & 規模
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50">
                  <div className="text-xs text-blue-500 mb-1">前端</div>
                  <div className="text-xs font-medium text-slate-700">React 19 + Vite 6 + TypeScript</div>
                  <div className="text-xs text-slate-400">Tailwind CSS 3 • 15 頁面 • ~1.1MB</div>
                </div>
                <div className="p-2.5 rounded-lg bg-green-50">
                  <div className="text-xs text-green-500 mb-1">後端</div>
                  <div className="text-xs font-medium text-slate-700">Express 5 + PostgreSQL</div>
                  <div className="text-xs text-slate-400">~45 routes • 4300+ 行 • 10+ services</div>
                </div>
                <div className="p-2.5 rounded-lg bg-violet-50">
                  <div className="text-xs text-violet-500 mb-1">AI</div>
                  <div className="text-xs font-medium text-slate-700">Google Gemini + Perplexity</div>
                  <div className="text-xs text-slate-400">配對評分 • 履歷解析 • GitHub 分析</div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50">
                  <div className="text-xs text-amber-500 mb-1">資料規模</div>
                  <div className="text-xs font-medium text-slate-700">1,347 候選人 • 53 職缺</div>
                  <div className="text-xs text-slate-400">12+ 資料表 • 3 顧問</div>
                </div>
              </div>
            </div>

            {/* Snapshot info */}
            {latestSnapshot?.notes && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                  <FileText size={11} /> 資料來源
                </div>
                <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{latestSnapshot.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-slate-500" /> 環境 & 部署
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 text-slate-500 font-medium">環境</th>
                  <th className="text-left py-2 pr-4 text-slate-500 font-medium">前端 URL</th>
                  <th className="text-left py-2 pr-4 text-slate-500 font-medium">後端 URL</th>
                  <th className="text-left py-2 pr-4 text-slate-500 font-medium">CORS</th>
                  <th className="text-left py-2 text-slate-500 font-medium">狀態</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">本機開發</td>
                  <td className="py-2 pr-4"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">localhost:3000</code></td>
                  <td className="py-2 pr-4"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">localhost:3001</code></td>
                  <td className="py-2 pr-4">Vite Proxy</td>
                  <td className="py-2"><span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✅ 已設定</span></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium">Zeabur 正式</td>
                  <td className="py-2 pr-4"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">step1ne.zeabur.app</code></td>
                  <td className="py-2 pr-4"><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">backendstep1ne.zeabur.app</code></td>
                  <td className="py-2 pr-4">白名單</td>
                  <td className="py-2"><span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">✅ 運行中</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
