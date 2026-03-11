import { useState } from 'react';
import { Save, Plus, ExternalLink } from 'lucide-react';
import type { Project } from '../types';

interface SettingsPageProps {
  projects: Project[];
  currentProject: Project | null;
  onProjectCreate: (data: Partial<Project>) => void;
  onProjectUpdate: (id: number, data: Partial<Project>) => void;
  onProjectDelete: (id: number) => void;
}

export default function SettingsPage({ projects, currentProject, onProjectCreate, onProjectUpdate }: SettingsPageProps) {
  const [editProject, setEditProject] = useState<Partial<Project>>(currentProject || {});
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', icon: '📁', description: '', api_base_url: '', health_url: '', repo_url: '' });

  const handleSave = () => {
    if (editProject.id) {
      onProjectUpdate(editProject.id, editProject);
    }
  };

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    onProjectCreate(newProject);
    setNewProject({ name: '', icon: '📁', description: '', api_base_url: '', health_url: '', repo_url: '' });
    setShowNewProject(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-xl font-bold text-slate-800">專案設定</h2>
        <button onClick={() => setShowNewProject(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          <Plus size={16} /> 新增專案
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* New Project Form */}
        {showNewProject && (
          <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-3">
            <h3 className="font-semibold text-slate-800">新增專案</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProject.icon}
                  onChange={e => setNewProject(p => ({ ...p, icon: e.target.value }))}
                  className="w-12 px-2 py-2 border border-slate-300 rounded-lg text-center text-lg"
                />
                <input
                  type="text"
                  placeholder="專案名稱 *"
                  value={newProject.name}
                  onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="描述"
                value={newProject.description}
                onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="API Base URL"
                value={newProject.api_base_url}
                onChange={e => setNewProject(p => ({ ...p, api_base_url: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Health Check URL"
                value={newProject.health_url}
                onChange={e => setNewProject(p => ({ ...p, health_url: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="GitHub Repo URL"
                value={newProject.repo_url}
                onChange={e => setNewProject(p => ({ ...p, repo_url: e.target.value }))}
                className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewProject(false)} className="px-3 py-1.5 text-sm text-slate-600">取消</button>
              <button onClick={handleCreateProject} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg">建立</button>
            </div>
          </div>
        )}

        {/* Project List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-700">所有專案</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {projects.map(p => (
              <div key={p.id} className={`px-5 py-3 flex items-center justify-between hover:bg-slate-50 ${currentProject?.id === p.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon || '📁'}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{p.name}</h4>
                    {p.description && <p className="text-xs text-slate-500">{p.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noopener" className="p-1 text-slate-400 hover:text-blue-500">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">尚無專案，點擊上方「新增專案」開始</div>
            )}
          </div>
        </div>

        {/* Current Project Details */}
        {currentProject && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-800">目前專案設定 — {currentProject.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500">專案名稱</label>
                <input
                  type="text"
                  value={editProject.name || ''}
                  onChange={e => setEditProject(p => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Icon</label>
                <input
                  type="text"
                  value={editProject.icon || ''}
                  onChange={e => setEditProject(p => ({ ...p, icon: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">API Base URL</label>
                <input
                  type="text"
                  value={editProject.api_base_url || ''}
                  onChange={e => setEditProject(p => ({ ...p, api_base_url: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Health URL</label>
                <input
                  type="text"
                  value={editProject.health_url || ''}
                  onChange={e => setEditProject(p => ({ ...p, health_url: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-500">GitHub Repo</label>
                <input
                  type="text"
                  value={editProject.repo_url || ''}
                  onChange={e => setEditProject(p => ({ ...p, repo_url: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Save size={16} /> 儲存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
