import { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import {
  isTaskOverdue,
  isTaskDueSoon,
  formatDate,
  formatUpdatedAt,
  STATUS_BADGE,
  PRIORITY_BADGE,
} from '../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const overdue = isTaskOverdue(task);
  const dueSoon = isTaskDueSoon(task);
  const completed = task.status === 'הושלם';

  const PRIORITY_ACCENT: Record<string, string> = {
    'נמוכה': 'bg-green-500 dark:bg-green-400',
    'בינונית': 'bg-amber-500 dark:bg-amber-400',
    'גבוהה': 'bg-error dark:bg-error',
  };

  const cardBase =
    'bg-surface rounded-xl p-md shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all dark:bg-inverse-surface';
  const cardBorder = overdue
    ? 'border-2 border-error-container dark:border-error'
    : dueSoon
    ? 'border-2 border-amber-400 dark:border-amber-400'
    : 'border border-outline-variant hover:shadow-lg dark:border-outline';
  const cardDim = completed ? 'opacity-80 bg-surface-container-low' : '';

  return (
    <div className={`${cardBase} ${cardBorder} ${cardDim}`}>
      {/* Priority accent bar on right edge */}
      <div className={`absolute top-0 right-0 w-1 h-full ${PRIORITY_ACCENT[task.priority]}`} />

      <div>
        {/* Top row: badge + hover actions */}
        <div className="flex flex-row-reverse justify-between items-start mb-md">
          <div className="flex gap-xs flex-wrap justify-end">
            {overdue && (
              <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-sm py-1 rounded text-label-sm dark:bg-error dark:text-on-error">
                <span className="material-symbols-outlined text-[14px]">
                  priority_high
                </span>
                באיחור
              </span>
            )}
            {dueSoon && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-sm py-1 rounded text-label-sm dark:bg-amber-900/40 dark:text-amber-300">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                פחות משעה
              </span>
            )}
            {!overdue && !dueSoon && (
              <span className={`px-sm py-1 rounded text-label-sm ${STATUS_BADGE[task.status]}`}>
                {task.status}
              </span>
            )}
          </div>

          {completed ? (
            <span className="material-symbols-outlined text-tertiary dark:text-tertiary-fixed-dim">
              check_circle
            </span>
          ) : (
            <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                aria-label="ערוך"
                className="material-symbols-outlined text-outline hover:text-primary transition-colors p-1 dark:text-outline-variant dark:hover:text-primary-fixed-dim"
              >
                edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="מחק"
                className="material-symbols-outlined text-outline hover:text-error transition-colors p-1 dark:text-outline-variant dark:hover:text-error"
              >
                delete
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={`text-headline-sm text-on-surface mb-sm dark:text-inverse-on-surface ${
            completed
              ? 'line-through decoration-on-surface-variant text-on-surface-variant dark:text-outline-variant'
              : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p
            className={`text-body-sm text-on-surface-variant mb-md line-clamp-2 dark:text-surface-variant ${
              completed ? 'line-through' : ''
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Priority badge — always visible */}
        <span
          className={`inline-block px-sm py-1 rounded text-label-sm mb-md ${PRIORITY_BADGE[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Bottom section */}
      <div>
        {/* Date/time + status circles */}
        <div className="flex flex-row-reverse justify-between items-center pt-md border-t border-outline-variant dark:border-outline">
          {/* Date and time — clock icon + time right of calendar icon + date */}
          <div
            className={`flex flex-row-reverse items-center gap-sm text-label-sm ${
              overdue
                ? 'text-error dark:text-error-container'
                : 'text-on-surface-variant dark:text-surface-variant'
            }`}
          >
            {task.dueTime && (
              <>
                <span className="material-symbols-outlined text-[16px]">
                  schedule
                </span>
                <span>{task.dueTime}</span>
              </>
            )}
            <span className="material-symbols-outlined text-[16px]">
              calendar_today
            </span>
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {/* Status circles: בתהליך and הושלם — always visible so completed tasks can be reverted */}
          <div className="flex flex-row-reverse items-center gap-md">
            {(['בתהליך', 'הושלם'] as TaskStatus[]).map((s) => {
              const isActive = task.status === s;
              return (
                <button
                  key={s}
                  onClick={() =>
                    onStatusChange(task.id, isActive ? 'לביצוע' : s)
                  }
                  className={`flex flex-row-reverse items-center gap-xs text-label-sm transition-colors ${
                    isActive
                      ? 'text-primary dark:text-primary-fixed-dim'
                      : 'text-on-surface-variant hover:text-on-surface dark:text-surface-variant dark:hover:text-inverse-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isActive ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Last updated — subtle */}
        <p className="text-label-sm text-outline mt-sm dark:text-outline-variant">
          עודכן לאחרונה:{' '}
          {formatUpdatedAt(task.updatedAt || task.createdAt)}
        </p>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-surface rounded-xl flex flex-col items-center justify-center gap-md p-md dark:bg-inverse-surface border-2 border-error-container dark:border-error">
          <span className="material-symbols-outlined text-[40px] text-error">
            delete_forever
          </span>
          <p className="text-body-sm text-on-surface text-center font-semibold dark:text-inverse-on-surface">
            למחוק את המשימה לצמיתות?
          </p>
          <div className="flex gap-sm w-full">
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 bg-error text-on-error text-label-md py-sm rounded-xl hover:opacity-90 transition-opacity"
            >
              מחק
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-surface-container text-on-surface text-label-md py-sm rounded-xl hover:bg-surface-variant transition-colors dark:bg-surface-dim dark:text-on-surface dark:hover:bg-outline-variant"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
