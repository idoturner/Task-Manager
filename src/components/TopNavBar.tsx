import { useState } from 'react';
import { Task } from '../types/task';

interface TopNavBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  overdueTasks: Task[];
  dueSoonTasks: Task[];
}

export default function TopNavBar({
  theme,
  onToggleTheme,
  overdueTasks,
  dueSoonTasks,
}: TopNavBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const dismiss = (id: string) =>
    setDismissedIds((prev) => new Set([...prev, id]));

  const visibleOverdue = overdueTasks.filter((t) => !dismissedIds.has(t.id));
  const visibleDueSoon = dueSoonTasks.filter((t) => !dismissedIds.has(t.id));
  const totalAlerts = visibleOverdue.length + visibleDueSoon.length;

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 left-0 right-0 z-50 dark:bg-inverse-surface dark:border-outline">
      <div className="flex flex-row-reverse justify-between items-center w-full px-gutter max-w-container-max mx-auto h-16">
        {/* Logo + nav links (right in RTL) */}
        <div className="flex items-center gap-md">
          <span className="text-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
            ניהול משימות
          </span>
          <nav className="hidden md:flex gap-md mr-lg">
            <a
              href="#"
              className="text-label-md text-primary border-b-2 border-primary font-bold pb-1 transition-colors dark:text-primary-fixed-dim dark:border-primary-fixed-dim"
            >
              לוח בקרה
            </a>
            <a
              href="#"
              className="text-label-md text-on-surface-variant opacity-50 cursor-not-allowed pointer-events-none dark:text-surface-variant"
            >
              המשימות שלי
            </a>
            <a
              href="#"
              className="text-label-md text-on-surface-variant opacity-50 cursor-not-allowed pointer-events-none dark:text-surface-variant"
            >
              צוות
            </a>
          </nav>
        </div>

        {/* Actions (left in RTL) */}
        <div className="flex flex-row-reverse items-center gap-sm">
          {/* Search */}
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="חיפוש משימות..."
              className="bg-surface-container-low border border-outline-variant rounded-full pr-9 pl-4 py-1.5 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-surface-container dark:border-outline dark:text-on-surface w-48"
            />
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="החלף ערכת נושא"
            className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-all dark:text-surface-variant dark:hover:bg-outline-variant"
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              aria-label="התראות"
              className={`relative p-2 rounded-full transition-all ${
                notifOpen
                  ? 'bg-surface-variant dark:bg-outline-variant'
                  : 'text-on-surface-variant hover:bg-surface-variant dark:text-surface-variant dark:hover:bg-outline-variant'
              }`}
            >
              <span className={`material-symbols-outlined ${totalAlerts > 0 ? 'text-error dark:text-error' : 'text-on-surface-variant dark:text-surface-variant'}`}>
                {totalAlerts > 0 ? 'notifications_active' : 'notifications'}
              </span>
              {totalAlerts > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] rounded-full flex items-center justify-center font-bold px-0.5">
                  {totalAlerts > 9 ? '9+' : totalAlerts}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 w-80 overflow-hidden dark:bg-inverse-surface dark:border-outline">
                  {/* Header */}
                  <div className="flex flex-row-reverse items-center justify-between px-md py-sm border-b border-outline-variant dark:border-outline">
                    <h3 className="text-label-md font-bold text-on-surface dark:text-inverse-on-surface">
                      התראות
                    </h3>
                    {totalAlerts > 0 && (
                      <span className="text-label-sm text-on-surface-variant dark:text-surface-variant">
                        {totalAlerts} התראות
                      </span>
                    )}
                  </div>

                  {totalAlerts === 0 ? (
                    <div className="flex flex-col items-center gap-sm px-md py-lg text-center">
                      <span className="material-symbols-outlined text-[40px] text-outline dark:text-outline-variant">
                        notifications_none
                      </span>
                      <p className="text-body-sm text-on-surface-variant dark:text-surface-variant">
                        אין התראות חדשות
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {visibleOverdue.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => dismiss(task.id)}
                          className="w-full flex flex-row-reverse items-start gap-sm px-md py-sm border-b border-outline-variant last:border-0 dark:border-outline hover:bg-surface-container dark:hover:bg-outline-variant transition-colors text-right"
                        >
                          <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                            warning
                          </span>
                          <div className="flex-1">
                            <p className="text-label-md text-on-surface dark:text-inverse-on-surface">
                              {task.title}
                            </p>
                            <p className="text-label-sm text-error dark:text-error mt-0.5">
                              באיחור · לחץ להסרה
                            </p>
                          </div>
                        </button>
                      ))}
                      {visibleDueSoon.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => dismiss(task.id)}
                          className="w-full flex flex-row-reverse items-start gap-sm px-md py-sm border-b border-outline-variant last:border-0 dark:border-outline hover:bg-surface-container dark:hover:bg-outline-variant transition-colors text-right"
                        >
                          <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5 dark:text-amber-400">
                            schedule
                          </span>
                          <div className="flex-1">
                            <p className="text-label-md text-on-surface dark:text-inverse-on-surface">
                              {task.title}
                            </p>
                            <p className="text-label-sm text-amber-600 dark:text-amber-400 mt-0.5">
                              פחות משעה · לחץ להסרה
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button
            aria-label="הגדרות"
            disabled
            className="p-2 text-on-surface-variant rounded-full opacity-50 cursor-not-allowed dark:text-surface-variant"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant shrink-0 dark:bg-secondary dark:border-outline">
            <span className="text-label-sm text-on-secondary-container dark:text-inverse-on-surface">
              מש
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
