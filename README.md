# Afrek

**Weekly task planner with rich markdown notes — self-hostable**

*Afrek (Icelandic): feat, accomplishment, achievement.*

Plan your week with a Monday–Sunday grid, attach rich notes to each task, and keep a backlog for the rest. Optional end-to-end encryption keeps your data private even from the server.

<!-- TODO: Add screenshot here -->
<!-- ![Weekly view with expandable markdown notes](docs/screenshots/weekly-view.png) -->

---

## Why Afrek?

- **Plan your week, not a bottomless list** — Monday–Sunday layout with dedicated backlog and completed views.
- **Rich notes on every task** — WYSIWYG markdown editor for detailed context, checklists, and references.
- **Fast filtering** — Tags, search, and keyboard shortcuts to find tasks instantly.
- **Optional end-to-end encryption** — WebAuthn PRF + AES-GCM; the server never sees your plaintext notes.
- **Real-time sync** — Changes sync across devices instantly via Convex.
- **Self-hostable** — Run on your own infrastructure with Clerk + Convex in under 10 minutes.

---

## Features

| Feature | Description |
|---------|-------------|
| **Weekly view** | Monday–Sunday grid with drag-and-drop scheduling |
| **Expandable tasks** | Click to reveal a full markdown editor with live preview |
| **Tags & filtering** | Organize with tags, filter by tag or search by title |
| **Backlog** | Dedicated view for unscheduled work |
| **Completed view** | See what you've accomplished, grouped by week |
| **Client-side encryption** | Optional AES-GCM encryption with WebAuthn PRF key derivation |
| **Keyboard shortcuts** | `N` new task, `/` search, and more |
| **Subscription billing** | Built-in Stripe integration via Clerk (optional for self-hosters) |

---

## Quick Start

### Run locally (2 commands)

Start by running `bun install` to install dependencies, then:

```bash
# In one terminal:
bun run dev

# In another terminal:
bunx convex dev
```

See [Self-Hosting](#self-hosting) below to configure Clerk and Convex.

---

## Self-Hosting

Afrek requires two external services (both have generous free tiers):

1. **[Clerk](https://clerk.com)** — Authentication, user management, billing UI
2. **[Convex](https://convex.dev)** — Real-time database and backend functions
3. **[Stripe](https://stripe.com)** — (Optional) Only needed for paid subscriptions

### Setup

1. **Create accounts** on Clerk and Convex (free tiers work fine for personal use)

2. **Clone and configure:**
   ```bash
   git clone https://github.com/reykjalin/afrek.git
   cd afrek
   bun install
   cp .env.example .env.local
   ```

3. **Configure `.env.local`** with your API keys (see [Configuration](#configuration))

4. **Start the backend** (in a separate terminal):
   ```bash
   npx convex dev
   ```

5. **Start the app:**
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Deployment

A typical production setup:
- **Next.js** → Vercel, Netlify, or your preferred host
- **Convex** → `npx convex deploy`
- **Clerk** → Configure redirect URLs for your domain

---

## Configuration

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL |

### Optional

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | For subscription billing |
| `STRIPE_WEBHOOK_SECRET` | For Stripe webhooks |

See [.env.example](.env.example) for the full list.

---

## Architecture & Dependencies

Afrek is built on modern managed services so you don't have to maintain your own auth stack or real-time database.

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16, React 19 |
| Styling | Tailwind 4, Shadcn/Base UI |
| Auth & Billing | Clerk |
| Database | Convex |
| Editor | Plate (platejs.org) |
| Encryption | WebAuthn PRF + AES-GCM |

### Why Clerk and Convex?

- No custom auth logic or password handling
- Production-ready real-time sync across devices
- Generous free tiers for personal deployments
- Simple environment variable configuration — no migrations or schema setup

### Trade-offs

Afrek depends on these hosted services today. If you need a stack that runs entirely on your own infrastructure with no external SaaS, Afrek might not be the right fit yet. The data model is small, and we're open to community efforts to add alternative backends (e.g., Postgres/Supabase adapters).

---

## Data & Security

- **Task data** is stored in your Convex project — you control access
- **User data** (email, auth) is managed by your Clerk project
- **With encryption enabled**, task content is encrypted in your browser before reaching Convex; only you hold the keys
- **Telemetry** (if/when added) will be opt-out and documented

---

## Project Structure

```
app/                  # Next.js pages and routes
  (marketing)/        # Public pages (landing, pricing, auth)
  (app)/              # Protected pages (tasks, settings)
components/           # React components
  ui/                 # Shadcn/Base UI components
  tasks/              # Task-related components
  editors/            # Markdown editor components
features/             # Feature modules (hooks, API, types)
lib/                  # Utilities
convex/               # Convex backend (schema, functions)
docs/                 # Documentation
```

---

## Development

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+)
- [Convex CLI](https://docs.convex.dev/getting-started)
- Clerk account
- Stripe account (optional, for billing)

### Commands

```bash
bun run dev           # Start Next.js dev server
npx convex dev        # Start Convex dev server (separate terminal)
bun run build         # Production build
bun run lint          # Run ESLint
npx convex deploy     # Deploy Convex to production
```

---

## Documentation

- [docs/PLAN.md](docs/PLAN.md) — Implementation roadmap and phases
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Technical decisions
- [docs/AI_AGENTS.md](docs/AI_AGENTS.md) — Guidelines for AI contributors

---

## Project Status

**Actively developed** — Phases 0–9 complete. See [docs/PLAN.md](docs/PLAN.md) for the full roadmap.

### Coming Soon

- PostHog telemetry (opt-out)
- Data export (CSV, todo.txt)
- Landing page polish

---

## Contributing

Contributions are welcome! Please see [docs/AI_AGENTS.md](docs/AI_AGENTS.md) for conventions and guidelines.

We're especially interested in:
- Alternative backend adapters (Postgres, Supabase, etc.)
- Alternative auth providers
- UI/UX improvements

### AI Usage

Development of Afrek has been heavily aided by AI, and the codebase reflects this. As the project matures, less AI will be used for wide-ranging changes, and more code will be written by a human. Before 1.0, a thorough manual review will be conducted to ensure the codebase is maintainable going forward.

AI-assisted contributions are welcome, but must be properly disclosed.

---

## License

[FSL-1.1-MIT](LICENSE) — Free to use, modify, and self-host for personal and internal use. Becomes MIT licensed after 2 years. See [LICENSE](LICENSE) for details, or learn more at [fsl.software](https://fsl.software).
