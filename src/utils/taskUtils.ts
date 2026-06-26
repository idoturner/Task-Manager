import { Task, TaskStatus, TaskPriority, SortOption } from '../types/task';

export const generateId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

// ─── Date helpers ────────────────────────────────────────────────────────────

export const isTaskOverdue = (task: Task): boolean => {
  if (task.status === 'הושלם') return false;
  const now = new Date();
  const [y, m, d] = task.dueDate.split('-').map(Number);
  if (task.dueTime) {
    const [h, min] = task.dueTime.split(':').map(Number);
    return new Date(y, m - 1, d, h, min) < now;
  }
  // No time set → overdue only after the full day has passed
  return new Date(y, m - 1, d, 23, 59) < now;
};

export const formatDate = (dateString: string): string => {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('he-IL', {
    month: 'short',
    day: 'numeric',
  });
};

export const isTaskDueSoon = (task: Task): boolean => {
  if (task.status === 'הושלם' || isTaskOverdue(task)) return false;
  const now = new Date();
  const [y, m, d] = task.dueDate.split('-').map(Number);
  const dueMs = task.dueTime
    ? (() => { const [h, min] = task.dueTime.split(':').map(Number); return new Date(y, m - 1, d, h, min).getTime(); })()
    : new Date(y, m - 1, d, 23, 59).getTime();
  return dueMs - now.getTime() <= 60 * 60 * 1000;
};

export const isTaskDueToday = (task: Task): boolean => {
  const now = new Date();
  const todayStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return task.dueDate === todayStr;
};

export const formatDueDateTime = (dueDate: string, dueTime?: string): string =>
  dueTime ? `${formatDate(dueDate)} ${dueTime}` : formatDate(dueDate);

export const formatUpdatedAt = (isoString: string): string => {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} ${timePart}`;
};

export const todayHebrewString = (): string =>
  new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// ─── Option lists ─────────────────────────────────────────────────────────────

export const STATUS_OPTIONS: TaskStatus[] = ['לביצוע', 'בתהליך', 'הושלם'];
export const PRIORITY_OPTIONS: TaskPriority[] = ['נמוכה', 'בינונית', 'גבוהה'];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'חדש לישן' },
  { value: 'oldest', label: 'ישן לחדש' },
  { value: 'nearest', label: 'הקרוב ביותר' },
  { value: 'priority', label: 'חשיבות' },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

export const STATUS_BADGE: Record<TaskStatus, string> = {
  'לביצוע':
    'bg-surface-variant text-on-surface-variant dark:bg-outline-variant dark:text-on-surface',
  'בתהליך':
    'bg-secondary-container text-on-secondary-container dark:bg-secondary dark:text-inverse-on-surface',
  'הושלם':
    'bg-tertiary-fixed text-on-tertiary-fixed-variant dark:bg-tertiary-container dark:text-on-tertiary',
};

// Green → low, Amber → medium, Red (error) → high
export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  'נמוכה':
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'בינונית':
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'גבוהה':
    'bg-error-container text-on-error-container dark:bg-error dark:text-on-error',
};

// ─── Sorting ──────────────────────────────────────────────────────────────────

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  'גבוהה': 0,
  'בינונית': 1,
  'נמוכה': 2,
};

const dueDateMs = (task: Task): number => {
  const [y, m, d] = task.dueDate.split('-').map(Number);
  if (task.dueTime) {
    const [h, min] = task.dueTime.split(':').map(Number);
    return new Date(y, m - 1, d, h, min).getTime();
  }
  return new Date(y, m - 1, d, 23, 59).getTime();
};

export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  const arr = [...tasks];
  switch (sortBy) {
    case 'newest':
      return arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'oldest':
      return arr.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case 'nearest':
      return arr.sort((a, b) => dueDateMs(a) - dueDateMs(b));
    case 'priority':
      return arr.sort(
        (a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority],
      );
  }
};

// ─── Migration ────────────────────────────────────────────────────────────────

// Fills in fields added after initial release so old localStorage data stays valid.
export const migrateTask = (raw: unknown): Task => {
  const t = raw as Record<string, unknown>;
  const createdAt =
    typeof t.createdAt === 'string' && t.createdAt
      ? t.createdAt
      : new Date().toISOString();
  return {
    id: typeof t.id === 'string' ? t.id : generateId(),
    title: typeof t.title === 'string' && t.title ? t.title : 'ללא כותרת',
    description:
      typeof t.description === 'string' && t.description
        ? t.description
        : undefined,
    status: STATUS_OPTIONS.includes(t.status as TaskStatus)
      ? (t.status as TaskStatus)
      : 'לביצוע',
    priority: PRIORITY_OPTIONS.includes(t.priority as TaskPriority)
      ? (t.priority as TaskPriority)
      : 'בינונית',
    dueDate:
      typeof t.dueDate === 'string' && t.dueDate
        ? t.dueDate
        : new Date().toISOString().split('T')[0],
    dueTime:
      typeof t.dueTime === 'string' && t.dueTime ? t.dueTime : undefined,
    createdAt,
    updatedAt:
      typeof t.updatedAt === 'string' && t.updatedAt ? t.updatedAt : createdAt,
  };
};
