import { useState } from 'react';
import {
  KanbanSquare, Timer, Building2,
  Users, Map, Bot, Settings, ChevronLeft, ChevronRight, Rocket, HelpCircle,
  LogOut
} from 'lucide-react';
import type { PageTab, Project, AuthUser } from '../types';

interface SidebarProps {
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
  currentProject?: Project | null;
  projects: Project[];
  onProjectChange: (project: Project) => void;
  onHelpOpen: () => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
}

const menuItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
  { id: 'kanban', label: '看板', icon: <KanbanSquare size={20} /> },
  { id: 'sprint', label: 'Sprint', icon: <Timer size={20} /> },
  { id: 'arch-dashboard', label: '架構儀表板', icon: <Building2 size={20} /> },
  { id: 'team', label: '團隊協作', icon: <Users size={20} /> },
  { id: 'roadmap', label: '路線圖', icon: <Map size={20} /> },
  { id: 'ai-automation', label: 'AI 自動化', icon: <Bot size={20} /> },
  { id: 'settings', label: '設定', icon: <Settings size={20} /> },
];

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-blue-500',
  member: 'bg-emerald-500',
};

export default function Sidebar({ activeTab, onTabChange, currentProject, projects, onProjectChange, onHelpOpen, authUser, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);

  return (
    <aside className={`flex flex-col bg-slate-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Rocket size={24} className="text-blue-400" />
            <span className="font-bold text-lg">Agile Hub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Project Selector */}
      <div className="relative px-3 py-3 border-b border-slate-700">
        <button
          onClick={() => setShowProjectMenu(!showProjectMenu)}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="text-lg">{currentProject?.icon || '📁'}</span>
          {!collapsed && (
            <span className="truncate text-slate-300">
              {currentProject?.name || '選擇專案'}
            </span>
          )}
        </button>
        {showProjectMenu && !collapsed && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-slate-800 rounded-lg shadow-xl z-50 border border-slate-600">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => { onProjectChange(p); setShowProjectMenu(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  currentProject?.id === p.id ? 'bg-slate-700 text-blue-400' : 'text-slate-300'
                }`}
              >
                <span>{p.icon || '📁'}</span>
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              collapsed ? 'justify-center' : ''
            } ${
              activeTab === item.id
                ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Info + Footer */}
      <div className="border-t border-slate-700">
        {/* Current User */}
        {authUser && (
          <div className={`px-3 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
            {collapsed ? (
              <div
                className={`w-8 h-8 ${ROLE_COLORS[authUser.role] || 'bg-slate-500'} rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer`}
                title={`${authUser.display_name} (${authUser.role})`}
                onClick={onLogout}
              >
                {authUser.display_name[0]}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 ${ROLE_COLORS[authUser.role] || 'bg-slate-500'} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {authUser.display_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{authUser.display_name}</div>
                  <div className="text-xs text-slate-500 truncate">{authUser.email}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="登出"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Help + Version */}
        <div className="p-3 pt-0">
          <button
            onClick={onHelpOpen}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}
            title="使用指南"
          >
            <HelpCircle size={18} />
            {!collapsed && <span>使用指南</span>}
          </button>
          {!collapsed && (
            <div className="text-xs text-slate-600 text-center mt-2">
              Agile Hub v1.0
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
