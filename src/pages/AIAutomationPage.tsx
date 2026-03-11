import { useState } from 'react';
import { Plus, Play, Power, PowerOff, Clock, CheckCircle2, XCircle, RefreshCw, Terminal, X } from 'lucide-react';
import type { Project, AIAutomation } from '../types';

interface AIAutomationPageProps {
  project: Project | null;
  automations: AIAutomation[];
  onAutomationCreate: (data: Partial<AIAutomation>) => void;
  onAutomationUpdate: (id: number, data: Partial<AIAutomation>) => void;
  onAutomationRun: (id: number) => void;
}

export default function AIAutomationPage({ project, automations, onAutomationCreate, onAutomationUpdate, onAutomationRun }: AIAutomationPageProps) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '', api_endpoint: '', method: 'GET', schedule: ''
  });
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [healthResult, setHealthResult] = useState<{ ok: boolean; time: number } | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const handleCreate = () => {
    if (!newAutomation.name.trim()) return;
    onAutomationCreate({ ...newAutomation, project_id: project?.id, enabled: false });
    setNewAutomation({ name: '', api_endpoint: '', method: 'GET', schedule: '' });
    setShowNewForm(false);
  };

  const handleHealthCheck = async () => {
    if (!project?.health_url) return;
    setCheckingHealth(true);
    const start = Date.now();
    try {
      const res = await fetch(project.health_url, { signal: AbortSignal.timeout(10000) });
      setHealthResult({ ok: res.ok, time: Date.now() - start });
    } catch {
      setHealthResult({ ok: false, time: Date.now() - start });
    }
    setCheckingHealth(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
          {project?.icon} AI 自動化協作
        </h2>
        <button onClick={() => setShowNewForm(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          <Plus size={16} /> 新增自動化
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        {/* Health Check Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800">API 健康檢查</h3>
            <button
              onClick={handleHealthCheck}
              disabled={checkingHealth}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                checkingHealth ? 'text-slate-400 bg-slate-100' : 'text-blue-600 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <RefreshCw size={14} className={checkingHealth ? 'animate-spin' : ''} />
              {checkingHealth ? '檢查中...' : '執行檢查'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">端點</div>
              <div className="text-sm text-slate-700 font-mono truncate">{project?.health_url || '未設定'}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">狀態</div>
              {healthResult ? (
                <div className="flex items-center gap-2">
                  {healthResult.ok ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className="text-sm">{healthResult.ok ? '正常' : '異常'}</span>
                  <span className="text-xs text-slate-400">{healthResult.time}ms</span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">尚未檢查</span>
              )}
            </div>
          </div>
        </div>

        {/* New Automation Form */}
        {showNewForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">新增自動化任務</h3>
              <button onClick={() => setShowNewForm(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="任務名稱 *"
                value={newAutomation.name}
                onChange={e => setNewAutomation(a => ({ ...a, name: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="API 端點 URL"
                value={newAutomation.api_endpoint}
                onChange={e => setNewAutomation(a => ({ ...a, api_endpoint: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newAutomation.method}
                onChange={e => setNewAutomation(a => ({ ...a, method: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                placeholder="排程 (cron)，例: 0 9 * * *"
                value={newAutomation.schedule}
                onChange={e => setNewAutomation(a => ({ ...a, schedule: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCreate} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">建立</button>
            </div>
          </div>
        )}

        {/* Automation List */}
        {automations.map(auto => (
          <div key={auto.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${auto.enabled ? 'bg-green-500' : 'bg-slate-300'}`} />
                <div>
                  <h4 className="font-semibold text-slate-800">{auto.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono">{auto.method} {auto.api_endpoint}</span>
                    {auto.schedule && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {auto.schedule}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {auto.last_run_status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    auto.last_run_status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {auto.last_run_status}
                  </span>
                )}
                <button
                  onClick={() => onAutomationRun(auto.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                >
                  <Play size={12} /> 執行
                </button>
                <button
                  onClick={() => onAutomationUpdate(auto.id, { enabled: !auto.enabled })}
                  className={`p-1.5 rounded-lg ${auto.enabled ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {auto.enabled ? <Power size={16} /> : <PowerOff size={16} />}
                </button>
                <button
                  onClick={() => setExpandedLog(expandedLog === auto.id ? null : auto.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50"
                >
                  <Terminal size={16} />
                </button>
              </div>
            </div>

            {/* Log */}
            {expandedLog === auto.id && auto.last_run_log && (
              <div className="border-t border-slate-200 bg-slate-900 p-3">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {auto.last_run_log}
                </pre>
              </div>
            )}
          </div>
        ))}

        {automations.length === 0 && !showNewForm && (
          <div className="text-center py-12 text-slate-400">
            <Terminal size={32} className="mx-auto mb-2 opacity-50" />
            <div className="text-sm">尚無自動化任務</div>
            <div className="text-xs mt-1">點擊「新增自動化」開始設定</div>
          </div>
        )}
      </div>
    </div>
  );
}
