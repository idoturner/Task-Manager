import { NavView } from '../types/task';

interface BottomNavProps {
  activeNav: NavView;
  onNavChange: (nav: NavView) => void;
}

interface BottomNavItem {
  icon: string;
  label: string;
  nav?: NavView;
}

const ITEMS: BottomNavItem[] = [
  { icon: 'dashboard', label: 'ראשי', nav: 'ראשי' },
  { icon: 'today', label: 'היום', nav: 'היום' },
  { icon: 'check_circle', label: 'הושלם', nav: 'הושלם' },
  { icon: 'person', label: 'פרופיל' },
];

export default function BottomNav({ activeNav, onNavChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant h-16 flex justify-around items-center z-50 dark:bg-inverse-surface dark:border-outline">
      {ITEMS.map(({ icon, label, nav }) => {
        const isActive = nav !== undefined && activeNav === nav;
        return (
          <button
            key={label}
            onClick={() => nav && onNavChange(nav)}
            disabled={!nav}
            className={`flex flex-col items-center gap-0.5 ${
              !nav
                ? 'text-on-surface-variant opacity-50 cursor-not-allowed dark:text-surface-variant'
                : isActive
                ? 'text-primary dark:text-primary-fixed-dim'
                : 'text-on-surface-variant dark:text-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className={`text-[10px] ${isActive ? 'font-bold' : ''}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
