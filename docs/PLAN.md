# Afrek - Task Management Application Plan

A task management application with expandable notes, markdown support, and a weekly scheduling-first workflow.

## Product Overview

- **Core concept:** Todo list where each item expands for free-form markdown notes (WYSIWYG)
- **Main view:** Weekly calendar (Monday–Sunday) showing scheduled tasks
- **Organization:** Tags, search, filter, sort capabilities
- **Scheduling:** Backlog for unscheduled items; scheduling to specific days heavily encouraged
- **Pricing:** $3/month or $30/year subscription

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind 4, Shadcn/Base UI |
| Auth & Billing | Clerk |
| Database | Convex |
| Icons | Lucide React |
| Markdown Editor | @uiw/react-md-editor (upgradable to Tiptap) |

---

## Implementation Phases

Each phase produces a working, testable product.

---

### Phase 0: Repository Structure & Conventions
**Time estimate:** <1 hour

**Goal:** Establish folder structure and conventions so AI agents work consistently.

#### Deliverables

1. Create folder structure:
   ```
   app/
     (marketing)/
       layout.tsx
       page.tsx              # Landing page
       pricing/page.tsx      # Subscription info
     (app)/
       layout.tsx            # Auth-protected shell
       tasks/page.tsx        # Main app
       settings/page.tsx     # User settings
   components/
     ui/                     # Shadcn/Base UI wrappers
     layout/                 # AppShell, Sidebar, TopNav
     tasks/                  # Task-related components
     editors/                # Markdown editor components
   features/
     tasks/
       hooks.ts              # useTasks, useTaskFilters
       api.ts                # Convex wrapper functions
       types.ts              # Task, Tag types
     auth/
       hooks.ts
     billing/
       hooks.ts
   lib/
     date.ts                 # Monday-first week utilities
     markdown.ts             # Serialize/deserialize helpers
   convex/
     schema.ts
     tasks.ts
     users.ts
     subscriptions.ts
   docs/
     PLAN.md                 # This file
     ARCHITECTURE.md         # Technical decisions
     AI_AGENTS.md            # Instructions for AI agents
   ```

2. Create documentation files:
   - `docs/ARCHITECTURE.md` - Stack overview, conventions
   - `docs/AI_AGENTS.md` - How agents should extend the codebase
   - `AGENTS.md` (root) - Quick reference for build/lint commands

3. Create `.env.example` with placeholders for Clerk and Convex keys

#### Testing
- `bun run build` succeeds
- `bun run dev` shows landing page shell

---

### Phase 1: Static UI with Local State
**Time estimate:** 1–3 hours

**Goal:** Build complete UI with mock data and useState, no backend.

#### Deliverables

1. **App Shell** (`components/layout/`)
   - `AppShell.tsx` - Main layout wrapper
   - `Sidebar.tsx` - Navigation (Tasks, Settings), filters area
   - `TopNav.tsx` - User avatar placeholder, "Upgrade" button

2. **Task Components** (`components/tasks/`)
   - `TaskList.tsx` - Vertical list of tasks
   - `TaskItem.tsx` - Single task with:
     - Checkbox (toggle done)
     - Title (editable)
     - Tags (chip display)
     - Due date or "Backlog" label
     - Expand/collapse caret
   - `TaskItemExpanded.tsx` - Expanded view with:
     - Textarea for notes (WYSIWYG later)
     - Quick actions: "Today", "Tomorrow", "This Week", "Backlog", "Delete"
   - `WeeklyView.tsx` - 7-day grid, Monday first
   - `BacklogView.tsx` - List of unscheduled tasks
   - `TaskFilters.tsx` - Search input, tag chips, status dropdown

3. **Tasks Page** (`app/(app)/tasks/page.tsx`)
   - Local state with mock tasks
   - Tab toggle: "Week" | "Backlog"
   - Search and filter controls

4. **Types** (`features/tasks/types.ts`)
   ```typescript
   export type TaskStatus = "backlog" | "scheduled" | "done";
   
   export interface Task {
     id: string;
     title: string;
     notesMarkdown: string;
     tags: string[];
     status: TaskStatus;
     scheduledDate?: string; // ISO date string
     createdAt: number;
     updatedAt: number;
   }
   ```

#### Testing
- Can add, edit, delete tasks (in memory)
- Can expand tasks and edit notes
- Weekly view displays tasks by day
- Backlog view shows unscheduled tasks
- Search filters tasks by title
- Tag chips filter by tag

---

### Phase 2: Convex Database Integration
**Time estimate:** 1–2 days

**Goal:** Replace local state with Convex persistence using a demo user.

#### Deliverables

1. **Set up Convex**
   - Install: `bun add convex`
   - Run: `npx convex dev`
   - Create `lib/convexClient.ts`
   - Wrap app with `ConvexProvider`

2. **Database Schema** (`convex/schema.ts`)
   ```typescript
   import { defineSchema, defineTable } from "convex/server";
   import { v } from "convex/values";

   export default defineSchema({
     tasks: defineTable({
       title: v.string(),
       notesMarkdown: v.string(),
       tags: v.array(v.string()),
       status: v.union(
         v.literal("backlog"),
         v.literal("scheduled"),
         v.literal("done")
       ),
       scheduledDate: v.optional(v.string()),
       createdAt: v.number(),
       updatedAt: v.number(),
       userId: v.string(),
     })
       .index("by_user", ["userId"])
       .index("by_user_scheduled", ["userId", "scheduledDate"])
       .index("by_user_status", ["userId", "status"]),
   });
   ```

3. **Convex Functions** (`convex/tasks.ts`)
   - Queries:
     - `listTasks({ userId, view?, weekStart?, search?, tags?, status? })`
     - `getTask({ id })`
   - Mutations:
     - `createTask({ userId, title, tags?, scheduledDate? })`
     - `updateTask({ id, title?, notesMarkdown?, tags?, status?, scheduledDate? })`
     - `toggleDone({ id })`
     - `deleteTask({ id })`

4. **API Wrappers** (`features/tasks/api.ts`)
   - `useTasksQuery(filters)` - wraps useQuery
   - `useCreateTask()` - wraps useMutation
   - `useUpdateTask()` - wraps useMutation
   - `useDeleteTask()` - wraps useMutation

5. **Use demo user for now**
   - Constant `DEMO_USER_ID = "demo"` until Clerk integration

#### Testing
- Tasks persist across page refreshes
- CRUD operations work via Convex dashboard
- Multiple browser tabs stay in sync (real-time updates)

---

### Phase 3: Clerk Authentication
**Time estimate:** 1–3 hours

**Goal:** Add user authentication, scope data to authenticated users.

#### Deliverables

1. **Install Clerk**
   - `bun add @clerk/nextjs`
   - Configure environment variables
   - Wrap app with `ClerkProvider`

2. **Middleware** (`middleware.ts`)
   - Protect `(app)` routes
   - Allow `(marketing)` routes publicly

3. **Auth Pages**
   - `app/(marketing)/sign-in/[[...sign-in]]/page.tsx`
   - `app/(marketing)/sign-up/[[...sign-up]]/page.tsx`

4. **Connect Clerk to Convex**
   - Use `ConvexProviderWithClerk`
   - Pass Clerk user ID to Convex functions
   - Update Convex functions to require authentication

5. **Update Tasks API**
   - Get `userId` from Clerk instead of demo constant
   - All queries filter by authenticated user

6. **UI Updates**
   - Show user avatar in TopNav
   - Add sign out button
   - Gate `(app)` content for signed-in users only

#### Testing
- Can sign up and sign in
- Each user sees only their own tasks
- Signing out redirects to landing page
- Cannot access `/tasks` without authentication

---

### Phase 4: Scheduling & Weekly View
**Time estimate:** 1–3 hours

**Goal:** Build robust scheduling UX with Monday-first weekly view.

#### Deliverables

1. **Date Utilities** (`lib/date.ts`)
   ```typescript
   export function getStartOfWeek(date: Date): Date; // Returns Monday
   export function getWeekDays(startMonday: Date): { label: string; date: string }[];
   export function formatDateLabel(date: string): string; // "Mon 23"
   export function isToday(date: string): boolean;
   export function isSameWeek(date1: string, date2: string): boolean;
   ```

2. **Enhanced Weekly View**
   - Week navigation (previous/next week)
   - Current week indicator
   - Day headers: "Mon 23", "Tue 24", etc.
   - Today highlighted
   - Drop zone for drag-and-drop (stretch goal)

3. **Scheduling UX**
   - Quick schedule buttons on backlog items: "Today", "Tomorrow", "Pick date"
   - Date picker in expanded task view
   - "Move to Backlog" action for scheduled tasks
   - Creating new task defaults to "Today" with easy backlog toggle

4. **Backend Updates**
   - `listTasks` accepts `weekStart` parameter
   - Query returns tasks for 7-day window efficiently

#### Testing
- Weekly view shows Mon–Sun correctly
- Navigation between weeks works
- Quick scheduling buttons work
- Tasks move between backlog and scheduled views
- Today is visually highlighted

---

### Phase 5: Search, Tags & Filters
**Time estimate:** 1–3 hours

**Goal:** Full organization capabilities.

#### Deliverables

1. **Search**
   - Search input in TaskFilters
   - Searches title and notes content
   - Debounced input (300ms)

2. **Tags**
   - Tag input on TaskItem (comma-separated or chip selector)
   - Auto-suggest from existing user tags
   - Multi-select tag filter
   - Tags displayed as colored chips

3. **Status Filter**
   - Dropdown: All | Backlog | Scheduled | Done
   - Show/hide completed tasks toggle

4. **Sort**
   - Options: Created date | Scheduled date | Alphabetical
   - Ascending/descending toggle

5. **Backend Updates**
   - `listTasks` handles all filter parameters
   - Text search on title and notesMarkdown (simple includes for MVP)

#### Testing
- Search filters in real-time
- Tags can be added/removed from tasks
- Tag filter shows only matching tasks
- Status filter works correctly
- Sort order changes task display

---

### Phase 6: WYSIWYG Markdown Editor
**Time estimate:** 1–3 hours

**Goal:** Upgrade notes from textarea to rich markdown editor.

#### Deliverables

1. **Install Editor**
   - `bun add @uiw/react-md-editor`

2. **Editor Component** (`components/editors/MarkdownEditor.tsx`)
   ```typescript
   "use client";
   
   import dynamic from "next/dynamic";
   
   const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { 
     ssr: false,
     loading: () => <div className="h-48 bg-muted animate-pulse rounded" />
   });
   
   interface Props {
     value: string;
     onChange: (value: string) => void;
     placeholder?: string;
   }
   
   export function MarkdownEditor({ value, onChange, placeholder }: Props) {
     return (
       <div data-color-mode="light">
         <MDEditor
           value={value}
           onChange={(v) => onChange(v ?? "")}
           height={200}
           preview="edit"
           textareaProps={{ placeholder }}
         />
       </div>
     );
   }
   ```

3. **Markdown Preview** (`components/editors/MarkdownPreview.tsx`)
   - For displaying notes in collapsed/read mode

4. **Integration**
   - Replace textarea in TaskItemExpanded with MarkdownEditor
   - Debounce saves (500ms) to avoid excessive API calls
   - Show preview in collapsed task view

5. **Styling**
   - Match editor theme to app theme
   - Ensure proper dark mode support (stretch goal)

#### Testing
- Rich text editing works (bold, italic, lists, code)
- Markdown renders correctly in preview
- Changes persist to database
- No SSR errors

---

### Phase 7: Subscription & Billing
**Time estimate:** 1–2 days

**Goal:** Implement freemium model with Clerk billing.

#### Deliverables

1. **Stripe Setup**
   - Create Stripe products:
     - "Afrek Pro Monthly" - $3/month
     - "Afrek Pro Yearly" - $30/year
   - Configure webhook endpoint

2. **Convex Schema Update**
   ```typescript
   subscriptions: defineTable({
     userId: v.string(),
     stripeCustomerId: v.string(),
     status: v.string(), // "active" | "past_due" | "canceled"
     priceId: v.string(),
     currentPeriodEnd: v.number(),
   }).index("by_user", ["userId"]),
   ```

3. **Convex Functions** (`convex/subscriptions.ts`)
   - `getSubscription({ userId })`
   - `upsertSubscription({ ... })` - called by webhook

4. **Webhook Handler**
   - Handle `checkout.session.completed`
   - Handle `customer.subscription.updated`
   - Handle `customer.subscription.deleted`

5. **Free Tier Limits**
   - 50 tasks maximum for free users
   - Check limit in `createTask` mutation
   - Return clear error when limit reached

6. **Pricing Page** (`app/(marketing)/pricing/page.tsx`)
   - Show both plans with feature comparison
   - "Get Started" buttons link to checkout

7. **Upgrade Flow**
   - "Upgrade" button in TopNav for free users
   - Upgrade modal when hitting limits
   - Success/cancel redirect handling

8. **Billing Management**
   - Link to Stripe Customer Portal for subscription management
   - Show current plan status in Settings

#### Testing
- Can complete checkout flow
- Subscription status reflected in app
- Free users hit 50-task limit
- Paid users have unlimited tasks
- Subscription cancellation works

---

## File Structure Reference

```
afrek/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── tasks/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   └── webhooks/stripe/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                    # Shadcn components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopNav.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskItemExpanded.tsx
│   │   ├── WeeklyView.tsx
│   │   ├── BacklogView.tsx
│   │   ├── TaskFilters.tsx
│   │   └── CreateTaskButton.tsx
│   └── editors/
│       ├── MarkdownEditor.tsx
│       └── MarkdownPreview.tsx
├── features/
│   ├── tasks/
│   │   ├── hooks.ts
│   │   ├── api.ts
│   │   └── types.ts
│   ├── auth/
│   │   └── hooks.ts
│   └── billing/
│       ├── hooks.ts
│       └── types.ts
├── lib/
│   ├── utils.ts
│   ├── date.ts
│   └── markdown.ts
├── convex/
│   ├── schema.ts
│   ├── tasks.ts
│   ├── users.ts
│   └── subscriptions.ts
├── docs/
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   └── AI_AGENTS.md
├── AGENTS.md
└── .env.example
```

---

## Conventions for AI Agents

1. **Feature folders:** All new features go in `features/*/` with `types.ts`, `hooks.ts`, and `api.ts`
2. **Convex wrappers:** Never call Convex directly from components; use `features/*/api.ts`
3. **Types:** Mirror Convex schema types in `features/*/types.ts`
4. **Components:** Keep components small and focused; use composition
5. **Naming:** Use PascalCase for components, camelCase for functions/hooks
6. **Imports:** Prefer absolute imports from `@/` prefix

---

## Quick Commands

```bash
# Development
bun run dev           # Start Next.js dev server
npx convex dev        # Start Convex dev server (run in separate terminal)

# Build & Check
bun run build         # Production build
bun run lint          # ESLint check

# Convex
npx convex deploy     # Deploy Convex to production
```

---

## Next Steps

Start with **Phase 0** to establish the folder structure and conventions, then proceed sequentially through each phase. Each phase builds on the previous one and results in a testable product.
