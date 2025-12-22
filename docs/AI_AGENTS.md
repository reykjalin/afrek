# AI Agent Instructions

Guidelines for AI agents working on the Afrek codebase.

## Your Responsibilities

As an AI agent, you are responsible for:

1. **Git commits:** Commit your work with clear, descriptive messages. Commit after completing logical units of work (e.g., finishing a component, completing a phase).
2. **Marking progress:** Update `docs/PLAN.md` to mark tasks and phases as complete when done.
3. **Keeping docs current:** Update documentation to reflect any changes you make.

## Before Making Changes

1. **Read the plan:** Check `docs/PLAN.md` for current phase and requirements
2. **Understand structure:** Review existing code in the relevant feature folder
3. **Check conventions:** Follow patterns established in similar components

## Code Organization

### Adding a New Feature

1. Create a feature folder: `features/my-feature/`
2. Add required files:
   - `types.ts` - TypeScript interfaces and types
   - `hooks.ts` - React hooks for the feature
   - `api.ts` - Convex API wrappers
3. Mirror any Convex schema types in `types.ts`

### Adding a Component

1. Determine the appropriate folder:
   - `components/ui/` - Generic UI primitives (buttons, inputs)
   - `components/layout/` - App shell, navigation
   - `components/tasks/` - Task-specific components
   - `components/editors/` - Markdown/text editors
2. Use existing components as templates
3. Keep components small and focused

### Adding a Convex Function

1. Add to appropriate file in `convex/`:
   - `tasks.ts` - Task CRUD operations
   - `users.ts` - User management
   - `subscriptions.ts` - Billing/subscription
2. Always require `userId` parameter for user-scoped data
3. Update `convex/schema.ts` if adding new tables

## Conventions

### Naming

- **Components:** PascalCase (`TaskItem.tsx`)
- **Hooks:** camelCase with `use` prefix (`useTaskFilters`)
- **Utilities:** camelCase (`formatDateLabel`)
- **Types:** PascalCase (`Task`, `TaskStatus`)
- **Files:** Match export name (`TaskItem.tsx` exports `TaskItem`)

### Imports

```typescript
// Prefer absolute imports
import { Task } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";

// Group imports: React, external, internal, relative
import { useState } from "react";
import { useQuery } from "convex/react";
import { cn } from "@/lib/utils";
import { TaskItem } from "./TaskItem";
```

### Components

```typescript
// Use interface for props
interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

// Export named function
export function TaskItem({ task, onUpdate }: TaskItemProps) {
  // ...
}
```

### Convex API Access

```typescript
// ❌ Don't call Convex directly in components
const tasks = useQuery(api.tasks.listTasks, { userId });

// ✅ Use feature API wrapper
import { useTasksQuery } from "@/features/tasks/api";
const tasks = useTasksQuery({ status: "scheduled" });
```

## Common Patterns

### Creating a Hook with Convex

```typescript
// features/tasks/api.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export function useTasksQuery(filters: TaskFilters) {
  const { userId } = useAuth();
  return useQuery(
    api.tasks.listTasks,
    userId ? { userId, ...filters } : "skip"
  );
}

export function useCreateTask() {
  const { userId } = useAuth();
  const mutation = useMutation(api.tasks.createTask);
  
  return async (data: CreateTaskInput) => {
    if (!userId) throw new Error("Not authenticated");
    return mutation({ userId, ...data });
  };
}
```

### Date Handling

```typescript
// Always use lib/date.ts utilities
import { getStartOfWeek, formatDateLabel } from "@/lib/date";

// Dates stored as ISO strings: "2024-01-15"
const today = new Date().toISOString().split("T")[0];
```

### Error Handling

```typescript
// Show user-friendly errors
try {
  await createTask(data);
} catch (error) {
  if (error.message.includes("Upgrade required")) {
    showUpgradeModal();
  } else {
    toast.error("Failed to create task");
  }
}
```

## Testing Checklist

After making changes:

1. Run `bun run build` - ensure no build errors
2. Run `bun run lint` - fix any linting issues
3. Test in browser - verify functionality works
4. Check Convex dashboard - verify data is correct

## Environment Variables

Required in `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# Stripe (Phase 7)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stewardship

AI agents are the primary developers of this codebase. Each agent must leave the project in better shape than they found it.

### Update Documentation as You Work

1. **Mark work complete:** As you finish tasks and phases, update `docs/PLAN.md`:
   - Check off individual deliverables as you complete them: `- [x] Completed item`
   - Add "✅ Completed" to phase headers when all deliverables are done
   - Note any deviations from the original plan
   - Update "Current Phase" in `AGENTS.md`

2. **Document decisions:** When making non-trivial architectural choices:
   - Add an entry to `docs/ARCHITECTURE.md` explaining:
     - What decision was made
     - Why (constraints, trade-offs considered)
     - Date and which phase it was part of
   - Example: "Chose debounce over throttle for search because..."

3. **Amend the plan:** If requirements change or you discover a better approach:
   - Update `docs/PLAN.md` with the new approach
   - Add a note explaining why the plan changed
   - Keep old plans as strikethrough for historical context

### Keep Code Clean

1. **Remove dead code:** Don't leave commented-out code or unused imports
2. **Delete unused files:** Remove files that are no longer needed
3. **Consolidate duplicates:** If you see similar code, refactor to share
4. **Fix warnings:** Address any linter or TypeScript warnings you encounter

### Maintain Consistency

1. **Follow existing patterns:** Look at similar code before creating new patterns
2. **Update related files:** If you change a type, update all usages
3. **Keep tests passing:** Run `bun run build` and `bun run lint` before finishing
4. **Sync types:** Keep `features/*/types.ts` in sync with `convex/schema.ts`

### End-of-Session Checklist

Before ending a working session:

- [ ] Build passes (`bun run build`)
- [ ] Lint passes (`bun run lint`)
- [ ] Documentation updated (PLAN.md, ARCHITECTURE.md if needed)
- [ ] No TODO comments left without corresponding issue/note
- [ ] Commit message clearly describes what was done

### Handoff Notes

When completing significant work, add a brief note at the bottom of your final message summarizing:
- What was accomplished
- What's ready for the next session
- Any known issues or blockers
- Suggested next steps

This helps the next agent (or human) pick up seamlessly.

---

## Getting Help

- Check `docs/PLAN.md` for phase requirements
- Check `docs/ARCHITECTURE.md` for technical decisions
- Look at existing similar code for patterns
- Read external docs: Clerk, Convex, Next.js
