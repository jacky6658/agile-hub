import { Clock, User, GripVertical, MessageSquare, FileText } from 'lucide-react';
import type { Task, Member } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface TaskCardProps {
  task: Task;
  members: Member[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, members, onDragStart, onClick }: TaskCardProps) {
  const assignee = members.find(m => m.id === task.assignee_id);
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={() => onClick(task)}
      className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      {/* Top: Priority + Labels */}
      <div className="flex items-center gap-1.5 mb-2">
        <GripVertical size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
        <span className="text-xs font-medium" style={{ color: priorityConfig.color === 'red' ? '#ef4444' : priorityConfig.color === 'orange' ? '#f97316' : priorityConfig.color === 'blue' ? '#3b82f6' : '#9ca3af' }}>
          {priorityConfig.icon} {task.priority}
        </span>
        {task.labels?.map(label => (
          <span key={label} className="px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
            {label}
          </span>
        ))}
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-slate-800 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-1">{task.description}</p>
      )}

      {/* Bottom: Assignee + Due date */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          {assignee ? (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-medium">
                {assignee.display_name.charAt(0)}
              </div>
              <span>{assignee.display_name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400">
              <User size={14} />
              <span>未指派</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.spec && <span title="有規格書"><FileText size={12} className="text-purple-400" /></span>}
          {task.notes && <MessageSquare size={12} className="text-slate-400" />}
          {task.due_date && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
              <Clock size={12} />
              <span>{new Date(task.due_date).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
