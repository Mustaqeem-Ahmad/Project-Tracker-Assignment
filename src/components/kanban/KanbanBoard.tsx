import React, { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { KanbanColumn } from './KanbanColumn';
import { ALL_STATUSES, Status } from '../../types';
import { applyFilters } from '../../utils/filterUtils';

export const KanbanBoard = React.memo(() => {
  const tasks = useTaskStore(s => s.tasks);
  const filters = useTaskStore(s => s.filters);

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  const tasksByStatus = useMemo(() => {
    const map: Record<Status, typeof filteredTasks> = {
      todo: [], in_progress: [], in_review: [], done: [],
    };
    for (const t of filteredTasks) {
      map[t.status].push(t);
    }
    return map;
  }, [filteredTasks]);

  return (
    <div className="grid grid-cols-4 gap-4 h-full" style={{ minHeight: 0, maxHeight: '100%' }}>
      {ALL_STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
        />
      ))}
    </div>
  );
});
KanbanBoard.displayName = 'KanbanBoard';
