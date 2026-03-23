import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { filtersToParams, paramsToFilters, isFiltersActive } from '../utils/filterUtils';

export function useFilters() {
  const filters = useTaskStore(s => s.filters);
  const setFilters = useTaskStore(s => s.setFilters);
  const resetFilters = useTaskStore(s => s.resetFilters);

  // On mount: hydrate filters from URL
  useEffect(() => {
    const fromURL = paramsToFilters(window.location.search);
    if (Object.keys(fromURL).length > 0) {
      setFilters(fromURL);
    }
    // Handle browser back/forward
    const onPop = () => {
      const restored = paramsToFilters(window.location.search);
      setFilters({ ...{ statuses: [], priorities: [], assigneeIds: [], dueDateFrom: null, dueDateTo: null }, ...restored });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line

  // Sync filters → URL whenever they change
  useEffect(() => {
    const params = filtersToParams(filters);
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [filters]);

  const active = isFiltersActive(filters);

  return { filters, setFilters, resetFilters, active };
}
