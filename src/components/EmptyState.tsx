interface EmptyStateProps {
  hasFilter: boolean;
  onCreateTask: () => void;
}

export default function EmptyState({ hasFilter, onCreateTask }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-[64px] text-outline-variant dark:text-outline mb-md">
        {hasFilter ? 'filter_list_off' : 'checklist'}
      </span>

      {hasFilter ? (
        <>
          <h3 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-sm">
            לא נמצאו משימות
          </h3>
          <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
            נסה לשנות את הסינון הנוכחי
          </p>
        </>
      ) : (
        <>
          <h3 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-sm">
            עדיין אין משימות
          </h3>
          <p className="text-body-sm text-on-surface-variant dark:text-surface-variant mb-lg">
            צור משימה חדשה כדי להתחיל.
          </p>
          <button
            onClick={onCreateTask}
            className="flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-full text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md dark:bg-primary-container dark:text-on-primary-container"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            צור משימה ראשונה
          </button>
        </>
      )}
    </div>
  );
}
