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
- `lib/convexClient.tsx` - Convex client provider with WorkOS AuthKit
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

## Authentication & Billing

- **Authentication:** WorkOS AuthKit
- **Billing:** Dodo Payments
- See `.env.example` for required environment variables

### Auth Flow
1. WorkOS middleware (`middleware.ts`) protects routes
2. Auth routes at `/sign-in`, `/sign-up`, `/callback`, `/sign-out`
3. `ConvexClientProvider` wraps app with `AuthKitProvider`
4. Use `useConvexAuth()` for auth state, `useCurrentUser()` for user data

### Billing Flow
1. Pricing page shows plans with checkout buttons
2. Authenticated users call `api.payments.createCheckout`
3. Dodo webhooks update subscription status in Convex
4. `useIsSubscribed()` hook checks subscription status

## Key Patterns

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
