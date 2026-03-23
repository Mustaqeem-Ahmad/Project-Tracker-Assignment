import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Task,
  Status,
  ViewType,
  FilterState,
  UserPresence,
  SortState,
} from '../types';
import { generateTasks } from '../data/generateTasks';
import { defaultFilters } from '../utils/filterUtils';

/**
 * Global state for the entire application
 * Handles:
 * - task data
 * - UI state (view, filters, sorting)
 * - simulated presence
 */
interface TaskStore {
  tasks: Task[];
  view: ViewType;
  filters: FilterState;
  presence: UserPresence[];
  sort: SortState;

  setView: (view: ViewType) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setPresence: (presence: UserPresence[]) => void;
  setSort: (sort: SortState) => void;
}

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      /**
       * Initial state
       * Using generated mock data to simulate real-world scale (500 tasks)
       */
      tasks: generateTasks(500),
      view: 'kanban',
      filters: defaultFilters,
      presence: [],
      sort: { field: 'dueDate', dir: 'asc' },

      /**
       * Switch between views (Kanban / List / Timeline)
       */
      setView: (view) =>
        set({ view }, false, 'view/setView'),

      /**
       * Update task status (used in drag-and-drop)
       * Only updates the specific task to avoid unnecessary changes
       */
      updateTaskStatus: (taskId, status) =>
        set(
          (state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? { ...task, status }
                : task
            ),
          }),
          false,
          'tasks/updateStatus'
        ),

      /**
       * Merge new filters with existing ones
       * Allows partial updates instead of replacing entire object
       */
      setFilters: (partialFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...partialFilters },
          }),
          false,
          'filters/setFilters'
        ),

      /**
       * Reset filters to default state
       */
      resetFilters: () =>
        set(
          { filters: defaultFilters },
          false,
          'filters/reset'
        ),

      /**
       * Update simulated user presence
       * Used for "live users" feature in UI
       */
      setPresence: (presence) =>
        set(
          { presence },
          false,
          'presence/set'
        ),

      /**
       * Update sorting configuration (List view)
       */
      setSort: (sort) =>
        set(
          { sort },
          false,
          'sort/set'
        ),
    }),
    {
      name: 'TaskStore', // shows in Redux DevTools
    }
  )
);