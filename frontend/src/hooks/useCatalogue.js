import { useQuery } from '@tanstack/react-query';
import { getItems, getItemFilters } from '@/services/crm';

/**
 * Fetches a paginated list of catalogue items.
 *
 * @param {string} itemGroup   Gas type filter, e.g. "LPG"
 * @param {string|null} cylinderSize  Size filter, e.g. "6kg"
 * @param {number} page        1-based page number
 */
export function useItems(itemGroup = 'LPG', cylinderSize = null, page = 1) {
  return useQuery({
    queryKey: ['items', itemGroup, cylinderSize, page],
    queryFn: () => getItems(itemGroup, cylinderSize, page),
    // Keep previous page data visible while new page loads
    placeholderData: (prev) => prev,
  });
}

/**
 * Fetches available gas_types and cylinder_sizes for filter controls.
 * Stale after 10 minutes — filter options rarely change.
 */
export function useItemFilters() {
  return useQuery({
    queryKey: ['item-filters'],
    queryFn: getItemFilters,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
