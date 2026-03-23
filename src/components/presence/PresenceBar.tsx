import React from 'react';
import { useTaskStore } from '../../store/taskStore';

export const PresenceBar = React.memo(() => {
  const presence = useTaskStore(s => s.presence);
  const activeCount = presence.filter(p => p.taskId !== null).length;
  const totalCount = presence.length;


  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm text-slate-600 font-medium">
          {totalCount} online{activeCount > 0 && `, ${activeCount} active`}
        </span>
      </div>
      <div className="flex -space-x-2">
        {presence.map(p => (
          <div
            key={p.userId}
            title={`${p.name}${p.taskId ? ' (working on a task)' : ' (idle)'}`}
            style={{ backgroundColor: p.color }}
            className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center
                       text-white text-xs font-bold animate-pop-in transition-all duration-300"
          >
            {p.initials}
          </div>
        ))}
      </div>
    </div>
  );
});
PresenceBar.displayName = 'PresenceBar';

