export type TaskStatus = 'לביצוע' | 'בתהליך' | 'הושלם';
export type TaskPriority = 'נמוכה' | 'בינונית' | 'גבוהה';
export type TaskFilter = TaskStatus | 'הכל';
export type SortOption = 'newest' | 'oldest' | 'nearest' | 'priority';
export type NavView = 'ראשי' | 'היום' | 'הושלם';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;   // YYYY-MM-DD
  dueTime?: string;  // HH:MM (24h), optional
  createdAt: string; // ISO string
  updatedAt: string; // ISO string — set on create and every edit
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string; // HH:MM or empty string
}

export interface FormErrors {
  title?: string;
  dueDate?: string;
}
