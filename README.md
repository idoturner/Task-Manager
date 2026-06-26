# מנהל המשימות — Task Manager

A responsive, RTL-first task management web application built in Hebrew for Israeli teams.

---

## Project Description

A single-page application that lets users create, edit, delete, and track tasks across three statuses. All data is stored locally in the browser — no server required. The UI is fully in Hebrew and follows RTL conventions throughout.

---

## Technologies

| Technology | Why it was chosen |
|---|---|
| **React 18** | Component model and hooks make UI state (modals, filters, toasts) straightforward to manage without unnecessary complexity. |
| **TypeScript** | Strict typing catches errors at compile time. The `Task` interface and union types for `TaskStatus` / `TaskPriority` make the data model self-documenting and prevent invalid values. |
| **Vite** | Extremely fast dev server and HMR. Zero-config for a project of this size. Significantly faster than CRA. |
| **Tailwind CSS** | Utility-first CSS keeps styles co-located with markup, speeds up iteration, and avoids naming collisions. The `dir="rtl"` integration and logical property utilities (`ps-`, `pe-`, `ms-`, `me-`) make RTL layout accurate without extra CSS. |
| **localStorage** | Zero-dependency persistence. No backend, no auth, no network latency. Appropriate for a personal task list scoped to a single browser. |
| **Lucide React** | Lightweight, tree-shakable icon library with a consistent visual style. |

---

## Installation & Running

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
npm run preview
```

---

## AI Usage

AI tools (Claude) were used during development to accelerate scaffolding and boilerplate. All generated code was reviewed, understood, and adjusted to meet the project requirements. No code was blindly accepted without comprehension.

---

## Implemented Features

- **Create task** — modal form with title, description, status, priority, and due date; Hebrew validation messages
- **Edit task** — same form pre-filled; modal closes on backdrop click
- **Delete task** — inline confirmation panel on the card before removal
- **Change status** — single-click status buttons directly on the task card
- **Filter by status** — pill buttons with live counts (הכל / לביצוע / בתהליך / הושלם)
- **Overdue detection** — tasks past their due date (and not completed) receive a red "באיחור" badge and a red-tinted border
- **Stats summary** — four stat cards showing total, pending, in-progress, and completed counts
- **Empty states** — distinct Hebrew messages for "no tasks at all" vs "no tasks match current filter"
- **Toast notifications** — non-blocking success feedback after create / edit / delete
- **localStorage persistence** — data survives page refreshes; write errors surface as an amber banner
- **Fully RTL** — `<html dir="rtl">`, Rubik font, Hebrew labels, placeholders, and buttons throughout
- **Responsive** — single-column on mobile, two-column on tablet, three-column on desktop

---

## Future Improvements

- **Backend / sync** — Replace localStorage with a REST API or Supabase for multi-device support
- **Authentication** — Per-user task lists with login
- **Drag and drop** — Reorder tasks or move between status columns (kanban view)
- **Search** — Full-text search across title and description
- **Advanced filtering** — Filter by priority, due date range, or overdue status
- **Unit & integration tests** — Vitest + React Testing Library
- **Dark mode** — Tailwind `dark:` variants
- **Due date reminders** — Browser notifications via the Notifications API
