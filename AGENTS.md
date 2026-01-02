# Afrek - Agent Quick Reference

## Commands

```bash
# Development
bun run dev           # Start Next.js dev server
npx convex dev        # Start Convex dev server (separate terminal)

# Build & Check
bun run build         # Production build
bun run lint          # ESLint check

# Convex
npx convex deploy     # Deploy Convex to production
```

## Project Structure

```
app/                  # Next.js pages and routes
  (marketing)/        # Public pages (landing, pricing, auth)
  (app)/              # Protected pages (tasks, settings)
components/           # React components
  ui/                 # Shadcn/Base UI components
  layout/             # App shell components
  tasks/              # Task-related components
  editors/            # Markdown editor components
features/             # Feature modules
  tasks/              # Task hooks, API, types, contexts
  layout/             # TopNav actions context
  auth/               # Auth hooks
  billing/            # Billing hooks, types
lib/                  # Utilities
convex/               # Convex backend
docs/                 # Documentation
```

## Key Files

- `docs/PLAN.md` - Implementation plan and phases
- `docs/AI_AGENTS.md` - Detailed agent instructions
- `docs/ARCHITECTURE.md` - Architecture decision log
- `convex/schema.ts` - Database schema
- `features/tasks/types.ts` - Task type definitions
- `features/tasks/TaskStateContext.tsx` - Central task data + mutations
- `features/tasks/TaskFilterContext.tsx` - Search/tag filters with URL sync
- `features/tasks/api.ts` - Convex API wrappers
- `features/layout/TopNavActionsContext.tsx` - Page-provided top nav actions
- `lib/convexClient.tsx` - Convex client provider wrapper
- `lib/date.ts` - Monday-first week date utilities

## Conventions

- Use `@/` for absolute imports
- Wrap Convex calls in `features/*/api.ts`
- Keep components small and focused
- Always require `userId` in Convex functions

## UI Components

This project uses **shadcn with Base UI** (not Radix UI). Key difference:

- Use `render` prop instead of `asChild` for component composition
- Example: `<SidebarMenuButton render={<Link href="/tasks" />}>` instead of `<SidebarMenuButton asChild><Link>...</Link></SidebarMenuButton>`

## Current Phase

**Phase 3: Clerk Authentication**

Phases 0–2 are complete. Core scheduling (Phase 4) and parts of search/filter (Phase 5) were implemented early. Next step: add Clerk auth, replace `DEMO_USER_ID` with real user IDs.

### What's Done
- ✅ Phase 0: Folder structure, conventions, docs
- ✅ Phase 1: App shell, task components, weekly view, keyboard shortcuts
- ✅ Phase 2: Convex integration, real-time sync, server-side filtering
- ✅ Phase 4: Date utilities, weekly navigation, scheduling UX, backlog page, completed page
- ✅ Phase 5 (partial): Search, tags, URL-persisted filters, backlog/completed views

### What's Remaining
- Phase 3: Clerk auth (current focus)
- Phase 5: Status filter UI, sort options, search debounce, notes search
- Phase 6: Markdown WYSIWYG editor
- Phase 7: Stripe billing

## Key Patterns

### Demo User (Pre-Auth)
Currently using `DEMO_USER_ID = "demo"` in `features/tasks/api.ts`. This will be replaced with Clerk user IDs in Phase 3.

### Clearing scheduledDate
To move a task to backlog, pass `scheduledDate: null` (not `undefined`):
```typescript
updateTask(id, { scheduledDate: null, status: "backlog" });
```

### Filter State Flow
1. `TaskFilterContext` owns search/tags and syncs to URL params
2. `TasksPage` reads from `TaskFilterContext` and pushes to `TaskStateContext.setFilters`
3. `TaskStateContext` passes filters to `useTasksQuery` → Convex

See `docs/PLAN.md` for full details.
