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

*Add new decisions above this line*
