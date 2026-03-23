import React, { useRef } from 'react';
import { Task } from '../../types';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { PresenceStack } from '../presence/PresenceStack';
import { dueDateLabel, isOverdue } from '../../utils/dateUtils';
import { useDrag } from '../../hooks/useDrag';

interface Props {
  task: Task;
}

export const TaskCard = React.memo(({ task }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { startDrag } = useDrag();
  const overdue = task.status !== 'done' && isOverdue(task.dueDate);
  const due = dueDateLabel(task.dueDate);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!cardRef.current) return;
    startDrag(e, task, cardRef.current);
  };

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      className={`
        bg-white rounded-xl p-3 border shadow-sm cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow duration-150 select-none
        ${overdue ? 'border-red-200 bg-red-50/40' : 'border-slate-200'}
      `}
      style={{ touchAction: 'none' }}
    >
      {/* Title */}
      <p className="text-sm font-medium text-slate-800 mb-2 leading-snug line-clamp-2">
        {task.title}
      </p>

      {/* Priority Badge */}
      <div className="mb-2.5">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Avatar assigneeId={task.assigneeId} />
          <PresenceStack taskId={task.id} />
        </div>
        <span className={`text-xs flex-shrink-0 ${due.className}`}>
          {due.text}
        </span>
      </div>
    </div>
  );
});
TaskCard.displayName = 'TaskCard';
