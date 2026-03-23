# Project Tracker

A production-grade React + TypeScript project management app with Kanban, List, and Timeline views.

## Features

- **Kanban Board** — Drag & drop cards between 4 columns (custom implementation, no libraries)
- **List View** — Sortable columns with virtual scrolling for 500+ tasks
- **Timeline / Gantt** — Current month view with priority-colored task bars
- **Live Presence** — Simulated real-time user presence with avatar stacks
- **Filter System** — Multi-filter by status, priority, assignee, date range with URL sync
- **500+ tasks** — Generated dataset with overdue tasks, missing start dates, all priorities

## Setup

### 1. Install Node.js

Make sure you have **Node.js 18+** installed.
Download from: https://nodejs.org

### 2. Install dependencies

```bash
npm install
```

This installs:
- `react` + `react-dom` — UI framework
- `zustand` — State management
- `typescript` — Type safety
- `vite` — Build tool & dev server
- `tailwindcss` — Utility CSS
- `autoprefixer` + `postcss` — CSS processing
- `@vitejs/plugin-react` — React support for Vite

### 3. Start development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── kanban/       KanbanBoard, KanbanColumn, TaskCard
│   ├── list/         ListView (virtual scroll), TaskRow
│   ├── timeline/     TimelineView (Gantt chart)
│   ├── filters/      FilterBar with URL sync
│   ├── presence/     PresenceBar, PresenceStack
│   └── shared/       Avatar, PriorityBadge, ViewSwitcher
├── hooks/
│   ├── useDrag.ts         Custom drag-and-drop (pointer events)
│   ├── useVirtualScroll.ts Windowed rendering
│   ├── useFilters.ts      Filter state + URL sync
│   └── usePresence.ts     Simulated presence
├── store/
│   └── taskStore.ts   Zustand global store
├── data/
│   ├── assignees.ts   6 mock users
│   └── generateTasks.ts  500+ task generator
├── types/
│   └── index.ts       All TypeScript types
└── utils/
    ├── dateUtils.ts   Date helpers, overdue logic
    └── filterUtils.ts Filter/sort pure functions
```

## Dependencies List

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | DOM rendering |
| zustand | ^4.4.7 | State management |
| typescript | ^5.2.2 | Type safety |
| vite | ^5.0.8 | Dev server & bundler |
| @vitejs/plugin-react | ^4.2.1 | React + Vite integration |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| autoprefixer | ^10.4.16 | CSS vendor prefixes |
| postcss | ^8.4.32 | CSS processing pipeline |

**No UI component libraries. No drag-and-drop libraries. No virtual scroll libraries.**
