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
| Markdown Editor | Plate (platejs.org) |

---

## Implementation Phases

Each phase produces a working, testable product.

---

### Phase 0: Repository Structure & Conventions ✅ Completed
**Time estimate:** <1 hour

**Goal:** Establish folder structure and conventions so AI agents work consistently.

#### Deliverables

1. [x] Create folder structure:
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
     layout/                 # AppShell, AppSidebar, TopNav
     tasks/                  # Task-related components
     editors/                # Markdown editor components
   features/
     tasks/
       hooks.ts              # useTasks, useTaskFilters
       api.ts                # Convex wrapper functions
       types.ts              # Task, Tag types
       TaskStateContext.tsx  # Central task data + mutations
       TaskFilterContext.tsx # Search/tag filters with URL sync
     layout/                 # TopNav actions context (added during implementation)
       TopNavActionsContext.tsx
     auth/
       hooks.ts
     billing/
       hooks.ts
   lib/
     convexClient.tsx        # Convex provider wrapper (JSX, hence .tsx)
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

2. [x] Create documentation files:
   - `docs/ARCHITECTURE.md` - Stack overview, conventions
   - `docs/AI_AGENTS.md` - How agents should extend the codebase
   - `AGENTS.md` (root) - Quick reference for build/lint commands

3. [x] Create `.env.example` with placeholders for Clerk and Convex keys

#### Testing
- [x] `bun run build` succeeds
- [x] `bun run dev` shows landing page shell

---

### Phase 1: Static UI with Local State ✅ Completed
**Time estimate:** 1–3 hours + UI polish

**Goal:** Build complete UI with mock data and useState, no backend.

> **Implementation Note:** Convex integration was pulled forward into this phase, so the UI was built with real persistence from the start rather than mock data.

#### Deliverables

1. **App Shell** (`components/layout/`)
   - [x] `AppShell.tsx` - Main layout wrapper
   - [x] `AppSidebar.tsx` - Navigation (Tasks, Settings), filters area *(renamed from planned `Sidebar.tsx`)*
   - [x] `TopNav.tsx` - User avatar placeholder, "Upgrade" button

2. **Task Components** (`components/tasks/`)
   - [x] `TaskList.tsx` - Vertical list of tasks
   - [x] `TaskItem.tsx` - Single task with:
     - Checkbox (toggle done)
     - Title (editable inline)
     - Tags (chip display, clickable for filtering)
     - Priority dropdown (Highest → Lowest)
     - Due date picker via calendar popover
     - Expand/collapse caret
   - [x] `TaskItemExpanded.tsx` - Expanded view with:
     - Textarea for notes (WYSIWYG later)
     - Quick actions: "Today", "Tomorrow", "This Week", "Backlog", "Delete"
   - [x] `WeeklyView.tsx` - 7-day grid, Monday first
   - [x] `TaskFilters.tsx` - Search input, tag chips (in modal dialog)
   
   > **Note:** Backlog is implemented as a separate page (`/backlog`) rather than a `BacklogView` component. See Phase 4.

3. **Pages** (`app/(app)/`)
   - [x] `tasks/page.tsx` - Weekly view with task management
     - Task state via `TaskStateContext` backed by Convex *(originally planned as local useState)*
     - Search and filter controls (via modal, keyboard shortcut `/`)
     - New task creation (via modal, keyboard shortcut `N`)
   - [x] `backlog/page.tsx` - Dedicated backlog page for unscheduled tasks
   - [x] `completed/page.tsx` - Completed tasks view with week-based grouping
   
   > **Note:** Instead of a tab toggle on the tasks page, backlog and completed are separate pages accessible via sidebar navigation.

4. **Types** (`features/tasks/types.ts`)
   ```typescript
   export type TaskStatus = "backlog" | "scheduled" | "done";
   export type TaskPriority = "Lowest" | "Low" | "Normal" | "Medium" | "High" | "Highest";

   export interface Task {
     id: string;
     title: string;
     notesMarkdown: string;
     tags: string[];
     status: TaskStatus;
     priority: TaskPriority;
     scheduledDate?: string; // ISO date string (YYYY-MM-DD)
     completedAt?: number;   // timestamp when marked done
     createdAt: number;
     updatedAt: number;
     userId: string;
   }
   ```

5. **Bonus: Keyboard Shortcuts** *(not in original plan)*
   - [x] `N` - Open new task dialog
   - [x] `/` - Open search/filter dialog
   - [x] `Escape` - Close dialogs

#### Testing
- [x] Can add, edit, delete tasks (persisted via Convex)
- [x] Can expand tasks and edit notes
- [x] Weekly view displays tasks by day
- [x] Backlog page shows unscheduled tasks (`/backlog`)
- [x] Completed page shows done tasks (`/completed`)
- [x] Search filters tasks by title
- [x] Tag chips filter by tag

---

### Phase 2: Convex Database Integration ✅ Completed
**Time estimate:** 1–2 days

**Goal:** Replace local state with Convex persistence using a demo user.

#### Deliverables

1. [x] **Set up Convex**
   - Install: `bun add convex`
   - Run: `npx convex dev`
   - Create `lib/convexClient.tsx` *(JSX provider wrapper, hence .tsx not .ts)*
   - Wrap app with `ConvexProvider` via `ConvexClientProvider`

2. [x] **Database Schema** (`convex/schema.ts`)
   - Tasks table with all fields (including priority, completedAt)
   - Indexes: by_user, by_user_scheduled, by_user_status
   - Search index on title for full-text search

3. [x] **Convex Functions** (`convex/tasks.ts`)
   - Queries:
     - `listTasks({ userId, search?, tags?, status? })` - with full-text search
     - `getTask({ id })`
   - Mutations:
     - `createTask({ userId, title, tags?, scheduledDate?, priority? })`
     - `updateTask({ id, title?, notesMarkdown?, tags?, status?, priority?, scheduledDate? })`
     - `toggleDone({ id })`
     - `deleteTask({ id })`

4. [x] **API Wrappers** (`features/tasks/api.ts`)
   - `useTasksQuery(filters)` - wraps useQuery with server-side filtering
   - `useCreateTask()` - wraps useMutation
   - `useUpdateTask()` - wraps useMutation
   - `useDeleteTask()` - wraps useMutation
   - `useToggleDone()` - wraps useMutation

5. [x] **Use demo user for now**
   - Constant `DEMO_USER_ID = "demo"` until Clerk integration

6. [x] **Server-side filtering**
   - Full-text search on title using Convex search index
   - Tag filtering via server query
   - Cache previous results while loading to prevent UI flicker (via `TaskStateContext` holding last task list)

7. [x] **Context Architecture** *(emerged during implementation)*
   - `TaskStateContext` - Central task data, CRUD operations, expansion state
   - `TaskFilterContext` - Search/tag filters with URL query param persistence
   - `TopNavActionsContext` - Allows pages to inject actions into TopNav

#### Key Implementation Details

- **Clearing scheduledDate:** `UpdateTaskInput.scheduledDate` uses `string | null` type. Passing `null` clears the date (moves to backlog); `undefined` means "don't change".
- **Status automation:** When `scheduledDate` is set, status becomes `"scheduled"`. When cleared, becomes `"backlog"`. When toggled done, becomes `"done"` with `completedAt` timestamp.
- **URL persistence:** Filters are stored in URL query params (`?q=search&tags=tag1,tag2`) for shareability and refresh persistence.

#### Testing
- [x] Tasks persist across page refreshes
- [x] CRUD operations work via Convex dashboard
- [x] Multiple browser tabs stay in sync (real-time updates)
- [x] Search filters tasks using full-text search
- [x] Tag filtering works server-side

---

### Phase 3: Clerk Authentication ✅ Completed
**Time estimate:** 1–3 hours

**Goal:** Add user authentication, scope data to authenticated users.

#### Deliverables

1. [x] **Install Clerk**
   - `bun add @clerk/nextjs`
   - Configure environment variables
   - Wrap app with `ClerkProvider`

2. [x] **Middleware** (`middleware.ts`)
   - Protect `(app)` routes
   - Allow `(marketing)` routes publicly

3. [x] **Auth Pages**
   - `app/(marketing)/sign-in/[[...sign-in]]/page.tsx`
   - `app/(marketing)/sign-up/[[...sign-up]]/page.tsx`

4. [x] **Connect Clerk to Convex**
   - Use `ConvexProviderWithClerk`
   - Pass Clerk user ID to Convex functions
   - Update Convex functions to require authentication

5. [x] **Update Tasks API**
   - Replace `DEMO_USER_ID` with Clerk user ID via `useAuth()`
   - All queries filter by authenticated user

6. [x] **UI Updates**
   - Show user avatar in TopNav
   - Add sign out button (via Clerk's UserButton)
   - Gate `(app)` content for signed-in users only

#### Key Implementation Details

- **Provider structure:** ClerkProvider and ConvexProvider are now in the (app) layout only, keeping marketing pages statically renderable.
- **Dynamic prop:** ClerkProvider uses `dynamic` prop to avoid build-time key requirements.
- **Skip queries:** When userId is not yet available, queries skip execution using Convex's `"skip"` argument.
- **JWT Template:** Must create a `convex` JWT template in Clerk Dashboard (do NOT rename it).
- **Auth config:** `convex/auth.config.ts` configures the Clerk issuer domain for token validation.

#### Setup Steps (for new environments)

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. In Clerk Dashboard → JWT Templates → New Template → Select "Convex"
3. Copy the Issuer URL (Frontend API URL)
4. Set environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_JWT_ISSUER_DOMAIN` (the Issuer URL from step 3)
5. Run `npx convex dev` to sync auth config to Convex backend

#### Testing
- [x] Can sign up and sign in
- [x] Each user sees only their own tasks
- [x] Signing out redirects to landing page
- [x] Cannot access `/tasks` without authentication

---

### Phase 4: Scheduling & Weekly View ✅ Completed
**Time estimate:** 1–3 hours

**Goal:** Build robust scheduling UX with Monday-first weekly view.

> **Note:** Core scheduling and weekly navigation were implemented during Phases 1-2. Backlog is implemented as a dedicated page.

#### Deliverables

1. [x] **Date Utilities** (`lib/date.ts`)
   - `getStartOfWeek(date)` - Returns Monday of the week
   - `getWeekDays(startMonday)` - Returns array of 7 days with labels
   - `toISODateString(date)` - Formats as YYYY-MM-DD in local time
   - `parseISODate(dateString)` - Parses without timezone issues
   - `isToday(dateString)` - Checks if date is today
   - `isSameWeek(date1, date2)` - Monday-based week comparison
   - `getWeekNumber(date)` - ISO week number (1-53)
   - `formatWeekRange(startMonday)` - e.g., "Jan 20 - Jan 26"
   - `getTodayString()`, `getTomorrowString()` - Quick date helpers

2. [x] **Weekly View** (`components/tasks/WeeklyView.tsx`)
   - Monday–Sunday grid layout
   - Week navigation (previous/next buttons)
   - "Go to current week" button when viewing other weeks
   - Week number display with date range tooltip
   - Today highlighted visually
   - Tasks grouped by `scheduledDate`

3. [x] **Task Scheduling**
   - Calendar popover on each task for date selection
   - Quick actions in expanded view: Today, Tomorrow, This Week, Backlog
   - Status automatically updates based on scheduling

4. [x] **Backlog Page** (`app/(app)/backlog/page.tsx`)
   - Dedicated page for unscheduled tasks (status = "backlog")
   - Same task interactions as weekly view
   - Accessible via sidebar navigation

5. [x] **Completed Page** (`app/(app)/completed/page.tsx`)
   - View of done tasks grouped by completion week
   - Week navigation to see historical completions

#### Testing
- [x] Week starts on Monday
- [x] Can navigate between weeks
- [x] Tasks appear on correct days
- [x] Can schedule/reschedule tasks via date picker
- [x] Backlog tasks visible on `/backlog` page
- [x] Completed tasks visible on `/completed` page

---

### Phase 5: Search, Tags, Filters & Sort ✅ Completed
**Time estimate:** 2–4 hours

**Goal:** Comprehensive search, filtering, and organization capabilities.

#### Deliverables

1. **Search**
   - [x] Search input in TaskFilters (modal dialog)
   - [x] Searches task title via Convex full-text search index
   - [x] Keyboard shortcut `/` opens search dialog
   - [x] Search term persisted in URL (`?q=...`)
   - [x] Include `notesMarkdown` in search results (title + notes)
   - [x] Debounce search input (300ms) to reduce query churn

2. **Tags**
   - [x] Tag input on task creation (comma-separated)
   - [x] Tags displayed as colored chips on TaskItem
   - [x] Clicking a tag chip toggles it in the filter
   - [x] Multi-select tag filtering
   - [x] Auto-suggest from existing user tags (computed from task list)
   - [x] Tags persisted in URL (`?tags=tag1,tag2`)

3. **Backend Updates**
   - [x] `listTasks` handles `search`, `tags`, and `status` filter parameters
   - [x] Full-text search via Convex search indexes on `title` and `notesMarkdown`

4. **Backlog View**
   - [x] Visible list of tasks with no `scheduledDate` (implemented as `/backlog` page)

#### Testing
- [x] Search filters in real-time
- [x] Tags can be added/removed from tasks
- [x] Tag filter shows only matching tasks
- [x] Backlog tasks accessible via `/backlog` page
- [x] Completed tasks accessible via `/completed` page

---

### Phase 6: WYSIWYG Markdown Editor (Plate)
**Time estimate:** 2–4 hours

**Goal:** Upgrade notes from textarea to rich WYSIWYG editor using Plate (platejs.org).

#### Why Plate?
- Built on Slate.js, highly customizable
- First-class TypeScript support
- Plugin architecture for features (markdown, lists, etc.)
- Active development and good documentation
- Integrates well with Tailwind and shadcn/ui

#### Deliverables

1. **Install Plate**
   - `bun add @udecode/plate`
   - Install additional plugins as needed (lists, code, etc.)

2. **Editor Component** (`components/editors/PlateEditor.tsx`)
   - Configure Plate with plugins: paragraph, headings, bold, italic, lists, code, links
   - Placeholder text support

3. **Schema Update**
   - Change `notesMarkdown: string` to `notesJson: string` (serialized Slate JSON)
   - Store Plate's native JSON format directly in database

4. **Integration**
   - Replace textarea in TaskItemExpanded with PlateEditor
   - Debounce saves (500ms) to avoid excessive API calls
   - Parse/stringify JSON for database storage

5. **Styling**
   - Match editor theme to app theme using Tailwind
   - Toolbar with common formatting options (optional, can use keyboard shortcuts)
   - Ensure proper dark mode support (stretch goal)

#### Testing
- Rich text editing works (bold, italic, lists, code, links)
- Keyboard shortcuts work (Cmd+B for bold, etc.)
- Changes persist to database as JSON
- No SSR errors (use dynamic import if needed)

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

### Phase 8: Telemetry (PostHog)
**Time estimate:** 1–2 hours

**Goal:** Add privacy-respecting analytics to understand user behavior and improve the product.

#### Deliverables

1. **Install PostHog**
   - `bun add posthog-js`
   - Configure environment variables
   - Create `lib/posthog.ts` provider wrapper

2. **Integration**
   - Initialize PostHog in app layout
   - Identify users after Clerk auth (use Clerk user ID)
   - Respect Do Not Track browser setting

3. **Key Events to Track**
   - Task created, completed, deleted
   - Scheduling actions (scheduled, moved to backlog)
   - Feature usage (search, filters, markdown editor)
   - Page views (tasks, backlog, completed, settings)
   - Subscription events (upgrade, cancel)

4. **Privacy Considerations**
   - Never log task content (titles, notes)
   - Only track aggregate behavior patterns
   - Provide opt-out in settings (stretch goal)

#### Testing
- Events appear in PostHog dashboard
- User identification works correctly
- No PII or task content in event payloads

---

### Phase 9: Data Export
**Time estimate:** 2–4 hours

**Goal:** Allow users to export their data in standard formats.

#### Deliverables

1. **Export Formats**
   - CSV export (tasks with all metadata)
   - todo.txt format (http://todotxt.org/) for interoperability

2. **Export UI** (`app/(app)/settings/page.tsx`)
   - "Export Data" section in settings
   - Format selector (CSV, todo.txt)
   - Download button that triggers client-side export

3. **Export Logic** (`features/tasks/export.ts`)
   ```typescript
   export function exportToCSV(tasks: Task[]): string;
   export function exportToTodoTxt(tasks: Task[]): string;
   export function downloadFile(content: string, filename: string, mimeType: string): void;
   ```

4. **todo.txt Format Mapping**
   - `x` prefix for completed tasks
   - `(A)` priority mapping (Highest→A, High→B, etc.)
   - `due:YYYY-MM-DD` for scheduled date
   - `+tag` for each tag
   - `created:YYYY-MM-DD` for creation date

#### Testing
- CSV opens correctly in Excel/Google Sheets
- todo.txt imports into other todo.txt apps
- All task data preserved in exports

---

### Phase 10: Client-Side Encryption
**Time estimate:** 1–2 days

**Goal:** Enable end-to-end encryption so sensitive data is never readable on the server.

#### Deliverables

1. **Install Encryption Library**
   - `bun add libsodium-wrappers` (or `tweetnacl` as lighter alternative)
   - Create `lib/crypto.ts` wrapper

2. **Key Management**
   - Derive encryption key from user password (or separate passphrase)
   - Use Argon2id for key derivation (via libsodium)
   - Store encrypted key backup (optional, for recovery)
   - **Important:** Key never leaves the browser unencrypted

3. **Encrypted Fields**
   - `title` - encrypted
   - `notesMarkdown` - encrypted
   - `tags` - encrypted (prevents tag-based analysis)
   - Metadata (dates, status, priority) - unencrypted (for queries)

4. **Schema Updates** (`convex/schema.ts`)
   ```typescript
   tasks: defineTable({
     // Encrypted fields stored as base64 strings
     encryptedTitle: v.optional(v.string()),
     encryptedNotes: v.optional(v.string()),
     encryptedTags: v.optional(v.string()),
     // Keep unencrypted for queries
     title: v.optional(v.string()), // Empty when encrypted
     // ... rest unchanged
   })
   ```

5. **Encryption Toggle**
   - Setting in user preferences to enable/disable
   - Migration flow: encrypt existing tasks on enable
   - Warning: losing passphrase = losing data

6. **UI Indicators**
   - Lock icon when encryption is enabled
   - Clear messaging about encryption status
   - Passphrase entry on login (if enabled)

#### Security Considerations
- Use authenticated encryption (XChaCha20-Poly1305)
- Unique nonce per encryption operation
- Zero-knowledge: server never sees plaintext
- Search disabled for encrypted content (or use deterministic encryption for search, with trade-offs)

#### Testing
- Data unreadable in Convex dashboard when encrypted
- Decryption works correctly after page refresh
- Wrong passphrase shows clear error
- Encryption/decryption performance acceptable

---

### Phase 11: Admin Area
**Time estimate:** 1–2 days

**Goal:** Minimal admin interface for account and application management.

#### Design Principles
- **Minimal data exposure:** Show only what's needed for support
- **Audit logging:** Track all admin actions
- **Privacy-first:** No ability to read user task content

#### Deliverables

1. **Admin Role**
   - Add `role` field to user data: `"user" | "admin"`
   - Check role in middleware and Convex functions
   - Admin accounts managed via environment variable or Clerk metadata

2. **Admin Routes** (`app/(admin)/`)
   - Protected by admin role check
   - Separate layout from main app

3. **Admin Dashboard** (`app/(admin)/dashboard/page.tsx`)
   - Total users (active, churned)
   - Subscription breakdown (free, monthly, yearly)
   - Tasks created (aggregate, no content)
   - Error rates / health metrics

4. **User Management** (`app/(admin)/users/page.tsx`)
   - Search users by email (partial match)
   - Display: email, signup date, plan, task count
   - **Never display:** task titles, notes, tags
   - Actions:
     - Grant free access / extend trial
     - Apply discount to subscription
     - Delete account and all data
     - Trigger full data export (sends to user's email)

5. **Convex Functions** (`convex/admin.ts`)
   - `listUsers({ search?, limit, offset })`
   - `getUserStats({ userId })` - aggregate stats only
   - `grantFreeAccess({ userId, until })`
   - `applyDiscount({ userId, percent, months })`
   - `deleteUser({ userId })` - cascades to all user data
   - `triggerExport({ userId })` - queues export job

6. **Audit Log** (`convex/schema.ts`)
   ```typescript
   adminAuditLog: defineTable({
     adminUserId: v.string(),
     action: v.string(),
     targetUserId: v.optional(v.string()),
     details: v.string(), // JSON
     timestamp: v.number(),
   }).index("by_admin", ["adminUserId"])
     .index("by_target", ["targetUserId"])
   ```

#### Testing
- Non-admins cannot access admin routes
- All admin actions logged
- User deletion removes all associated data
- Cannot see user task content from admin

---

### Phase 12: Launch Prep
**Time estimate:** 1–2 days

**Goal:** Polish public-facing pages and legal compliance for launch.

#### Deliverables

1. **Landing Page** (`app/(marketing)/page.tsx`)
   - Clear value proposition
   - Feature highlights with visuals
   - Pricing summary with link to full pricing page
   - Call-to-action: Sign up
   - Social proof (testimonials, if available)

2. **Privacy Policy** (`app/(marketing)/privacy/page.tsx`)
   - What data we collect
   - How we use it (PostHog analytics)
   - Client-side encryption option
   - Data retention policy
   - GDPR/CCPA compliance
   - Contact information

3. **Terms of Service** (`app/(marketing)/terms/page.tsx`)
   - Acceptable use
   - Payment terms
   - Liability limitations
   - Account termination

4. **Footer Links**
   - Add Privacy Policy and Terms links to all pages
   - Social links (if applicable)

5. **SEO & Meta**
   - Open Graph tags for social sharing
   - Proper meta descriptions
   - Favicon and app icons

6. **Final Polish**
   - Mobile responsiveness check
   - Accessibility audit (keyboard navigation, screen readers)
   - Performance check (Core Web Vitals)

#### Testing
- Landing page converts (A/B test with PostHog, stretch goal)
- Legal pages reviewed (consider legal counsel)
- All links work
- Mobile experience is good

---

## File Structure Reference

```
afrek/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx      # Privacy policy (Phase 12)
│   │   ├── terms/page.tsx        # Terms of service (Phase 12)
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── tasks/page.tsx        # Weekly view
│   │   ├── backlog/page.tsx      # Unscheduled tasks
│   │   ├── completed/page.tsx    # Done tasks
│   │   └── settings/page.tsx     # User settings + data export
│   ├── (admin)/                   # Admin area (Phase 11)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   └── webhooks/stripe/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                    # Shadcn components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── AppSidebar.tsx
│   │   └── TopNav.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskItemExpanded.tsx
│   │   ├── WeeklyView.tsx
│   │   └── TaskFilters.tsx
│   └── editors/
│       ├── MarkdownEditor.tsx
│       └── MarkdownPreview.tsx
├── features/
│   ├── tasks/
│   │   ├── hooks.ts
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── export.ts             # Data export (Phase 9)
│   │   ├── TaskStateContext.tsx
│   │   ├── TaskFilterContext.tsx
│   │   └── index.ts
│   ├── layout/
│   │   ├── TopNavActionsContext.tsx
│   │   └── TopNavContext.tsx
│   ├── auth/
│   │   └── hooks.ts
│   └── billing/
│       ├── hooks.ts
│       └── types.ts
├── lib/
│   ├── utils.ts
│   ├── convexClient.tsx
│   ├── crypto.ts                 # Encryption (Phase 10)
│   ├── posthog.ts                # Telemetry (Phase 8)
│   ├── date.ts
│   └── markdown.ts
├── convex/
│   ├── schema.ts
│   ├── tasks.ts
│   ├── users.ts
│   ├── subscriptions.ts
│   └── admin.ts                  # Admin functions (Phase 11)
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

We are currently at **Phase 6: WYSIWYG Markdown Editor**.

Phases 0–5 are complete.

### Remaining Phases

| Phase | Name | Status | Time Estimate |
|-------|------|--------|---------------|
| 6 | Markdown Editor | Todo | 1–3 hours |
| 7 | Billing (Stripe) | Todo | 1–2 days |
| 8 | Telemetry (PostHog) | Todo | 1–2 hours |
| 9 | Data Export | Todo | 2–4 hours |
| 10 | Client-Side Encryption | Todo | 1–2 days |
| 11 | Admin Area | Todo | 1–2 days |
| 12 | Launch Prep | Todo | 1–2 days |

### Critical Path to Launch
1. **Phase 3** - Auth (required for multi-user)
2. **Phase 7** - Billing (required for revenue)
3. **Phase 12** - Launch prep (legal, landing page)

### Nice-to-Have Before Launch
- Phase 6 (Markdown) - improves UX significantly
- Phase 8 (Telemetry) - helps understand usage
- Phase 10 (Encryption) - differentiator for privacy-conscious users
