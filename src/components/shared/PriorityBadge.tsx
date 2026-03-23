import React from 'react';
import { Priority, PRIORITY_BG } from '../../types';

interface Props {
  priority: Priority;
}

export const PriorityBadge = React.memo(({ priority }: Props) => {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border capitalize ${PRIORITY_BG[priority]}`}>
      {priority}
    </span>
  );
});
PriorityBadge.displayName = 'PriorityBadge';

