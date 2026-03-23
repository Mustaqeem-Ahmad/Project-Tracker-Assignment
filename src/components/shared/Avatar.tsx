import React from 'react';
import { ASSIGNEE_MAP } from '../../data/assignees';

interface Props {
  assigneeId: string;
  size?: 'sm' | 'md';
}


export const Avatar = React.memo(({ assigneeId, size = 'sm' }: Props) => {
  const user = ASSIGNEE_MAP[assigneeId];
  if (!user) return null;
  const cls = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  return (
    <div
      title={user.name}
      style={{ backgroundColor: user.color }}
      className={`${cls} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {user.avatar}
    </div>
  );
});
Avatar.displayName = 'Avatar';
