import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import type { Task, Member, Sprint } from '../types';
import { TaskStatus, Priority } from '../types';
import { TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';

interface TaskModalProps {
  task: Task | null;
  members: Member[];
  sprints: Sprint[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Task>) => void;
  onDelete?: (id: number) => void;
}

export default function TaskModal({ task, members, sprints, isOpen, onClose, onSave, onDelete }: TaskModalProps) {
  const [form, setForm] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setForm({ ...task });
    } else {
      setForm({
        title: '',
        description: '',
        status: TaskStatus.TODO,
        priority: Priority.P2,
        labels: [],
        notes: ''
      });
    }
  }, [task, isOpen]);

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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            {task ? '編輯任務' : '新增任務'}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
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

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
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
            <button
              onClick={handleSave}
              disabled={!form.title?.trim()}
              className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors"
            >
              <Save size={16} /> 儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
