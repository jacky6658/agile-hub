import { useState } from 'react';
import { Plus, Flag, X, Calendar, LayoutGrid } from 'lucide-react';
import type { Project, RoadmapFeature } from '../types';
import { Priority, RoadmapStatus } from '../types';
import { PRIORITY_CONFIG, ROADMAP_STATUS_CONFIG } from '../constants';

interface RoadmapPageProps {
  project: Project | null;
  features: RoadmapFeature[];
  onFeatureCreate: (data: Partial<RoadmapFeature>) => void;
  onFeatureUpdate: (id: number, data: Partial<RoadmapFeature>) => void;
  onFeatureDelete: (id: number) => void;
}

type ViewMode = 'quarter' | 'month';

const QUARTERS = ['2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'];

const MONTHS = [
  '2026-01', '2026-02', '2026-03',
  '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08', '2026-09',
  '2026-10', '2026-11', '2026-12',
];

const MONTH_LABELS: Record<string, string> = {
  '2026-01': '1月', '2026-02': '2月', '2026-03': '3月',
  '2026-04': '4月', '2026-05': '5月', '2026-06': '6月',
  '2026-07': '7月', '2026-08': '8月', '2026-09': '9月',
  '2026-10': '10月', '2026-11': '11月', '2026-12': '12月',
};

// 季度 → 月份映射（用於月份視圖顯示季度資料）
const QUARTER_TO_MONTHS: Record<string, string[]> = {
  '2026-Q1': ['2026-01', '2026-02', '2026-03'],
  '2026-Q2': ['2026-04', '2026-05', '2026-06'],
  '2026-Q3': ['2026-07', '2026-08', '2026-09'],
  '2026-Q4': ['2026-10', '2026-11', '2026-12'],
};

const MONTH_TO_QUARTER: Record<string, string> = {
  '2026-01': '2026-Q1', '2026-02': '2026-Q1', '2026-03': '2026-Q1',
  '2026-04': '2026-Q2', '2026-05': '2026-Q2', '2026-06': '2026-Q2',
  '2026-07': '2026-Q3', '2026-08': '2026-Q3', '2026-09': '2026-Q3',
  '2026-10': '2026-Q4', '2026-11': '2026-Q4', '2026-12': '2026-Q4',
};

// 判斷 feature 的 quarter 值是季度格式還是月份格式
function isMonthFormat(q?: string): boolean {
  return !!q && /^\d{4}-\d{2}$/.test(q);
}

export default function RoadmapPage({ project, features, onFeatureCreate, onFeatureUpdate }: RoadmapPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('quarter');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFeature, setNewFeature] = useState({
    title: '', description: '', quarter: '2026-Q1', priority: Priority.P2 as string, milestone: ''
  });

  const handleCreate = () => {
    if (!newFeature.title.trim()) return;
    onFeatureCreate({ ...newFeature, project_id: project?.id, status: RoadmapStatus.PLANNED, priority: newFeature.priority as Priority });
    setNewFeature({ title: '', description: '', quarter: viewMode === 'month' ? '2026-01' : '2026-Q1', priority: Priority.P2, milestone: '' });
    setShowNewForm(false);
  };

  // 排序功能（依優先級）
  const sortByPriority = (list: RoadmapFeature[]) =>
    [...list].sort((a, b) => {
      const pOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
      return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2);
    });

  // 季度視圖：取得該季度下的 features
  const getQuarterFeatures = (q: string) =>
    sortByPriority(features.filter(f => {
      if (f.quarter === q) return true;
      // 若 feature 用月份格式存，也歸入對應季度
      if (isMonthFormat(f.quarter) && MONTH_TO_QUARTER[f.quarter!] === q) return true;
      return false;
    }));

  // 月份視圖：取得該月份下的 features
  const getMonthFeatures = (month: string) =>
    sortByPriority(features.filter(f => {
      // 直接匹配月份
      if (f.quarter === month) return true;
      // 若 feature 用季度格式存，分配到該季度的第一個月
      if (!isMonthFormat(f.quarter) && QUARTER_TO_MONTHS[f.quarter!]?.[0] === month) return true;
      return false;
    }));

  // 當前月份高亮
  const currentMonth = '2026-03';

  const statusColors: Record<string, string> = {
    planned: 'border-l-slate-400 bg-slate-50',
    in_progress: 'border-l-amber-400 bg-amber-50',
    done: 'border-l-green-400 bg-green-50',
  };

  // 切換視圖時更新表單的時間選項
  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'month') {
      // 將季度轉換為月份
      const q = newFeature.quarter;
      if (!isMonthFormat(q)) {
        const months = QUARTER_TO_MONTHS[q];
        setNewFeature(f => ({ ...f, quarter: months?.[0] || '2026-01' }));
      }
    } else {
      // 將月份轉換為季度
      const q = newFeature.quarter;
      if (isMonthFormat(q)) {
        setNewFeature(f => ({ ...f, quarter: MONTH_TO_QUARTER[q] || '2026-Q1' }));
      }
    }
  };

  // 時間選項列表
  const timeOptions = viewMode === 'month' ? MONTHS : QUARTERS;
  const timeLabels = viewMode === 'month'
    ? MONTHS.map(m => ({ value: m, label: `2026 年 ${MONTH_LABELS[m]}` }))
    : QUARTERS.map(q => ({ value: q, label: q }));

  // 統計
  const totalDone = features.filter(f => f.status === 'done').length;
  const totalWip = features.filter(f => f.status === 'in_progress').length;
  const totalPlanned = features.filter(f => f.status === 'planned').length;

  // 渲染 Feature 卡片
  const renderFeatureCard = (feature: RoadmapFeature) => (
    <div
      key={feature.id}
      className={`border-l-4 rounded-lg p-3 ${statusColors[feature.status] || statusColors.planned}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">{PRIORITY_CONFIG[feature.priority]?.icon}</span>
            <h4 className="text-sm font-semibold text-slate-800">{feature.title}</h4>
          </div>
          {feature.description && (
            <p className="text-xs text-slate-500 mb-2 line-clamp-2">{feature.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={feature.status}
              onChange={e => onFeatureUpdate(feature.id, { status: e.target.value as RoadmapStatus })}
              className="text-xs px-1.5 py-0.5 border border-slate-200 rounded focus:outline-none"
            >
              {Object.entries(ROADMAP_STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            {feature.milestone && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Flag size={10} /> {feature.milestone}
              </span>
            )}
            {/* 在月份視圖中顯示季度標籤 */}
            {viewMode === 'month' && !isMonthFormat(feature.quarter) && (
              <span className="text-xs text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded">
                {feature.quarter}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white gap-3">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            {project?.icon} 產品路線圖
          </h2>
          {/* 統計 */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">{totalDone} 已完成</span>
            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700">{totalWip} 進行中</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{totalPlanned} 計劃中</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 視圖切換 */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => handleViewChange('quarter')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                viewMode === 'quarter' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutGrid size={13} /> 季度
            </button>
            <button
              onClick={() => handleViewChange('month')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar size={13} /> 月份
            </button>
          </div>
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Plus size={16} /> 新增功能
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {/* New Feature Form */}
        {showNewForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">新增路線圖功能</h3>
              <button onClick={() => setShowNewForm(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="功能名稱 *"
                value={newFeature.title}
                onChange={e => setNewFeature(f => ({ ...f, title: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="里程碑"
                value={newFeature.milestone}
                onChange={e => setNewFeature(f => ({ ...f, milestone: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newFeature.quarter}
                onChange={e => setNewFeature(f => ({ ...f, quarter: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                {timeLabels.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <select
                value={newFeature.priority}
                onChange={e => setNewFeature(f => ({ ...f, priority: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <textarea
              placeholder="描述..."
              value={newFeature.description}
              onChange={e => setNewFeature(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button onClick={handleCreate} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">建立</button>
            </div>
          </div>
        )}

        {/* ===== 季度視圖 ===== */}
        {viewMode === 'quarter' && (
          <div className="space-y-6">
            {QUARTERS.map(quarter => {
              const qFeatures = getQuarterFeatures(quarter);
              return (
                <div key={quarter}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="font-bold text-slate-800">{quarter}</h3>
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400">{qFeatures.length} features</span>
                  </div>
                  <div className="ml-2 sm:ml-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {qFeatures.map(renderFeatureCard)}
                    {qFeatures.length === 0 && (
                      <div className="sm:col-span-2 text-sm text-slate-400 py-3 text-center">尚無規劃</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== 月份視圖 ===== */}
        {viewMode === 'month' && (
          <div className="space-y-1">
            {QUARTERS.map(quarter => {
              const months = QUARTER_TO_MONTHS[quarter];
              const quarterTotal = months.reduce((sum, m) => sum + getMonthFeatures(m).length, 0);

              return (
                <div key={quarter} className="mb-6">
                  {/* 季度分隔標題 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{quarter}</span>
                    <div className="flex-1 h-px bg-blue-100" />
                    <span className="text-xs text-blue-400">{quarterTotal} features</span>
                  </div>

                  {/* 月份列 */}
                  <div className="ml-3 space-y-4">
                    {months.map(month => {
                      const mFeatures = getMonthFeatures(month);
                      const isCurrent = month === currentMonth;

                      return (
                        <div key={month} className={`rounded-lg ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-blue-500 ring-2 ring-blue-200' : 'bg-slate-300'}`} />
                            <h4 className={`text-sm font-semibold ${isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>
                              {MONTH_LABELS[month]}
                              {isCurrent && (
                                <span className="ml-2 text-xs font-normal text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">本月</span>
                              )}
                            </h4>
                            <div className="flex-1 h-px bg-slate-100" />
                            {mFeatures.length > 0 && (
                              <span className="text-xs text-slate-400">{mFeatures.length}</span>
                            )}
                          </div>

                          <div className="ml-2 sm:ml-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mFeatures.map(renderFeatureCard)}
                            {mFeatures.length === 0 && (
                              <div className="sm:col-span-2 text-xs text-slate-300 py-1">—</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
