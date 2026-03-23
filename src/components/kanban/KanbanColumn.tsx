import React, { useState, useEffect } from 'react';
import { Task, Status, STATUS_LABELS } from '../../types';
import { TaskCard } from './TaskCard';

const COLUMN_COLORS: Record<Status, string> = {
  todo:        'bg-slate-100 border-slate-200',
  in_progress: 'bg-blue-50 border-blue-200',
  in_review:   'bg-purple-50 border-purple-200',
  done:        'bg-green-50 border-green-200',
};

const HEADER_COLORS: Record<Status, string> = {
  todo:        'text-slate-600 bg-slate-200',
  in_progress: 'text-blue-700 bg-blue-200',
  in_review:   'text-purple-700 bg-purple-200',
  done:        'text-green-700 bg-green-200',
};

interface Props {
  status: Status;
  tasks: Task[];
}

export const KanbanColumn = React.memo(({ status, tasks }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragHeight, setDragHeight] = useState(0);

  useEffect(() => {
    const onDragStart = (e: Event) => {
      const ce = e as CustomEvent;
      setDragHeight(ce.detail.height);
    };
    const onDragOver = (e: Event) => {
      const ce = e as CustomEvent;
      setIsDragOver(ce.detail.column === status);
    };
    const onDragEnd = () => {
      setIsDragOver(false);
      setDragHeight(0);
    };

    window.addEventListener('drag-start', onDragStart);
    window.addEventListener('drag-over-column', onDragOver);
    window.addEventListener('drag-end', onDragEnd);
    return () => {
      window.removeEventListener('drag-start', onDragStart);
      window.removeEventListener('drag-over-column', onDragOver);
      window.removeEventListener('drag-end', onDragEnd);
    };
  }, [status]);

  return (
    <div
      data-column={status}
      className={`
        flex flex-col rounded-2xl border-2 transition-all duration-150 overflow-hidden
        ${COLUMN_COLORS[status]}
        ${isDragOver ? 'ring-2 ring-indigo-400 ring-offset-1 scale-[1.01]' : ''}
      `}
      style={{ minHeight: 0, maxHeight: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-700 text-sm">{STATUS_LABELS[status]}</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${HEADER_COLORS[status]}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards — this div scrolls, not the page */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2" style={{ minHeight: 0 }}>
        {/* Drop placeholder at top when dragging over */}
        {isDragOver && dragHeight > 0 && (
          <div
            style={{ height: dragHeight }}
            className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 flex-shrink-0 transition-all"
          />
        )}

        {tasks.length === 0 && !isDragOver ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-3xl mb-2 opacity-40">
              {status === 'done' ? '✓' : status === 'todo' ? '○' : status === 'in_progress' ? '◑' : '◎'}
            </div>
            <p className="text-sm text-slate-400 font-medium">No tasks here</p>
            <p className="text-xs text-slate-300 mt-1">Drag a card to add</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
});
KanbanColumn.displayName = 'KanbanColumn';
