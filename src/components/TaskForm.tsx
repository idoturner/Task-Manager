import { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, TaskFormData, FormErrors } from '../types/task';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, generateId } from '../utils/taskUtils';

interface TaskFormProps {
  task: Task | null;
  onSubmit: (task: Task) => void;
  onClose: () => void;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  status: 'לביצוע',
  priority: 'בינונית',
  dueDate: '',
  dueTime: '',
};

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  useEffect(() => {
    setFormData(
      task
        ? {
            title: task.title,
            description: task.description ?? '',
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            dueTime: task.dueTime ?? '',
          }
        : EMPTY_FORM,
    );
    setErrors({});
    setActiveShortcut(null);
  }, [task]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleChange = <K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = 'כותרת היא שדה חובה';
    if (!formData.dueDate) next.dueDate = 'תאריך יעד הוא שדה חובה';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date().toISOString();
    onSubmit({
      id: task?.id ?? generateId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime || undefined,
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    });
  };

  const inputBase =
    'w-full px-md py-sm border rounded-xl text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors dark:text-on-surface';
  const inputNormal =
    'bg-surface-container-low border-outline-variant dark:bg-surface-container dark:border-outline';
  const inputError =
    'bg-error-container border-error focus:ring-error dark:bg-surface-container dark:border-error';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-gutter"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface dark:bg-inverse-surface rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row-reverse items-center justify-between px-lg py-md border-b border-outline-variant dark:border-outline">
          <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface">
            {task ? 'עריכת משימה' : 'משימה חדשה'}
          </h2>
          <button
            onClick={onClose}
            aria-label="סגור"
            className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors dark:text-surface-variant dark:hover:bg-outline-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-lg space-y-md">
          {/* Title */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
              כותרת <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="הכנס כותרת למשימה..."
              maxLength={120}
              className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
            />
            {errors.title && (
              <p className="text-error text-body-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
              תיאור{' '}
              <span className="text-outline text-label-sm font-normal">
                (אופציונלי)
              </span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="הוסף תיאור מפורט..."
              rows={3}
              maxLength={500}
              className={`${inputBase} ${inputNormal} resize-none`}
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
                סטטוס
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as TaskStatus)
                }
                className={`${inputBase} ${inputNormal}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
                עדיפות
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  handleChange('priority', e.target.value as TaskPriority)
                }
                className={`${inputBase} ${inputNormal}`}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date + time */}
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
                תאריך יעד <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => {
                  handleChange('dueDate', e.target.value);
                  setActiveShortcut(null);
                }}
                className={`${inputBase} ${errors.dueDate ? inputError : inputNormal}`}
              />
              {errors.dueDate && (
                <p className="text-error text-body-sm mt-1">{errors.dueDate}</p>
              )}
              {/* Quick-pick shortcuts */}
              <div className="flex flex-wrap gap-xs mt-sm">
                {(() => {
                  const fmt = (d: Date) =>
                    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                  const shift = (n: number) => {
                    const d = new Date();
                    d.setDate(d.getDate() + n);
                    return d;
                  };
                  const daysToSat = (6 - new Date().getDay() + 7) % 7;
                  const shortcuts = [
                    { label: 'היום', date: fmt(new Date()) },
                    { label: 'מחר', date: fmt(shift(1)) },
                    { label: 'סוף שבוע', date: fmt(shift(daysToSat)) },
                    { label: 'שבוע הבא', date: fmt(shift(7)) },
                  ];
                  return shortcuts.map(({ label, date }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        handleChange('dueDate', date);
                        setActiveShortcut(label);
                      }}
                      className={`px-sm py-1 text-label-sm rounded-full border transition-colors ${
                        activeShortcut === label
                          ? 'bg-primary text-on-primary border-primary dark:bg-primary-container dark:text-on-primary-container dark:border-primary-container'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant dark:border-outline dark:text-on-surface dark:hover:bg-outline-variant'
                      }`}
                    >
                      {label}
                    </button>
                  ));
                })()}
              </div>
            </div>
            <div>
              <label className="block text-label-md text-on-surface-variant mb-sm dark:text-surface-variant">
                שעת יעד{' '}
                <span className="text-outline text-label-sm font-normal">
                  (אופציונלי)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formData.dueTime}
                placeholder="00:00"
                maxLength={5}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  const h = digits.slice(0, 2);
                  const m = digits.slice(2, 4);
                  // Reject impossible hours: first digit > 2, or full hour > 23
                  if (h.length === 1 && parseInt(h) > 2) return;
                  if (h.length === 2 && parseInt(h) > 23) return;
                  // Reject impossible minutes: first minute digit > 5
                  if (m.length >= 1 && parseInt(m[0]) > 5) return;
                  const v = digits.length > 2 ? h + ':' + m : h;
                  handleChange('dueTime', v);
                }}
                onBlur={() => {
                  const v = formData.dueTime;
                  if (v && v.length !== 5) handleChange('dueTime', '');
                }}
                className={`${inputBase} ${inputNormal}`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-md pt-sm">
            <button
              type="submit"
              className="flex-1 bg-primary text-on-primary text-label-md py-sm rounded-full hover:opacity-90 active:scale-95 transition-all shadow-md dark:bg-primary-container dark:text-on-primary-container"
            >
              {task ? 'שמור שינויים' : 'צור משימה'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container text-on-surface text-label-md py-sm rounded-full hover:bg-surface-variant transition-colors dark:bg-surface-dim dark:text-on-surface dark:hover:bg-outline-variant"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
