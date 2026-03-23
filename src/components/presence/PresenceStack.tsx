import React from 'react';
import { useTaskStore } from '../../store/taskStore';

interface Props {
  taskId: string;
}

const MAX_VISIBLE = 3;

export const PresenceStack = React.memo(({ taskId }: Props) => {
  const presence = useTaskStore(s =>
    s.presence.filter(p => p.taskId === taskId)
  );

  if (presence.length === 0) return null;

  const visible = presence.slice(0, MAX_VISIBLE);
  const overflow = presence.length - MAX_VISIBLE;

  return (
    <div className="flex -space-x-1.5">
      {visible.map((p, i) => (
        <div
          key={p.userId}
          title={p.name}
          style={{
            backgroundColor: p.color,
            zIndex: MAX_VISIBLE - i,
            boxShadow: '0 0 0 2px white',
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center
                     text-white text-[9px] font-bold animate-pop-in"
        >
          {p.initials}
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{ zIndex: 0, boxShadow: '0 0 0 2px white' }}
          className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center
                     text-white text-[9px] font-bold"
        >
          +{overflow}
        </div>
      )}
    </div>
  );
});
PresenceStack.displayName = 'PresenceStack';
