import { Task, FilterState, SortState, PRIORITY_ORDER } from '../types';

export const defaultFilters: FilterState = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dueDateFrom: null,
  dueDateTo: null,
};

export function applyFilters(tasks: Task[], f: FilterState): Task[] {
  return tasks.filter(task => {
    if (f.statuses.length && !f.statuses.includes(task.status)) return false;
    if (f.priorities.length && !f.priorities.includes(task.priority)) return false;
    if (f.assigneeIds.length && !f.assigneeIds.includes(task.assigneeId)) return false;
    if (f.dueDateFrom && task.dueDate < f.dueDateFrom) return false;
    if (f.dueDateTo && task.dueDate > f.dueDateTo) return false;
    return true;
  });
}

export function applySort(tasks: Task[], sort: SortState): Task[] {
  return [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'priority':
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'dueDate':
        cmp = a.dueDate.localeCompare(b.dueDate);
        break;
    }
    return sort.dir === 'asc' ? cmp : -cmp;
  });
}

export function isFiltersActive(f: FilterState): boolean {
  return (
    f.statuses.length > 0 ||
    f.priorities.length > 0 ||
    f.assigneeIds.length > 0 ||
    !!f.dueDateFrom ||
    !!f.dueDateTo
  );
}

export function filtersToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.statuses.length) p.set('status', f.statuses.join(','));
  if (f.priorities.length) p.set('priority', f.priorities.join(','));
  if (f.assigneeIds.length) p.set('assignee', f.assigneeIds.join(','));
  if (f.dueDateFrom) p.set('from', f.dueDateFrom);
  if (f.dueDateTo) p.set('to', f.dueDateTo);
  return p;
}

export function paramsToFilters(search: string): Partial<FilterState> {
  const p = new URLSearchParams(search);
  const result: Partial<FilterState> = {};
  const status = p.get('status');
  if (status) result.statuses = status.split(',') as FilterState['statuses'];
  const priority = p.get('priority');
  if (priority) result.priorities = priority.split(',') as FilterState['priorities'];
  const assignee = p.get('assignee');
  if (assignee) result.assigneeIds = assignee.split(',');
  const from = p.get('from');
  if (from) result.dueDateFrom = from;
  const to = p.get('to');
  if (to) result.dueDateTo = to;
  return result;
}
