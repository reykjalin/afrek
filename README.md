# Afrek

A task management app that helps you turn your backlog into accomplishments.

*Afrek (Icelandic): feat, accomplishment, achievement.*

## Overview

Afrek is a weekly task planner with rich markdown notes. Schedule tasks to specific days, keep a backlog for later, and add detailed notes to each task with a WYSIWYG editor.

**Key features:**
- Weekly view with Monday–Sunday layout
- Expandable tasks with markdown notes
- Tags, search, and filtering
- Backlog for unscheduled work
- $3/month or $30/year subscription

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind 4, Shadcn/Base UI |
| Auth & Billing | Clerk |
| Database | Convex |
| Editor | @uiw/react-md-editor |

## Development

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- [Convex CLI](https://docs.convex.dev/getting-started)
- Clerk account
- Stripe account (for billing)

### Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure `.env.local` with your Clerk and Convex keys

5. Start the Convex dev server (in a separate terminal):
   ```bash
   npx convex dev
   ```

6. Start the Next.js dev server:
   ```bash
   bun run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Commands

```bash
bun run dev       # Start Next.js dev server
bun run build     # Production build
bun run lint      # Run ESLint
npx convex dev    # Start Convex dev server
npx convex deploy # Deploy Convex to production
```

## Project Structure

```
app/              # Next.js pages and routes
components/       # React components
features/         # Feature modules (hooks, API wrappers, types)
lib/              # Utilities
convex/           # Convex backend (schema, functions)
docs/             # Documentation
```

## Documentation

- [docs/PLAN.md](docs/PLAN.md) — Implementation plan and phases
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Technical decisions
- [docs/AI_AGENTS.md](docs/AI_AGENTS.md) — Guidelines for AI agents

## Contributing

This project is developed primarily by AI agents. See [docs/AI_AGENTS.md](docs/AI_AGENTS.md) for conventions and guidelines.
