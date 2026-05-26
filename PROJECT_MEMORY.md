# PROJECT MEMORY

## Project Overview
Pundo is a modern, responsive Personal Finance Progressive Web Application (PWA) that enables users to track daily expenses, log income, monitor savings, and set financial goals.

## Tech Stack
- **Frontend**: React (hooks, functional components) with **Tailwind CSS** for styling & responsive design.
- **State Management**: React Context + useReducer (or optional Redux Toolkit).
- **Data Visualization**: Recharts.
- **Backend / Auth / Database**: Supabase (PostgreSQL + Auth).
- **PWA**: Web Manifest, Service Worker (Workbox) for offline capabilities.
- **Build Tool**: Vite (for fast dev server & bundling).

## Architecture Overview
- **Root**: `src/`
  - `components/` – reusable UI components (widgets, forms, charts).
  - `pages/` – page-level components (Dashboard, Transactions, Goals, Settings).
  - `context/` – React Context providers for auth, data, and UI state.
  - `services/` – Supabase client wrapper and API functions.
  - `hooks/` – custom hooks for data fetching and business logic.
  - `assets/` – images, icons, fonts.
  - `styles/` – Tailwind config and global CSS.
- **Public**: `manifest.json`, `service-worker.js`, icons.

## Data Schema (Supabase)
| Table | Columns | Description |
|-------|---------|-------------|
| `users` | `id (uuid) PK`, `email`, `created_at` | Auth managed by Supabase Auth.
| `transactions` | `id PK`, `user_id FK`, `type (enum: income|expense)`, `amount`, `category_id FK`, `date`, `note` | Records of income and expenses.
| `categories` | `id PK`, `user_id FK`, `name`, `icon`, `type (enum)` | Transaction categories.
| `goals` | `id PK`, `user_id FK`, `name`, `target_amount`, `current_amount`, `target_date`, `created_at` | Financial goals.

## Component Structure (High Level)
- `App`
  - `AuthProvider`
  - `DataProvider`
  - `Router`
    - `/dashboard` → `DashboardPage`
      - `SummaryWidget`
      - `ExpenseChart`
      - `IncomeChart`
    - `/transactions` → `TransactionsPage`
      - `TransactionList`
      - `TransactionForm`
    - `/goals` → `GoalsPage`
      - `GoalList`
      - `GoalProgress`
    - `/settings` → `SettingsPage`
- Shared UI components: `Button`, `Modal`, `Input`, `Select`, `Card`.

## Checklist (Current Progress)
- [ ] Project initialized with Vite + React + Tailwind.
- [ ] Supabase client configured.
- [ ] Basic routing set up.
- [ ] Core UI components scaffolded.
- [ ] Data schema defined in Supabase.
- [ ] PWA manifest and service worker added.
- [ ] Dashboard with Recharts widgets.
- [ ] CRUD operations for transactions.
- [ ] Goal tracking UI.
- [ ] Responsive design verified (mobile-first).

*This file will be updated at the start and end of each interaction to keep project context consistent.*
