import React, { useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { applyFilters, applySort } from '../../utils/filterUtils';
import { SortField, SortDir } from '../../types';
import { useVirtualScroll, ROW_HEIGHT } from '../../hooks/useVirtualScroll';
import { TaskRow } from './TaskRow';

const COLUMNS: { field: SortField; label: string; width: string }[] = [
  { field: 'title',    label: 'Title',    width: 'flex-1' },
  { field: 'priority', label: 'Priority', width: 'w-24' },
  { field: 'dueDate',  label: 'Due Date', width: 'w-24' },
];


export const ListView = React.memo(() => {
  const tasks   = useTaskStore(s => s.tasks);
  const filters = useTaskStore(s => s.filters);
  const sort    = useTaskStore(s => s.sort);
  const setSort = useTaskStore(s => s.setSort);

  const sortedFiltered = useMemo(() => {
    const filtered = applyFilters(tasks, filters);
    return applySort(filtered, sort);
  }, [tasks, filters, sort]);


  const { containerRef, handleScroll, visibleStart, visibleEnd,
          totalHeight, offsetTop, offsetBottom } = useVirtualScroll(sortedFiltered.length);

  const visibleTasks = sortedFiltered.slice(visibleStart, visibleEnd);

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({ field, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, dir: 'asc' });
    }
  };


  const SortIcon = ({ field }: { field: SortField }) => {
    if (sort.field !== field) return <span className="text-slate-300 ml-1">↕</span>;
    return <span className="text-indigo-500 ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  };


  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 flex-shrink-0">
        {COLUMNS.map(col => (
          <button
            key={col.field}
            onClick={() => handleSort(col.field)}
            className={`flex items-center text-xs font-semibold uppercase tracking-wider select-none
              transition-colors hover:text-indigo-600
              ${col.field === 'title' ? col.width : col.width + ' flex-shrink-0'}
              ${sort.field === col.field ? 'text-indigo-600' : 'text-slate-500'}`}
          >
            {col.label}
            <SortIcon field={col.field} />
          </button>
        ))}
        {/* Status header (no sort) */}
        <div className="w-32 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Status
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 flex-shrink-0">
        <span className="text-xs text-slate-400 font-medium">
          {sortedFiltered.length} tasks
        </span>
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0"
      >
        {sortedFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-slate-400 font-medium text-sm">No tasks match your filters</p>
            <p className="text-slate-300 text-xs mt-1">Try clearing some filters</p>
          </div>
        ) : (
          <div style={{ height: totalHeight, position: 'relative' }}>
            {/* Top spacer */}
            {offsetTop > 0 && (
              <div style={{ height: offsetTop }} />
            )}
            {visibleTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
            {/* Bottom spacer */}
            {offsetBottom > 0 && (
              <div style={{ height: offsetBottom }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
ListView.displayName = 'ListView';

