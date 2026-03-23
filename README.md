# Project Tracker 📋

This is a project I built to deeply understand how complex UIs work under the hood — especially things like drag-and-drop, large lists, and state management.

Instead of relying on libraries, I challenged myself to implement most of the core logic from scratch to really learn how things work internally.

---

## 🚀 What this project does

It’s a task management app where the same data can be viewed in multiple ways depending on how you prefer to work:

### 🧩 Kanban View

Visually track task progress across different stages (To Do → In Progress → In Review → Done).
Includes smooth drag-and-drop interactions built from scratch using pointer events.

### 📋 List View

A structured table view for quickly scanning and sorting tasks.
Supports sorting (name, priority, due date) and handles 500+ tasks efficiently using virtual scrolling.

### 📅 Timeline View

A calendar-style visualization (similar to a Gantt chart) to plan tasks based on deadlines.

---

## ✨ Additional Features

* Filter tasks by status, priority, assignee, and due date
* Filters are synced with the URL (shareable state)
* Simulated “live users” presence (no backend, purely frontend logic)
* Overdue tasks are highlighted
* “Due Today” labeling for better readability

---

## 🧠 Why I built this

Most task management apps are either too simple or too complex.

I wanted to build something that:

* supports multiple ways of visualizing the same data
* performs well even with large datasets
* demonstrates how core UI features actually work internally

This project was mainly about **learning by building from scratch**, not just assembling libraries.

---

## ⚙️ Tech Stack & Decisions

* **React** → Component-based architecture for UI
* **Zustand** → Chosen over Redux for simplicity and minimal boilerplate
* **TypeScript** → Catch errors early and improve code reliability
* **Vite** → Fast dev server and optimized builds
* **Tailwind CSS** → Rapid styling with utility classes

> I intentionally avoided drag-and-drop libraries, UI frameworks, and virtualization libraries to better understand the underlying logic.

---

## 🧪 Key Challenges & Learnings

### Drag and Drop

Implemented using pointer events instead of libraries.
Learned how to avoid performance issues by:

* using element cloning
* avoiding state updates inside `pointermove`

---

### Virtual Scrolling

Rendering all 500 tasks caused performance issues.
Solved by:

* rendering only visible items
* using spacer elements to maintain scroll height

---

### Layout & Scrolling

One of the trickiest parts was getting nested scrolling right.
Learned the importance of:

* `min-h-0` in flex layouts
* controlling scroll containers properly

---

### URL State Sync

Filters persist in the URL using `history.replaceState`.
Also handled browser navigation with `popstate`.

---

## 🛠️ How to run locally

Make sure you have Node.js (v18 or higher):

```bash
node --version
```

Then:

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 📁 Project Structure (Simplified)

* `components/` → UI (Kanban, List, Timeline, shared components)
* `store/` → Zustand global state
* `hooks/` → Custom logic (drag, virtual scroll, filters, presence)
* `utils/` → Pure helper functions
* `data/` → Mock data generation

---

## ⚠️ Notes

* No external drag-and-drop or virtualization libraries were used
* Some features (like presence) are simulated on the frontend

---

## 💡 What I’d improve next

* Add backend for real-time collaboration
* Persist tasks in a database
* Add authentication
* Improve mobile responsiveness

---

## 👨‍💻 Final Thoughts

This project was less about building a polished product and more about understanding *how things actually work behind the scenes*.

It helped me move from “using libraries” to **thinking like a developer who can build systems from scratch**.
