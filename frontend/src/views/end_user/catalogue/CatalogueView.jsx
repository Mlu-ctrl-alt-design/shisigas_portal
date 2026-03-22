import { useState } from 'react';
import { useItems, useItemFilters } from '@/hooks/useCatalogue';
import ProductCard from './ProductCard';

// UNTITLED UI: https://untitledui.com/components/tabs
// UNTITLED UI: https://untitledui.com/components/card
// UNTITLED UI: https://untitledui.com/components/badge
// UNTITLED UI: https://untitledui.com/components/empty-state
// TODO: Replace tab strip with <Tabs> from @untitled-ui/react.
// TODO: Replace size buttons with <ButtonGroup> from @untitled-ui/react.
// TODO: Replace empty state with <EmptyState> from @untitled-ui/react.
// TODO: Replace skeleton divs with <Skeleton> (card shape) from @untitled-ui/react.
// TODO: Replace pagination with <Pagination> from @untitled-ui/react.

const PAGE_SIZE = 12;

function SkeletonCard() {
  // UNTITLED UI: Skeleton (card shape) stub
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function CatalogueView() {
  const [activeGroup, setActiveGroup] = useState('LPG');
  const [activeSize, setActiveSize] = useState(null);
  const [page, setPage] = useState(1);

  const { data: filters, isLoading: filtersLoading } = useItemFilters();
  const { data, isLoading, isFetching } = useItems(activeGroup, activeSize, page);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleGroupChange = (group) => {
    setActiveGroup(group);
    setActiveSize(null);
    setPage(1);
  };

  const handleSizeChange = (size) => {
    setActiveSize((prev) => (prev === size ? null : size));
    setPage(1);
  };

  // Derive gas type tabs — fallback to LPG if filters not loaded yet
  const gasTabs = filters?.gas_types?.length ? filters.gas_types : ['LPG'];
  const cylinderSizes = filters?.cylinder_sizes ?? [];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gas Catalogue</h1>
        <p className="mt-1 text-sm text-gray-500">Browse and order LPG cylinders.</p>
      </div>

      {/* Gas type filter tabs */}
      {/* UNTITLED UI: Tabs stub — reset page to 1 on change */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Gas type filter">
          {gasTabs.map((group) => (
            <button
              key={group}
              onClick={() => handleGroupChange(group)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeGroup === group
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {group}
            </button>
          ))}
        </nav>
      </div>

      {/* Cylinder size filter */}
      {cylinderSizes.length > 0 && (
        // UNTITLED UI: ButtonGroup stub
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-gray-500 self-center">Size:</span>
          {cylinderSizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeSize === size
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
          {activeSize && (
            <button
              onClick={() => { setActiveSize(null); setPage(1); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline self-center"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Product grid */}
      {isLoading ? (
        // Skeleton loading — 6 cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        // UNTITLED UI: Empty State stub
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try a different gas type or cylinder size.
          </p>
          <button
            onClick={() => { setActiveSize(null); setPage(1); }}
            className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Responsive grid: 1 col → 2 col → 3 col */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
              isFetching ? 'opacity-70 pointer-events-none' : ''
            }`}
          >
            {items.map((item) => (
              <ProductCard key={item.name} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {/* UNTITLED UI: Pagination stub */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages} · {total} items
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
