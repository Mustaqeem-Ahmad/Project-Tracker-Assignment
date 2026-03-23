import React, { useMemo } from 'react';
import { useTaskStore } from './store/taskStore';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { FilterBar } from './components/filters/FilterBar';
import { ViewSwitcher } from './components/shared/ViewSwitcher';
import { PresenceBar } from './components/presence/PresenceBar';
import { usePresence } from './hooks/usePresence';
import { useFilters } from './hooks/useFilters';
import { applyFilters } from './utils/filterUtils';

export default function App() {
  // Init hooks
  usePresence();
  useFilters(); // syncs URL

  const view   = useTaskStore(s => s.view);
  const tasks  = useTaskStore(s => s.tasks);
  const filters = useTaskStore(s => s.filters);

  const stats = useMemo(() => {
    const filtered = applyFilters(tasks, filters);
    return {
      total: filtered.length,
      overdue: filtered.filter(t => {
        if (t.status === 'done') return false;
        return t.dueDate < new Date().toISOString().split('T')[0];
      }).length,
    };
  }, [tasks, filters]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">PT</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Project Tracker</h1>
              <p className="text-xs text-slate-400 leading-tight">
                {stats.total} tasks{stats.overdue > 0 && ` · ${stats.overdue} overdue`}
              </p>
            </div>
          </div>

          {/* Center: View switcher */}
          <ViewSwitcher />

          {/* Right: Presence + Filter */}
          <div className="flex items-center gap-4">
            <PresenceBar />
            <FilterBar />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0 px-6 py-4 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <div className="flex-1 min-h-0">
            {view === 'kanban' && <KanbanBoard />}
            {view === 'list'   && <ListView />}
            {view === 'timeline' && <TimelineView />}
          </div>
        </div>
      </main>
    </div>
  );
}
