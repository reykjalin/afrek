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
  tasks/              # Task hooks, API, types
  auth/               # Auth hooks
  billing/            # Billing hooks, types
lib/                  # Utilities
convex/               # Convex backend
docs/                 # Documentation
```

## Key Files

- `docs/PLAN.md` - Implementation plan and phases
- `docs/AI_AGENTS.md` - Detailed agent instructions
- `convex/schema.ts` - Database schema
- `features/tasks/types.ts` - Task type definitions

## Conventions

- Use `@/` for absolute imports
- Wrap Convex calls in `features/*/api.ts`
- Keep components small and focused
- Always require `userId` in Convex functions

## Current Phase

Check `docs/PLAN.md` for current implementation phase.
