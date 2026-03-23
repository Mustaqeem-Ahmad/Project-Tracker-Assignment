import { Assignee } from '../types';

export const ASSIGNEES: Assignee[] = [
  { id: 'u1', name: 'Alice Kim',    color: '#6366f1', avatar: 'AK' },
  { id: 'u2', name: 'Bob Chen',     color: '#f59e0b', avatar: 'BC' },
  { id: 'u3', name: 'Carol Dave',   color: '#ec4899', avatar: 'CD' },
  { id: 'u4', name: 'Dan Patel',    color: '#10b981', avatar: 'DP' },
  { id: 'u5', name: 'Eva Ramos',    color: '#3b82f6', avatar: 'ER' },
  { id: 'u6', name: 'Frank Liu',    color: '#8b5cf6', avatar: 'FL' },
];

export const ASSIGNEE_MAP: Record<string, Assignee> = Object.fromEntries(
  ASSIGNEES.map(a => [a.id, a])
);
