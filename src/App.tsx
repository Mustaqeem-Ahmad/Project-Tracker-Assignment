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
  /**
   * Initialize global side-effects
   * - usePresence → simulates active users in the UI
   * - useFilters → syncs filter state with URL (shareable state)
   */
  usePresence();
  useFilters();

  // Global state (Zustand)
  const view = useTaskStore((s) => s.view);
  const tasks = useTaskStore((s) => s.tasks);
  const filters = useTaskStore((s) => s.filters);

  /**
   * Derived stats (memoized for performance)
   * Only recalculates when tasks or filters change
   */
  const stats = useMemo(() => {
    const filteredTasks = applyFilters(tasks, filters);

    const today = new Date().toISOString().split('T')[0];

    const overdueCount = filteredTasks.filter((task) => {
      // Completed tasks should not be counted as overdue
      if (task.status === 'done') return false;
      return task.dueDate < today;
    }).length;

    return {
      total: filteredTasks.length,
      overdue: overdueCount,
    };
  }, [tasks, filters]);

  /**
   * Helper to render current view
   * Keeps JSX cleaner and easier to extend
   */
  const renderView = () => {
    switch (view) {
      case 'kanban':
        return <KanbanBoard />;
      case 'list':
        return <ListView />;
      case 'timeline':
        return <TimelineView />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col overflow-hidden">
      
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">

          {/* Logo + App Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">PT</span>
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Project Tracker
              </h1>

              {/* Dynamic stats (adds realism to UI) */}
              <p className="text-xs text-slate-400 leading-tight">
                {stats.total} tasks
                {stats.overdue > 0 && ` · ${stats.overdue} overdue`}
              </p>
            </div>
          </div>

          {/* View Switcher (Kanban / List / Timeline) */}
          <ViewSwitcher />

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <PresenceBar />
            <FilterBar />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-h-0 px-6 py-4 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <div className="flex-1 min-h-0">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
}