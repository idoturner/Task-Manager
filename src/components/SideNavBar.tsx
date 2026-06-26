import { NavView } from '../types/task';

interface SideNavBarProps {
  activeNav: NavView;
  onNavChange: (nav: NavView) => void;
}

interface NavItem {
  icon: string;
  label: string;
  nav?: NavView; // undefined = decorative only
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'dashboard', label: 'ראשי', nav: 'ראשי' },
  { icon: 'today', label: 'היום', nav: 'היום' },
  { icon: 'event', label: 'מתוזמן' },
  { icon: 'check_circle', label: 'הושלם', nav: 'הושלם' },
  { icon: 'archive', label: 'ארכיון' },
];

export default function SideNavBar({ activeNav, onNavChange }: SideNavBarProps) {
  return (
    <aside className="hidden lg:flex fixed right-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-l border-outline-variant flex-col z-40 p-md dark:bg-surface-dim dark:border-outline">
      <nav className="flex flex-col gap-sm flex-grow">
        {NAV_ITEMS.map(({ icon, label, nav }) => {
          const isActive = nav !== undefined && activeNav === nav;
          return (
            <button
              key={label}
              onClick={() => nav && onNavChange(nav)}
              disabled={!nav}
              className={`flex flex-row-reverse items-center gap-md rounded-xl px-4 py-3 transition-colors duration-200 text-start w-full ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container font-bold dark:bg-secondary dark:text-inverse-on-surface'
                  : nav
                  ? 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface dark:text-on-surface dark:hover:bg-outline-variant cursor-pointer'
                  : 'text-on-surface-variant opacity-50 cursor-not-allowed dark:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="text-label-md">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-md border-t border-outline-variant mt-md flex flex-col gap-sm dark:border-outline">
        <a
          href="#"
          className="flex flex-row-reverse items-center gap-md text-on-surface-variant rounded-xl px-4 py-3 opacity-50 cursor-not-allowed pointer-events-none dark:text-on-surface"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md">עזרה</span>
        </a>
        <a
          href="#"
          className="flex flex-row-reverse items-center gap-md text-error rounded-xl px-4 py-3 opacity-50 cursor-not-allowed pointer-events-none dark:text-error"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-md">התנתקות</span>
        </a>
      </div>
    </aside>
  );
}
