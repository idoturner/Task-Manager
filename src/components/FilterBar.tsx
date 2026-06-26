import { useState } from 'react';
import { TaskFilter, SortOption } from '../types/task';
import { SORT_OPTIONS } from '../utils/taskUtils';

interface FilterBarProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showFilterPills: boolean;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'הכל', label: 'הכל' },
  { value: 'לביצוע', label: 'לביצוע' },
  { value: 'בתהליך', label: 'בתהליך' },
  // 'הושלם' is handled by the sidebar nav — not a filter pill
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  counts,
  sortBy,
  onSortChange,
  showFilterPills,
}: FilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? '';

  return (
    <div className="flex flex-row-reverse items-center gap-sm">
      {/* Status filter pills — scrollable, only shown on the ראשי view */}
      {showFilterPills && (
        <div className="flex flex-row-reverse items-center gap-sm overflow-x-auto flex-1 pb-sm no-scrollbar">
          {FILTERS.map(({ value, label }) => {
            const isActive = activeFilter === value;
            return (
              <button
                key={value}
                onClick={() => onFilterChange(value)}
                className={`px-md py-sm rounded-full text-label-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary dark:bg-primary-container dark:text-on-primary-container'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant dark:bg-surface-dim dark:border-outline dark:text-on-surface dark:hover:bg-outline-variant'
                }`}
              >
                {label}
                <span
                  className={`mr-xs text-label-sm ${
                    isActive
                      ? 'opacity-70'
                      : 'text-outline dark:text-outline-variant'
                  }`}
                >
                  {counts[value]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Sort button — outside scrollable container so the dropdown isn't clipped */}
      <div className="shrink-0 relative">
        <button
          onClick={() => setSortOpen((prev) => !prev)}
          className="flex items-center gap-xs bg-surface-container border border-outline-variant rounded-lg px-md py-sm text-label-md text-on-surface hover:bg-surface-variant active:bg-surface-variant transition-colors whitespace-nowrap dark:bg-surface-dim dark:border-outline dark:text-on-surface dark:hover:bg-outline-variant"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-surface-variant">
            sort
          </span>
          <span className="text-on-surface-variant text-label-sm dark:text-on-surface-variant">
            מיין לפי:
          </span>
          {currentLabel}
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant dark:text-on-surface-variant">
            {sortOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {sortOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setSortOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden dark:bg-inverse-surface dark:border-outline">
              {SORT_OPTIONS.map(({ value, label }) => {
                const isActive = sortBy === value;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      onSortChange(value);
                      setSortOpen(false);
                    }}
                    className={`w-full flex flex-row-reverse items-center gap-sm px-md py-sm text-label-md transition-colors hover:bg-surface-container dark:hover:bg-outline-variant ${
                      isActive
                        ? 'text-primary bg-surface-container-low dark:text-primary-fixed-dim dark:bg-surface-dim'
                        : 'text-on-surface dark:text-inverse-on-surface'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      check
                    </span>
                    <span className="flex-1 text-right">{label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
