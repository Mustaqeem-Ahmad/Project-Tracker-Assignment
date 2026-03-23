# Project Tracker 📋

hey! this is a project i built to practice React and TypeScript. its basically a task management app where you can see your tasks in 3 different ways. i learned a lot making this so i wanted to document everything properly.

---

## what does it do

so basically you have tasks and you can view them in 3 ways:

- **Kanban view** - the board with 4 columns (To Do, In Progress, In Review, Done). you can drag cards from one column to another which was honestly the hardest part to build
- **List view** - shows all tasks in a table. you can click the column headers to sort by name, priority or due date. also handles 500+ tasks without slowing down (i learned about virtual scrolling for this!)
- **Timeline view** - shows tasks as bars on a calendar for the current month, kind of like a gantt chart

other stuff it does:
- filter tasks by status, priority, assignee or due date
- filters save in the URL so if you share the link the filters stay
- shows fake "live users" in the top bar like they are viewing the board in real time (its just simulated, theres no real backend)
- overdue tasks show up highlighted in red
- tasks due today say "Due Today" instead of the date

---

## how to run it

first make sure you have **Node.js** installed on your computer. if you dont have it download it from https://nodejs.org (get the LTS version, thats the stable one)

you can check if its already installed by opening terminal and typing:
```
node --version
```
if it shows a number like `v18.0.0` or higher youre good to go.

**step 1** - extract the zip file somewhere on your computer

**step 2** - open terminal and go into the project folder
```
cd project-tracker
```

**step 3** - install all the packages the project needs (this might take a minute)
```
npm install
```

**step 4** - start the app
```
npm run dev
```

now open your browser and go to **http://localhost:5173** and you should see the app!

to stop the server press `Ctrl + C` in the terminal.

---

## packages i used and why

when you run `npm install` it downloads these:

| package | what its for |
|---|---|
| react | the main UI library, everything is built with this |
| react-dom | lets react work in the browser |
| zustand | for managing state (sharing data between components). i tried useContext first but it kept re-rendering everything so i switched to this |
| typescript | adds types to javascript so you get errors while coding instead of while running |
| vite | runs the dev server and builds the project. way faster than create-react-app |
| tailwindcss | CSS utility classes, instead of writing CSS files you just add classes like `text-red-500` directly in the HTML |
| autoprefixer | automatically adds `-webkit-` prefixes to CSS so it works in all browsers |
| postcss | needed for tailwind to work, it processes the CSS |
| @vitejs/plugin-react | plugin that tells vite how to handle React files |

note: i did NOT use any drag and drop libraries, UI component libraries (like MUI or Chakra), or virtual scroll libraries. everything custom is written from scratch which was the whole point of the project.

---

## folder structure

i tried to keep things organized. heres what everything is:

```
project-tracker/
│
├── index.html              ← the main HTML file, react mounts here
├── package.json            ← project info and list of packages
├── vite.config.ts          ← vite configuration
├── tailwind.config.js      ← tailwind configuration
├── tsconfig.json           ← typescript configuration
│
└── src/
    ├── main.tsx            ← entry point, starts the React app
    ├── App.tsx             ← root component, has the header and switches between views
    ├── index.css           ← global styles and animations
    │
    ├── types/
    │   └── index.ts        ← all TypeScript types in one place (Task, Priority, Status etc)
    │
    ├── store/
    │   └── taskStore.ts    ← zustand store, all the global state lives here
    │
    ├── data/
    │   ├── assignees.ts    ← the 6 fake users with their colors
    │   └── generateTasks.ts← generates 500 random tasks for testing
    │
    ├── hooks/
    │   ├── useDrag.ts          ← all the drag and drop logic (pointer events)
    │   ├── useVirtualScroll.ts ← virtual scrolling so list view stays fast
    │   ├── useFilters.ts       ← filter state + syncing with URL
    │   └── usePresence.ts      ← simulates live users moving between tasks
    │
    ├── utils/
    │   ├── dateUtils.ts    ← helper functions for dates (is overdue? format date etc)
    │   └── filterUtils.ts  ← filter and sort logic (pure functions, easy to test)
    │
    └── components/
        ├── shared/
        │   ├── Avatar.tsx        ← the colored circle with user initials
        │   ├── PriorityBadge.tsx ← the colored badge (critical/high/medium/low)
        │   └── ViewSwitcher.tsx  ← the buttons to switch between kanban/list/timeline
        │
        ├── kanban/
        │   ├── KanbanBoard.tsx   ← the 4 column layout
        │   ├── KanbanColumn.tsx  ← a single column with its cards
        │   └── TaskCard.tsx      ← individual task card that you drag
        │
        ├── list/
        │   ├── ListView.tsx  ← the table view with sorting and virtual scroll
        │   └── TaskRow.tsx   ← a single row in the table
        │
        ├── timeline/
        │   └── TimelineView.tsx  ← the gantt chart view
        │
        ├── filters/
        │   └── FilterBar.tsx ← the filter dropdown panel
        │
        └── presence/
            ├── PresenceBar.tsx   ← the "X people online" bar at the top
            └── PresenceStack.tsx ← the stacked avatars shown on task cards
```

---

## things i struggled with and figured out

**drag and drop** - this took the longest. i had to learn about pointer events (pointerdown, pointermove, pointerup). the trick was to clone the card element and move the clone with CSS transform instead of actually moving the real card. also had to make sure setState is never called inside pointermove because that runs 60 times per second and would crash the browser.


**virtual scrolling** - the list view has 500 tasks but if you put all 500 in the DOM the browser slows down. so instead i only render the ~15 tasks you can actually see on screen. when you scroll i calculate which ones should be visible and swap them out. i use two empty divs above and below the visible items to maintain the correct scroll height.


**height / scrolling layout** - spent like 2 hours on this. the page was scrolling instead of the columns. turns out the whole CSS height chain needs to be correct: `h-screen` on the root → `flex-1 min-h-0` on every flex child → `overflow-y-auto` on the thing that actually scrolls. if any parent is missing `min-h-0` the whole thing breaks.


**URL filter sync** - whenever filters change i update the URL using `window.history.replaceState` so no page reload happens. when the page loads i read the URL and restore the filters. also added a `popstate` listener so browser back/forward buttons work correctly.

---

## if something doesnt work

- make sure youre in the right folder before running commands (should be inside `project-tracker/`)
- try deleting the `node_modules` folder and running `npm install` again
- make sure your Node.js version is 18 or higher
- port 5173 needs to be free, if something else is using it vite will use 5174 instead (it tells you in the terminal)
