# Architecture Decisions

This document records significant architectural decisions made during development. Each entry should explain **what** was decided, **why**, and any trade-offs considered.

---

## Decision Log

### Template

```markdown
### [Short Title] — [Date]
**Phase:** [Phase number]
**Context:** [What prompted this decision?]
**Decision:** [What was decided?]
**Rationale:** [Why this approach over alternatives?]
**Trade-offs:** [What are the downsides?]
```

---

### Initial Tech Stack Selection — 2024-12

**Phase:** 0 (Planning)

**Context:** Need to choose technologies for auth, database, and UI that work well together and support the product requirements (user accounts, real-time updates, subscription billing).

**Decision:**
- **Auth & Billing:** Clerk
- **Database:** Convex
- **UI Framework:** Next.js 16 + React 19 + Tailwind 4 + Shadcn/Base UI
- **Markdown Editor:** @uiw/react-md-editor (with Tiptap as upgrade path)

**Rationale:**
- Clerk provides auth + billing in one service, reducing integration complexity
- Convex offers real-time subscriptions out of the box, ideal for a task app where users expect instant updates
- Shadcn/Base UI is already set up in the template and provides accessible, customizable components
- @uiw/react-md-editor is simpler to integrate than Tiptap; can upgrade later if needed

**Trade-offs:**
- Clerk + Convex is a less common pairing than Clerk + Prisma/Postgres; fewer tutorials
- @uiw/react-md-editor is less customizable than Tiptap; may need migration later

---

### Markdown Storage Strategy — 2024-12

**Phase:** 0 (Planning)

**Context:** The app needs to store rich notes that users edit with a WYSIWYG editor. Options: store as HTML, store as Markdown, store as editor-specific JSON.

**Decision:** Store notes as plain Markdown strings in Convex.

**Rationale:**
- Portable: not tied to any specific editor
- Readable: can display/edit even without WYSIWYG editor
- Smaller: Markdown is typically smaller than HTML or JSON
- Simple: no parsing/serialization complexity

**Trade-offs:**
- Some WYSIWYG features (like custom blocks) are harder to represent in Markdown
- Must ensure editor can round-trip Markdown without data loss

---

### Feature Folder Structure — 2024-12

**Phase:** 0 (Planning)

**Context:** Need a code organization strategy that AI agents can follow consistently across sessions.

**Decision:** Use feature folders under `features/` with `types.ts`, `hooks.ts`, and `api.ts` files. Components go in `components/` organized by domain.

**Rationale:**
- Clear boundaries: each feature is self-contained
- Predictable: agents know where to find/add code
- Separation: keeps Convex calls wrapped, not scattered through components
- Testable: each feature can be tested independently

**Trade-offs:**
- Some duplication of types between `features/*/types.ts` and `convex/schema.ts`
- More files than a flat structure

---

### Task State via Context + Convex — 2025-01

**Phase:** 2

**Context:** We needed a way to access tasks, filters, and Convex mutations from multiple components (Tasks page, TaskItem, WeeklyView) without wiring Convex everywhere.

**Decision:** Introduce `TaskStateContext` for task data + CRUD operations and `TaskFilterContext` for search/tag filters (with URL persistence). Components consume these contexts instead of calling Convex directly.

**Rationale:**
- Centralizes Convex access in one layer
- Keeps components focused on UI concerns
- Enables URL-persisted filters without leaking router details into every component
- Caching previous results in state prevents UI flicker during loading

**Trade-offs:**
- Slightly more indirection for simple components
- Two filter models (`TaskFilters` type vs `TaskFilterContext` state) must be kept conceptually aligned

---

### Scheduling Model (scheduledDate + status + completedAt) — 2025-01

**Phase:** 2 / 4

**Context:** We needed to support backlog tasks, scheduled tasks, and completed tasks with clear semantics and simple UI.

**Decision:** Model scheduling with:
- `scheduledDate?: string` (ISO `YYYY-MM-DD`)
- `status: "backlog" | "scheduled" | "done"`
- `completedAt?: number` (timestamp)

`UpdateTaskInput` uses `scheduledDate: string | null` so the client can explicitly clear dates; the server maps `null` to `undefined`.

**Rationale:**
- Simple to reason about:
  - No date → backlog
  - Date + not done → scheduled
  - Done → completed with `completedAt` timestamp
- Clearing scheduling is explicit and type-safe

**Trade-offs:**
- Some duplication between `status` and presence/absence of `scheduledDate`

---

### Backlog and Completed as Separate Pages — 2025-01

**Phase:** 1 / 4

**Context:** The original plan called for a "Week | Backlog" tab toggle on the tasks page, or a `BacklogView` component. We needed to decide how to surface unscheduled tasks and completed tasks.

**Decision:** Implement backlog and completed as separate pages (`/backlog`, `/completed`) accessible via sidebar navigation, rather than tabs or inline views.

**Rationale:**
- Cleaner URL structure - each view has its own shareable URL
- Simpler component logic - each page focuses on one concern
- Consistent with sidebar navigation pattern already in place
- Completed page can have its own week-based navigation for historical viewing

**Trade-offs:**
- Extra navigation step to switch between views
- Some code duplication between pages (task list rendering, filter handling)

---

### TopNav Actions via Layout Feature Context — 2025-01

**Phase:** 1 / 2

**Context:** We wanted the Tasks page to add actions (e.g., New Task, Search buttons) into the global TopNav, which is defined in the app layout.

**Decision:** Add `features/layout/TopNavActionsContext` so pages can set top-nav left and right content, and `TopNav` renders that content.

**Rationale:**
- Avoids prop-drilling from layout to every page
- Keeps layout generic while allowing rich page-specific actions
- Easy to extend for auth/billing actions in future phases

**Trade-offs:**
- Implicit dependency between pages and layout (context must be present)
- Slightly harder to follow than explicit props for new contributors

---

### URL-Persisted Filters — 2025-01

**Phase:** 2 / 5

**Context:** We wanted search and tag filters to persist across reloads and be shareable via URL without complicating components.

**Decision:** `TaskFilterContext` reads/writes filters from/to `q` and `tags` query params using Next.js `useSearchParams` and `router.replace`.

**Rationale:**
- Bookmarkable/shareable filter state
- Keeps URL handling in one place, not spread across components
- Filters survive page refresh

**Trade-offs:**
- Slight coupling to URL structure
- Should add debounce for search to avoid excessive `router.replace` calls

---

### Priority Field Added to Task Model — 2025-01

**Phase:** 1 / 2

**Context:** The original plan had a simple task model without priority. During implementation, we decided tasks should have priority levels for better organization.

**Decision:** Add `priority` field with values: `"Lowest" | "Low" | "Normal" | "Medium" | "High" | "Highest"`. Default to `"Normal"`.

**Rationale:**
- Common feature in task management apps
- Enables future sorting by priority
- Simple enum is easy to implement and display

**Trade-offs:**
- Adds UI complexity (priority dropdown on each task)
- Need to decide whether/how to sort by priority

---

### Keyboard Shortcuts as First-Class UX — 2025-01

**Phase:** 1

**Context:** While building the task UI, we wanted to support power users who prefer keyboard navigation.

**Decision:** Add global keyboard shortcuts:
- `N` - Open new task dialog
- `/` - Open search/filter dialog
- `Escape` - Close dialogs

Implemented via `useEffect` with `window.addEventListener('keydown', ...)` in the tasks page.

**Rationale:**
- Common pattern in productivity apps (Gmail, Notion, Linear)
- Low implementation cost, high UX value
- Disabled when user is typing in an input

**Trade-offs:**
- Global listener could conflict with future features (e.g., markdown editor)
- May need to scope shortcuts or use a hotkey library as app grows

---

*Add new decisions above this line*
