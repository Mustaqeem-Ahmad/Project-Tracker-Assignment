export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type ViewType = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface Assignee {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dueDateFrom: string | null;
  dueDateTo: string | null;
}

export interface UserPresence {
  userId: string;
  taskId: string | null;
  color: string;
  name: string;
  initials: string;
  lastSeen: number;
}

export interface SortState {
  field: SortField;
  dir: SortDir;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export const PRIORITY_BG: Record<Priority, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

export const STATUS_COLORS: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  in_review: 'bg-purple-100 text-purple-700',
  done: 'bg-green-100 text-green-700',
};

export const ALL_STATUSES: Status[] = ['todo', 'in_progress', 'in_review', 'done'];
export const ALL_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
