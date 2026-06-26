import { useState, useMemo, useEffect } from 'react';
import { Task, TaskStatus, TaskFilter, SortOption, NavView } from './types/task';
import { isTaskOverdue, isTaskDueSoon, isTaskDueToday, todayHebrewString, sortTasks, migrateTask } from './utils/taskUtils';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import BottomNav from './components/BottomNav';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import EmptyState from './components/EmptyState';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [tasks, setTasks, storageError] = useLocalStorage<Task[]>(
    'tm-tasks-v1',
    [],
  );
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('הכל');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('nearest');
  const [activeNav, setActiveNav] = useState<NavView>('ראשי');

  const handleNavChange = (nav: NavView) => {
    setActiveNav(nav);
    setActiveFilter('הכל'); // reset sub-filter when switching views
  };

  // One-time migration: fills in fields added after the initial release
  useEffect(() => {
    setTasks((prev) => prev.map(migrateTask));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };

  const counts: Record<TaskFilter, number> = useMemo(
    () => ({
      'הכל': tasks.filter((t) => t.status !== 'הושלם').length,
      'לביצוע': tasks.filter((t) => t.status === 'לביצוע').length,
      'בתהליך': tasks.filter((t) => t.status === 'בתהליך').length,
      'הושלם': tasks.filter((t) => t.status === 'הושלם').length,
    }),
    [tasks],
  );

  const overdueTasks = useMemo(() => tasks.filter(isTaskOverdue), [tasks]);
  const dueSoonTasks = useMemo(() => tasks.filter(isTaskDueSoon), [tasks]);
  const overdueCount = overdueTasks.length;

  const filteredTasks = useMemo(() => {
    let base = tasks;
    if (activeNav === 'היום') {
      base = tasks.filter(isTaskDueToday);
    } else if (activeNav === 'הושלם') {
      base = tasks.filter((t) => t.status === 'הושלם');
    } else {
      // ראשי: completed tasks only appear in הושלם tab
      base = tasks.filter((t) => t.status !== 'הושלם');
      if (activeFilter !== 'הכל') {
        base = base.filter((t) => t.status === activeFilter);
      }
    }
    return sortTasks(base, sortBy);
  }, [tasks, activeNav, activeFilter, sortBy]);

  const handleSaveTask = (task: Task) => {
    const isNew = !tasks.find((t) => t.id === task.id);
    if (isNew) {
      setTasks((prev) => [task, ...prev]);
      showToast('המשימה נוצרה בהצלחה');
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      showToast('המשימה עודכנה בהצלחה');
    }
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('המשימה נמחקה');
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface transition-colors duration-300 dark:bg-on-background dark:text-inverse-on-surface">
      <TopNavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        overdueTasks={overdueTasks}
        dueSoonTasks={dueSoonTasks}
      />

      <div className="flex pt-16 min-h-screen">
        <SideNavBar activeNav={activeNav} onNavChange={handleNavChange} />

        <main className="flex-grow lg:mr-64 p-gutter overflow-y-auto pb-20 md:pb-gutter">
          <div className="max-w-5xl mx-auto space-y-lg">
            {/* Page header */}
            <div className="flex flex-row-reverse justify-between items-center">
              <div>
                <h1 className="text-headline-lg text-on-surface dark:text-inverse-on-surface">
                  {activeNav === 'היום'
                    ? 'משימות להיום'
                    : activeNav === 'הושלם'
                    ? 'משימות שהושלמו'
                    : 'המשימות שלי'}
                </h1>
                <p className="text-body-md text-on-surface-variant dark:text-surface-variant">
                  {todayHebrewString()}
                  {overdueCount > 0 && (
                    <span className="mr-sm text-error font-semibold">
                      · {overdueCount}{' '}
                      {overdueCount === 1 ? 'משימה' : 'משימות'} באיחור
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleOpenCreate}
                className="hidden sm:flex items-center gap-sm bg-primary text-on-primary px-lg py-md rounded-full text-label-md hover:opacity-90 active:scale-95 transition-all shadow-md dark:bg-primary-container dark:text-on-primary-container"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                משימה חדשה
              </button>
            </div>

            {/* Storage error */}
            {storageError && (
              <div className="bg-error-container border border-error text-on-error-container rounded-xl px-md py-sm text-body-sm font-semibold">
                <span className="material-symbols-outlined text-[16px] ml-xs">
                  warning
                </span>
                {storageError}
              </div>
            )}

            {/* Filter bar */}
            <FilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              counts={counts}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showFilterPills={activeNav === 'ראשי'}
            />

            {/* Task grid */}
            {filteredTasks.length === 0 ? (
              <EmptyState
                hasFilter={activeFilter !== 'הכל' || activeNav !== 'ראשי'}
                onCreateTask={handleOpenCreate}
              />
            ) : (
              <div className="flex flex-col gap-md">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}

                {/* Add task placeholder */}
                <button
                  onClick={handleOpenCreate}
                  className="w-full border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-row-reverse items-center justify-center gap-sm text-outline hover:border-primary hover:text-primary transition-all group dark:border-outline dark:text-outline-variant dark:hover:border-primary-fixed-dim dark:hover:text-primary-fixed-dim"
                >
                  <span className="material-symbols-outlined text-[36px] group-hover:scale-110 transition-transform">
                    add_circle
                  </span>
                  <span className="text-label-md">הוספת משימה חדשה</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={handleOpenCreate}
        aria-label="משימה חדשה"
        className="fixed bottom-gutter right-gutter sm:hidden w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center z-50 active:scale-90 transition-transform dark:bg-primary-container dark:text-on-primary-container"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      <BottomNav activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Modal */}
      {formOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSaveTask}
          onClose={() => {
            setFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Toasts */}
      <div
        aria-live="polite"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-sm z-50 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-animate px-lg py-sm rounded-full shadow-lg text-label-md text-white ${
              toast.type === 'success' ? 'bg-primary' : 'bg-error'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
