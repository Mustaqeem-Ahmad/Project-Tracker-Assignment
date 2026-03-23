import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { UserPresence } from '../types';
import { ASSIGNEES } from '../data/assignees';

const MOCK_USERS = ASSIGNEES.slice(0, 4);

export function usePresence() {
  const tasks = useTaskStore(s => s.tasks);
  const setPresence = useTaskStore(s => s.setPresence);

  useEffect(() => {
    const activeTasks = tasks
      .filter(t => t.status !== 'done')
      .slice(0, 80);

    const tick = () => {
      const newPresence: UserPresence[] = MOCK_USERS.map(user => {
        const onTask = Math.random() > 0.15;
        return {
          userId: user.id,
          name: user.name,
          initials: user.avatar,
          color: user.color,
          taskId: onTask && activeTasks.length > 0
            ? activeTasks[Math.floor(Math.random() * activeTasks.length)].id
            : null,
          lastSeen: Date.now(),
        };
      });
      setPresence(newPresence);
    };

    tick(); // initial
    const interval = setInterval(tick, 4000);
    return () => clearInterval(interval);
  }, [tasks.length, setPresence]);
}
