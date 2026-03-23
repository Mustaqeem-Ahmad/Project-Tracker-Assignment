import React from 'react';
import { Task, Status, ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from '../../types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { PresenceStack } from '../presence/PresenceStack';
import { dueDateLabel, isOverdue } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/taskStore';
import { ROW_HEIGHT } from '../../hooks/useVirtualScroll';

interface Props {
  task: Task;
}

export const TaskRow = React.memo(({ task }: Props) => {
  const updateTaskStatus = useTaskStore(s => s.updateTaskStatus);
  const overdue = task.status !== 'done' && isOverdue(task.dueDate);
  const due = dueDateLabel(task.dueDate);

  return (
    <div
      className={`flex items-center gap-4 px-4 border-b border-slate-100 hover:bg-slate-50 transition-colors
        ${overdue ? 'bg-red-50/30' : 'bg-white'}`}
      style={{ height: ROW_HEIGHT }}
    >
      {/* Title */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <Avatar assigneeId={task.assigneeId} />
        <span className="text-sm text-slate-800 font-medium truncate">{task.title}</span>
        <PresenceStack taskId={task.id} />
      </div>

      {/* Priority */}
      <div className="w-24 flex-shrink-0">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Status dropdown */}
      <div className="w-32 flex-shrink-0">
        <select
          value={task.status}
          onChange={e => updateTaskStatus(task.id, e.target.value as Status)}
          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer outline-none
            ${STATUS_COLORS[task.status]}`}
        >
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Due date */}
      <div className="w-24 flex-shrink-0 text-right">
        <span className={`text-xs ${due.className}`}>{due.text}</span>
      </div>
    </div>
  );
});
TaskRow.displayName = 'TaskRow';
