import { useState, useCallback } from 'react';
import { Plus, Search, RefreshCw, Target, CheckCircle2, Circle, Clock, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Task, Member, Sprint, Project, RoadmapFeature } from '../types';
import { TaskStatus } from '../types';
import { KANBAN_COLUMNS, TASK_STATUS_CONFIG } from '../constants';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

interface KanbanPageProps {
  project: Project | null;
  tasks: Task[];
  members: Member[];
  sprints: Sprint[];
  features?: RoadmapFeature[];
  onTaskCreate: (data: Partial<Task>) => void;
  onTaskUpdate: (id: number, data: Partial<Task>) => void;
  onTaskDelete: (id: number) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function KanbanPage({ project, tasks, members, sprints, features = [], onTaskCreate, onTaskUpdate, onTaskDelete, onRefresh, loading }: KanbanPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterAssignee && String(t.assignee_id) !== filterAssignee) return false;
    return true;
  });

  const getColumnTasks = (status: TaskStatus) =>
    filteredTasks
      .filter(t => t.status === status)
      .sort((a, b) => a.sort_order - b.sort_order);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', String(task.id));
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).classList.add('task-card-dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = Number(e.dataTransfer.getData('text/plain'));
    if (taskId) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  }, [onTaskUpdate]);

  const handleTaskClick = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleNewTask = (_status?: TaskStatus) => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Task>) => {
    if (editTask) {
      onTaskUpdate(editTask.id, data);
    } else {
      onTaskCreate({ ...data, project_id: project?.id, status: data.status || TaskStatus.TODO });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
            <span className="hidden sm:inline">{project?.icon} {project?.name || 'Agile Hub'} — </span>看板
          </h2>
          <button
            onClick={onRefresh}
            className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋任務..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
            />
          </div>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block"
          >
            <option value="">所有優先級</option>
            <option value="P0">P0 緊急</option>
            <option value="P1">P1 重要</option>
            <option value="P2">P2 一般</option>
            <option value="P3">P3 低</option>
          </select>

          {/* Assignee filter */}
          <select
            value={filterAssignee}
            onChange={e => setFilterAssignee(e.target.value)}
            className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hidden sm:block"
          >
            <option value="">所有成員</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.display_name}</option>
            ))}
          </select>

          {/* New task */}
          <button
            onClick={() => handleNewTask()}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0"
          >
            <Plus size={16} /> <span className="hidden sm:inline">新增任務</span><span className="sm:hidden">新增</span>
          </button>
        </div>
      </div>

      {/* ===== 專案進度總覽 ===== */}
      {(tasks.length > 0 || features.length > 0) && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
          {/* 收合按鈕 */}
          <button
            onClick={() => setShowOverview(!showOverview)}
            className="w-full flex items-center justify-between px-6 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Target size={12} /> 專案進度總覽
            </span>
            {showOverview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showOverview && (() => {
            // 任務統計
            const totalTasks = tasks.length;
            const doneTasks = tasks.filter(t => t.status === 'done').length;
            const wipTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'review').length;
            const todoTasks = tasks.filter(t => t.status === 'todo').length;
            const backlogTasks = tasks.filter(t => t.status === 'backlog').length;
            const unclaimedTasks = tasks.filter(t => !t.assignee_id && t.status !== 'done').length;
            const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            // 功能統計
            const doneFeatures = features.filter(f => f.status === 'done');
            const wipFeatures = features.filter(f => f.status === 'in_progress');
            const plannedFeatures = features.filter(f => f.status === 'planned');

            return (
              <div className="px-6 pb-4 space-y-4">
                {/* 第一行：最終目標 + 整體進度 */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Target size={16} className="text-blue-600" />
                      <span className="text-sm font-bold text-slate-800">最終目標：完成 {project?.name || '系統'}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        taskProgress >= 80 ? 'bg-green-100 text-green-700' :
                        taskProgress >= 40 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {taskProgress}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="bg-green-500 transition-all duration-500" style={{ width: `${(doneTasks / Math.max(totalTasks, 1)) * 100}%` }} />
                      <div className="bg-amber-400 transition-all duration-500" style={{ width: `${(wipTasks / Math.max(totalTasks, 1)) * 100}%` }} />
                      <div className="bg-blue-300 transition-all duration-500" style={{ width: `${(todoTasks / Math.max(totalTasks, 1)) * 100}%` }} />
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> 已完成 {doneTasks}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 進行中 {wipTasks}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-300" /> 待辦 {todoTasks}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Backlog {backlogTasks}</span>
                    </div>
                  </div>

                  {/* 快速統計卡片 */}
                  <div className="flex gap-3 shrink-0 mt-3 md:mt-0">
                    <div className="text-center px-3 py-2 rounded-lg bg-white border border-slate-200 min-w-[70px]">
                      <div className="text-lg font-bold text-slate-800">{totalTasks}</div>
                      <div className="text-xs text-slate-500">總任務</div>
                    </div>
                    {unclaimedTasks > 0 && (
                      <div className="text-center px-3 py-2 rounded-lg bg-orange-50 border border-orange-200 min-w-[70px]">
                        <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                          <UserPlus size={14} /> {unclaimedTasks}
                        </div>
                        <div className="text-xs text-orange-500">待認領</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 第二行：功能完成清單 */}
                {features.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-2">系統功能完成度</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* 已完成 */}
                      <div className="bg-white rounded-lg border border-green-200 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className="text-xs font-semibold text-green-700">已完成功能 ({doneFeatures.length})</span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {doneFeatures.map(f => (
                            <div key={f.id} className="text-xs text-green-600 flex items-center gap-1.5">
                              <CheckCircle2 size={10} className="shrink-0" />
                              <span className="truncate">{f.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 進行中 */}
                      <div className="bg-white rounded-lg border border-amber-200 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Clock size={14} className="text-amber-500" />
                          <span className="text-xs font-semibold text-amber-700">開發中 ({wipFeatures.length})</span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {wipFeatures.map(f => (
                            <div key={f.id} className="text-xs text-amber-600 flex items-center gap-1.5">
                              <Clock size={10} className="shrink-0" />
                              <span className="truncate">{f.title}</span>
                            </div>
                          ))}
                          {wipFeatures.length === 0 && <div className="text-xs text-slate-400">—</div>}
                        </div>
                      </div>

                      {/* 尚未完成 */}
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Circle size={14} className="text-slate-400" />
                          <span className="text-xs font-semibold text-slate-600">尚未完成 ({plannedFeatures.length})</span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {plannedFeatures.map(f => (
                            <div key={f.id} className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Circle size={10} className="shrink-0" />
                              <span className="truncate">{f.title}</span>
                            </div>
                          ))}
                          {plannedFeatures.length === 0 && <div className="text-xs text-slate-400">全部完成 🎉</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-3 sm:p-6">
        <div className="flex gap-3 sm:gap-4 min-w-max h-full">
          {KANBAN_COLUMNS.map(status => {
            const config = TASK_STATUS_CONFIG[status];
            const columnTasks = getColumnTasks(status);

            return (
              <div
                key={status}
                className={`w-64 sm:w-72 flex flex-col rounded-xl bg-slate-50 kanban-column ${
                  dragOverColumn === status ? 'kanban-drop-target' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.bgColor.replace('100', '500')}`} />
                    <span className="text-sm font-semibold text-slate-700">{config.label}</span>
                    <span className="text-xs text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setEditTask(null); setModalOpen(true); }}
                    className="p-1 rounded hover:bg-slate-200 text-slate-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      members={members}
                      onDragStart={handleDragStart}
                      onClick={handleTaskClick}
                    />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-sm text-slate-400">
                      拖放任務到此欄位
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editTask}
        members={members}
        sprints={sprints}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSave={handleSave}
        onDelete={onTaskDelete}
      />
    </div>
  );
}
