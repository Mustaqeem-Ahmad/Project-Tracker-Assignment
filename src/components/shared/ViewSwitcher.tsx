import React from 'react';
import { ViewType } from '../../types';
import { useTaskStore } from '../../store/taskStore';

const VIEWS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'kanban', label: 'Kanban', icon: '⊞' },
  { id: 'list',   label: 'List',   icon: '≡' },
  { id: 'timeline', label: 'Timeline', icon: '▬' },
];

export const ViewSwitcher = React.memo(() => {
  const view = useTaskStore(s => s.view);
  const setView = useTaskStore(s => s.setView);
  

  return (
    <div className="flex bg-slate-100 rounded-lg p-1 gap-0.5">
      {VIEWS.map(v => (
        <button
          key={v.id}
          onClick={() => setView(v.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
            ${view === v.id
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
            }`}
        >
          <span className="text-base leading-none">{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
});
ViewSwitcher.displayName = 'ViewSwitcher';
