import { useState } from 'react';
import {
  X, KanbanSquare, Timer, Building2, Users, Map, Bot, Settings,
  GripVertical, Plus, Search, Play, RefreshCw, MousePointerClick,
  ArrowRight, ChevronDown, ChevronUp, Lightbulb, Keyboard, Rocket
} from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  color: string;
  content: React.ReactNode;
}

export default function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  if (!isOpen) return null;

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? '' : id);
  };

  const sections: Section[] = [
    {
      id: 'overview',
      icon: <Rocket size={18} />,
      title: '平台總覽',
      color: 'text-blue-500',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            <strong>Agile Hub</strong> 是內部團隊共用的敏捷式管理平台，用來管理多個專案的開發流程。
            所有資料從各專案的 <code className="bg-slate-100 px-1 rounded text-xs">ARCHITECTURE.md</code> 自動匯入。
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <KanbanSquare size={14} className="text-blue-500" />
              <span>看板 — 拖拉式任務管理</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-violet-50 rounded-lg">
              <Timer size={14} className="text-violet-500" />
              <span>Sprint — 迭代規劃</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
              <Building2 size={14} className="text-emerald-500" />
              <span>架構儀表板 — 健康監控</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
              <Users size={14} className="text-amber-500" />
              <span>團隊協作 — 站會紀錄</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
              <Map size={14} className="text-pink-500" />
              <span>路線圖 — 季度規劃</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-cyan-50 rounded-lg">
              <Bot size={14} className="text-cyan-500" />
              <span>AI 自動化 — API 協作</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'kanban',
      icon: <KanbanSquare size={18} />,
      title: '📋 看板（Kanban Board）',
      color: 'text-blue-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <GripVertical size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div><strong>拖拉移動：</strong>直接拖動任務卡片到不同欄位，狀態會自動更新（待辦 → 進行中 → 審查中 → 完成）</div>
            </div>
            <div className="flex items-start gap-2">
              <Plus size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div><strong>新增任務：</strong>點右上角「新增任務」或各欄位的 + 按鈕</div>
            </div>
            <div className="flex items-start gap-2">
              <MousePointerClick size={16} className="text-violet-500 shrink-0 mt-0.5" />
              <div><strong>編輯任務：</strong>點擊任務卡片打開詳細編輯（標題、描述、優先級、負責人、標籤、工時等）</div>
            </div>
            <div className="flex items-start gap-2">
              <Search size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div><strong>篩選搜尋：</strong>可依關鍵字搜尋、依優先級（P0~P3）或負責人篩選</div>
            </div>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
            <Lightbulb size={12} className="inline mr-1" />
            小提示：任務優先級 P0 = 🔴 緊急、P1 = 🟠 重要、P2 = 🔵 一般、P3 = ⚪ 低
          </div>
        </div>
      ),
    },
    {
      id: 'sprint',
      icon: <Timer size={18} />,
      title: '🏃 Sprint 規劃',
      color: 'text-violet-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Plus size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div><strong>建立 Sprint：</strong>點右上角「新建 Sprint」，設定名稱、目標、日期範圍</div>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight size={16} className="text-green-500 shrink-0 mt-0.5" />
              <div><strong>分配任務：</strong>從底部 Backlog 列表使用「移入 Sprint...」下拉選單，將任務分配到對應 Sprint</div>
            </div>
            <div className="flex items-start gap-2">
              <Play size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div><strong>Sprint 狀態：</strong>📋 規劃中 → 🏃 進行中（啟動）→ ✅ 已完成</div>
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Lightbulb size={12} className="inline mr-1" />
            進度條會自動計算 Sprint 中已完成任務的比例
          </div>
        </div>
      ),
    },
    {
      id: 'arch',
      icon: <Building2 size={18} />,
      title: '🏗️ 架構儀表板',
      color: 'text-emerald-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <RefreshCw size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div><strong>健康檢查：</strong>點「檢查健康」會即時 ping 專案的 API 端點，確認線上狀態</div>
            </div>
            <div>
              <strong>模組健康度：</strong>顯示各子系統的完成度（綠色 ≥ 80% / 黃色 ≥ 50% / 紅色 &lt; 50%）
            </div>
            <div>
              <strong>功能完成度：</strong>已完成 / 進行中 / 待開發 的堆疊進度條
            </div>
            <div>
              <strong>安全性問題：</strong>從 ARCHITECTURE.md 解析的安全警告（CRITICAL / MEDIUM）
            </div>
            <div>
              <strong>技術棧 & 規模：</strong>前端 / 後端 / AI / 資料規模的摘要卡片
            </div>
          </div>
          <div className="p-2 bg-emerald-50 rounded-lg text-xs text-emerald-700">
            <Lightbulb size={12} className="inline mr-1" />
            資料來自 ARCHITECTURE.md 的自動快照，底部「環境 & 部署」表顯示各環境配置
          </div>
        </div>
      ),
    },
    {
      id: 'team',
      icon: <Users size={18} />,
      title: '👥 團隊協作',
      color: 'text-amber-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div>
              <strong>團隊成員：</strong>左側顯示所有成員及其角色（Admin / Member），點「新成員」可新增
            </div>
            <div>
              <strong>站會紀錄：</strong>右側以日期為單位，每天記錄：
            </div>
            <ul className="ml-4 space-y-1 text-xs">
              <li>📅 <strong>昨天完成</strong> — 回顧昨天的進度</li>
              <li>📋 <strong>今天計畫</strong> — 今天要做什麼</li>
              <li>🚧 <strong>阻礙</strong> — 有什麼卡住了</li>
            </ul>
            <div>
              用日期左右箭頭 <code className="bg-slate-100 px-1 rounded text-xs">&lt; &gt;</code> 切換不同日期的紀錄
            </div>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
            <Lightbulb size={12} className="inline mr-1" />
            建議每天站會時用「新增」按鈕快速記錄當天進度
          </div>
        </div>
      ),
    },
    {
      id: 'roadmap',
      icon: <Map size={18} />,
      title: '🗺️ 產品路線圖',
      color: 'text-pink-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div>
              <strong>季度時間軸：</strong>功能按 Q1~Q4 排列，每季顯示 feature 數量
            </div>
            <div>
              <strong>Feature 卡片：</strong>左側色條表示狀態 —
              <span className="text-green-600"> 綠色=已完成</span>、
              <span className="text-amber-600"> 黃色=進行中</span>、
              <span className="text-slate-500"> 灰色=計劃中</span>
            </div>
            <div>
              <strong>新增功能：</strong>點右上角「新增功能」，選擇季度、優先級、里程碑
            </div>
            <div>
              <strong>更新狀態：</strong>每張卡片都有下拉選單可直接切換狀態
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai',
      icon: <Bot size={18} />,
      title: '🤖 AI 自動化協作',
      color: 'text-cyan-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div>
              <strong>API 健康檢查：</strong>頂部卡片顯示專案的 health endpoint，點「執行檢查」即時測試
            </div>
            <div>
              <strong>自動化任務：</strong>設定 API 端點 + HTTP 方法，可手動「執行」或排程自動跑
            </div>
            <div>
              <strong>執行日誌：</strong>點 📋 圖示查看上次執行的回應（狀態碼、時間、內容）
            </div>
            <div>
              <strong>新增自動化：</strong>點右上角「新增自動化」，設定名稱、端點、方法、排程
            </div>
          </div>
          <div className="p-2 bg-cyan-50 rounded-lg text-xs text-cyan-700">
            <Lightbulb size={12} className="inline mr-1" />
            排程使用 Cron 表達式，例如 <code className="bg-cyan-100 px-1 rounded">*/30 * * * *</code> = 每 30 分鐘
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      icon: <Settings size={18} />,
      title: '⚙️ 專案設定',
      color: 'text-slate-500',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="space-y-2">
            <div>
              <strong>多專案管理：</strong>頂部「所有專案」列表，點「新增專案」建立新的管理項目
            </div>
            <div>
              <strong>專案設定：</strong>編輯名稱、Icon、API Base URL、Health URL、GitHub Repo
            </div>
            <div>
              <strong>切換專案：</strong>也可用左側欄的專案下拉選單快速切換
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'shortcuts',
      icon: <Keyboard size={18} />,
      title: '⌨️ 快捷操作',
      color: 'text-slate-600',
      content: (
        <div className="space-y-2 text-sm text-slate-600">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 font-medium">側欄收合</td>
                <td className="py-1.5">點側欄頂部 <code className="bg-slate-100 px-1 rounded">&lt;</code> / <code className="bg-slate-100 px-1 rounded">&gt;</code> 箭頭</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 font-medium">切換專案</td>
                <td className="py-1.5">側欄專案名稱下拉選單</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 font-medium">看板拖拉</td>
                <td className="py-1.5">長按任務卡片 → 拖到目標欄位</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 font-medium">快速新增</td>
                <td className="py-1.5">各頁面右上角藍色按鈕</td>
              </tr>
              <tr>
                <td className="py-1.5 pr-3 font-medium">健康檢查</td>
                <td className="py-1.5">架構儀表板「檢查健康」按鈕</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Rocket size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Agile Hub 使用指南</h2>
              <p className="text-xs text-slate-400">v1.0 — 內部敏捷管理平台</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content — Accordion */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map(section => (
            <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  expandedSection === section.id ? 'bg-slate-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className={section.color}>{section.icon}</span>
                <span className="flex-1 font-medium text-sm text-slate-700">{section.title}</span>
                {expandedSection === section.id
                  ? <ChevronUp size={16} className="text-slate-400" />
                  : <ChevronDown size={16} className="text-slate-400" />
                }
              </button>
              {expandedSection === section.id && (
                <div className="px-4 pb-4 pt-1">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">
            💡 資料來源：各專案 ARCHITECTURE.md 自動匯入 — 離線模式下使用 Demo 資料
          </p>
        </div>
      </div>
    </div>
  );
}
