import { useState } from 'react';
import { Plus, Calendar, Target, ChevronDown, ChevronUp, Play, CheckCircle2, Clock } from 'lucide-react';
import type { Task, Member, Sprint, Project } from '../types';
import { SprintStatus, TaskStatus } from '../types';
import { SPRINT_STATUS_CONFIG, TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';

interface SprintPageProps {
  project: Project | null;
  tasks: Task[];
  members: Member[];
  sprints: Sprint[];
  onSprintCreate: (data: Partial<Sprint>) => void;
  onSprintUpdate: (id: number, data: Partial<Sprint>) => void;
  onSprintDelete: (id: number) => void;
  onTaskUpdate: (id: number, data: Partial<Task>) => void;
}

export default function SprintPage({ project, tasks, members, sprints, onSprintCreate, onSprintUpdate, onTaskUpdate }: SprintPageProps) {
  const [expandedSprint, setExpandedSprint] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSprint, setNewSprint] = useState({ name: '', goal: '', start_date: '', end_date: '' });

  const backlogTasks = tasks.filter(t => !t.sprint_id);

  const handleCreateSprint = () => {
    if (!newSprint.name.trim()) return;
    onSprintCreate({ ...newSprint, project_id: project?.id, status: SprintStatus.PLANNING });
    setNewSprint({ name: '', goal: '', start_date: '', end_date: '' });
    setShowNewForm(false);
  };

  const getSprintProgress = (sprintId: number) => {
    const sprintTasks = tasks.filter(t => t.sprint_id === sprintId);
    if (sprintTasks.length === 0) return 0;
    const done = sprintTasks.filter(t => t.status === TaskStatus.DONE).length;
    return Math.round((done / sprintTasks.length) * 100);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          {project?.icon} Sprint 規劃
        </h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} /> 新建 Sprint
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
        {/* New Sprint Form */}
        {showNewForm && (
          <div className="bg-white rounded-xl border border-blue-200 p-4 space-y-3">
            <h3 className="font-semibold text-slate-800">新建 Sprint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Sprint 名稱"
                value={newSprint.name}
                onChange={e => setNewSprint(s => ({ ...s, name: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Sprint 目標"
                value={newSprint.goal}
                onChange={e => setNewSprint(s => ({ ...s, goal: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newSprint.start_date}
                onChange={e => setNewSprint(s => ({ ...s, start_date: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={newSprint.end_date}
                onChange={e => setNewSprint(s => ({ ...s, end_date: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNewForm(false)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">取消</button>
              <button onClick={handleCreateSprint} className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">建立</button>
            </div>
          </div>
        )}

        {/* Sprint List */}
        {sprints.map(sprint => {
          const sprintTasks = tasks.filter(t => t.sprint_id === sprint.id);
          const progress = getSprintProgress(sprint.id);
          const statusConfig = SPRINT_STATUS_CONFIG[sprint.status as SprintStatus];
          const isExpanded = expandedSprint === sprint.id;

          return (
            <div key={sprint.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Sprint Header */}
              <div
                className="px-4 py-3 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedSprint(isExpanded ? null : sprint.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{statusConfig?.icon}</span>
                  <h4 className="font-semibold text-slate-800 flex-1">{sprint.name}</h4>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1.5 ml-9">
                  {sprint.start_date && sprint.end_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {sprint.start_date} ~ {sprint.end_date}
                    </span>
                  )}
                  {sprint.goal && (
                    <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-none">
                      <Target size={12} className="shrink-0" />
                      {sprint.goal}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2 ml-9">
                  <div className="w-20 sm:w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{progress}%</span>
                  <span className="text-xs text-slate-400">{sprintTasks.length} 任務</span>

                  {sprint.status === SprintStatus.PLANNING && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSprintUpdate(sprint.id, { status: SprintStatus.ACTIVE }); }}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Play size={12} /> 啟動
                    </button>
                  )}
                  {sprint.status === SprintStatus.ACTIVE && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSprintUpdate(sprint.id, { status: SprintStatus.COMPLETED }); }}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <CheckCircle2 size={12} /> 完成
                    </button>
                  )}
                </div>
              </div>

              {/* Sprint Tasks */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  {sprintTasks.length === 0 ? (
                    <div className="p-4 text-sm text-slate-400 text-center">尚無任務，從 Backlog 移入任務</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">任務</th>
                          <th className="px-4 py-2 text-left font-medium w-24">狀態</th>
                          <th className="px-4 py-2 text-left font-medium w-20">優先</th>
                          <th className="px-4 py-2 text-left font-medium w-24">負責人</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sprintTasks.map(task => (
                          <tr key={task.id} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-2 text-slate-800">{task.title}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${TASK_STATUS_CONFIG[task.status]?.bgColor} ${TASK_STATUS_CONFIG[task.status]?.textColor}`}>
                                {TASK_STATUS_CONFIG[task.status]?.label}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs">{PRIORITY_CONFIG[task.priority]?.icon} {task.priority}</td>
                            <td className="px-4 py-2 text-xs text-slate-500">
                              {members.find(m => m.id === task.assignee_id)?.display_name || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Backlog */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h4 className="font-semibold text-slate-600 flex items-center gap-2">
              <Clock size={16} /> Backlog
              <span className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full">{backlogTasks.length}</span>
            </h4>
          </div>
          <div className="divide-y divide-slate-100">
            {backlogTasks.slice(0, 20).map(task => (
              <div key={task.id} className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{PRIORITY_CONFIG[task.priority]?.icon}</span>
                  <span className="text-sm text-slate-700">{task.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {sprints.filter(s => s.status !== SprintStatus.COMPLETED).length > 0 && (
                    <select
                      value=""
                      onChange={e => {
                        if (e.target.value) onTaskUpdate(task.id, { sprint_id: Number(e.target.value) });
                      }}
                      className="text-xs px-2 py-1 border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="">移入 Sprint...</option>
                      {sprints.filter(s => s.status !== SprintStatus.COMPLETED).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
            {backlogTasks.length === 0 && (
              <div className="p-4 text-sm text-slate-400 text-center">Backlog 為空</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
