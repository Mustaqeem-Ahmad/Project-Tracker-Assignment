import React, { useState } from 'react';
import { Status, Priority, ALL_STATUSES, ALL_PRIORITIES, STATUS_LABELS, PRIORITY_BG } from '../../types';
import { useFilters } from '../../hooks/useFilters';
import { ASSIGNEES } from '../../data/assignees';

export const FilterBar = React.memo(() => {
  const { filters, setFilters, resetFilters, active } = useFilters();
  const [open, setOpen] = useState(false);

  const toggleStatus = (s: Status) => {
    const cur = filters.statuses;
    setFilters({ statuses: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] });
  };
  const togglePriority = (p: Priority) => {
    const cur = filters.priorities;
    setFilters({ priorities: cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p] });
  };
  const toggleAssignee = (id: string) => {
    const cur = filters.assigneeIds;
    setFilters({ assigneeIds: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors
            ${active
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filter
          {active && (
            <span className="bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {filters.statuses.length + filters.priorities.length + filters.assigneeIds.length}
            </span>
          )}
        </button>
        {active && (
          <button
            onClick={resetFilters}
            className="text-sm text-slate-500 hover:text-red-600 transition-colors font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-10 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-80 animate-slide-in">
          {/* Status */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                    ${filters.statuses.includes(s)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors capitalize
                    ${filters.priorities.includes(p)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : `${PRIORITY_BG[p]} hover:opacity-80`
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Assignees */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Assignee</p>
            <div className="flex flex-wrap gap-1.5">
              {ASSIGNEES.map(a => (
                <button
                  key={a.id}
                  onClick={() => toggleAssignee(a.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
                    ${filters.assigneeIds.includes(a.id)
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >

                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                  {a.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>


          {/* Date Range */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Due Date Range</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dueDateFrom || ''}
                onChange={e => setFilters({ dueDateFrom: e.target.value || null })}
                className="flex-1 text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-700"
              />

              <span className="text-slate-400 self-center">–</span>
              <input
                type="date"
                value={filters.dueDateTo || ''}
                onChange={e => setFilters({ dueDateTo: e.target.value || null })}
                className="flex-1 text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-700"
              />

            </div>
          </div>
          

          <button
            onClick={() => setOpen(false)}
            className="mt-4 w-full text-center text-sm text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
});
FilterBar.displayName = 'FilterBar';
