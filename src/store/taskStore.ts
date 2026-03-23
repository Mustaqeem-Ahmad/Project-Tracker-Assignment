import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Task, Status, ViewType, FilterState, UserPresence, SortState,
} from '../types';
import { generateTasks } from '../data/generateTasks';
import { defaultFilters } from '../utils/filterUtils';

interface TaskStore {
  tasks: Task[];
  view: ViewType;
  filters: FilterState;
  presence: UserPresence[];
  sort: SortState;

  setView: (v: ViewType) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setPresence: (presence: UserPresence[]) => void;
  setSort: (sort: SortState) => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set) => ({
      tasks: generateTasks(500),
      view: 'kanban',
      filters: defaultFilters,
      presence: [],
      sort: { field: 'dueDate', dir: 'asc' },

      setView: (view) => set({ view }, false, 'setView'),

      updateTaskStatus: (taskId, status) =>
        set(
          (state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, status } : t
            ),
          }),
          false,
          'updateTaskStatus'
        ),


      setFilters: (partial) =>
        set(
          (state) => ({ filters: { ...state.filters, ...partial } }),
          false,
          'setFilters'
        ),


      resetFilters: () =>
        set({ filters: defaultFilters }, false, 'resetFilters'),

      setPresence: (presence) =>
        set({ presence }, false, 'setPresence'),

      setSort: (sort) =>
        set({ sort }, false, 'setSort'),
    }),
    { name: 'TaskStore' }
  )
);


