import { useState, useEffect } from 'react';
import { X, Save, Trash2, Send, Clock, UserCheck, ArrowRight, MessageSquare, PlusCircle, Activity } from 'lucide-react';
import type { Task, Member, Sprint, TaskActivity } from '../types';
import { TaskStatus, Priority } from '../types';
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { api } from '../services/apiConfig';

interface TaskModalProps {
  task: Task | null;
  members: Member[];
  sprints: Sprint[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  onDelete?: (id: number) => void;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  create: <PlusCircle size={14} className="text-green-500" />,
  status_change: <ArrowRight size={14} className="text-blue-500" />,
  assign: <UserCheck size={14} className="text-purple-500" />,
  unassign: <UserCheck size={14} className="text-slate-400" />,
  priority_change: <Activity size={14} className="text-amber-500" />,
  comment: <MessageSquare size={14} className="text-emerald-500" />,
  update: <Clock size={14} className="text-slate-400" />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '剛剛';
  if (mins < 60) return `${mins} 分鐘前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小時前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return new Date(dateStr).toLocaleDateString('zh-TW');
}

export default function TaskModal({ task, members, sprints, isOpen, onClose, onSave, onDelete }: TaskModalProps) {
  const [form, setForm] = useState<Partial<Task>>({});
  const [activePanel, setActivePanel] = useState<'edit' | 'activity'>('edit');
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [comment, setComment] = useState('');
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({ ...task });
      loadActivities(task.id);
    } else {
      setForm({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: Priority.P2,
        labels: [],
        notes: ''
      });
      setActivities([]);
    }
    setActivePanel('edit');
    setComment('');
  }, [task, isOpen]);

  const loadActivities = async (taskId: number) => {
    setLoadingActivities(true);
    try {
      const data = await api.get<TaskActivity[]>(`/activities?task_id=${taskId}&limit=50`);
      setActivities(data);
    } catch {
      // If API offline, just show empty
      setActivities([]);
    }
    setLoadingActivities(false);
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !task) return;
    try {
      await api.post('/activities', {
        task_id: task.id,
        project_id: task.project_id,
        action: 'comment',
        detail: comment.trim(),
      });
      setComment('');
      loadActivities(task.id);
    } catch (e) {
      console.error('Failed to add comment:', e);
    }
  };

  if (!isOpen) return null;

  const handleSave = () => {
    if (!form.title?.trim()) return;
    onSave(form);
    onClose();
  };

  const handleLabelInput = (value: string) => {
    const labels = value.split(',').map(l => l.trim()).filter(Boolean);
    setForm(f => ({ ...f, labels }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-800">
              {task ? '編輯任務' : '新增任務'}
            </h3>
            {task && (
              <div className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setActivePanel('edit')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activePanel === 'edit' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  編輯
                </button>
                <button
                  onClick={() => setActivePanel('activity')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${activePanel === 'activity' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Activity size={12} />
                  活動紀錄
                  {activities.length > 0 && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 rounded-full">{activities.length}</span>
                  )}
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'edit' ? (
            /* ===== Edit Panel ===== */
            <div className="px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-slate-700">任務標題 *</label>
                <input
                  type="text"
                  value={form.title || ''}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入任務標題..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-slate-700">描述</label>
                <textarea
                  value={form.description || ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="任務描述..."
                />
              </div>

              {/* Status + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">狀態</label>
                  <select
                    value={form.status || TaskStatus.TODO}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(TASK_STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">優先級</label>
                  <select
                    value={form.priority || Priority.P2}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Assignee + Sprint */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">負責人</label>
                  <select
                    value={form.assignee_id ?? ''}
                    onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value ? Number(e.target.value) : null }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">未指派</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.display_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Sprint</label>
                  <select
                    value={form.sprint_id ?? ''}
                    onChange={e => setForm(f => ({ ...f, sprint_id: e.target.value ? Number(e.target.value) : null }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Backlog</option>
                    {sprints.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due date + Labels */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">到期日</label>
                  <input
                    type="date"
                    value={form.due_date || ''}
                    onChange={e => setForm(f => ({ ...f, due_date: e.target.value || null }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">標籤</label>
                  <input
                    type="text"
                    value={form.labels?.join(', ') || ''}
                    onChange={e => handleLabelInput(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="前端, API, Bug..."
                  />
                </div>
              </div>

              {/* Estimated hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">預估工時</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.estimated_hours ?? ''}
                    onChange={e => setForm(f => ({ ...f, estimated_hours: e.target.value ? Number(e.target.value) : null }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="小時"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">實際工時</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.actual_hours ?? ''}
                    onChange={e => setForm(f => ({ ...f, actual_hours: e.target.value ? Number(e.target.value) : null }))}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="小時"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-slate-700">備註</label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="協作備註..."
                />
              </div>
            </div>
          ) : (
            /* ===== Activity Panel ===== */
            <div className="px-6 py-4">
              {/* Comment Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="新增留言..."
                />
                <button
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Activity List */}
              {loadingActivities ? (
                <div className="text-center py-8 text-slate-400 text-sm">載入中...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">尚無活動紀錄</div>
              ) : (
                <div className="space-y-1">
                  {activities.map(act => (
                    <div key={act.id} className={`flex gap-3 py-2.5 px-3 rounded-lg ${act.action === 'comment' ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50'}`}>
                      <div className="mt-0.5 shrink-0">
                        {ACTION_ICONS[act.action] || <Clock size={14} className="text-slate-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-700">
                          <span className="font-medium">{act.member_name || act.actor_name || 'System'}</span>
                          {act.action === 'comment' ? (
                            <span className="ml-1 text-slate-600">{act.detail}</span>
                          ) : (
                            <span className="ml-1 text-slate-500">{act.detail}</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{timeAgo(act.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl shrink-0">
          {task && onDelete ? (
            <button
              onClick={() => { onDelete(task.id); onClose(); }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} /> 刪除
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              取消
            </button>
            {activePanel === 'edit' && (
              <button
                onClick={handleSave}
                disabled={!form.title?.trim()}
                className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors"
              >
                <Save size={16} /> 儲存
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
