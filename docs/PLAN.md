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

### Phase 6: WYSIWYG Markdown Editor (Plate) ✅ Completed
**Time estimate:** 2–4 hours

**Goal:** Upgrade notes from textarea to rich WYSIWYG editor using Plate (platejs.org).

#### Why Plate?
- Built on Slate.js, highly customizable
- First-class TypeScript support
- Plugin architecture for features (markdown, lists, etc.)
- Active development and good documentation
- Integrates well with Tailwind and shadcn/ui

#### Deliverables

1. [x] **Install Plate**
   - `bun add @udecode/plate`
   - Install additional plugins as needed (lists, code, etc.)

2. [x] **Editor Component** (`components/editors/PlateEditor.tsx`)
   - Configure Plate with plugins: paragraph, headings, bold, italic, lists, code, links
   - Placeholder text support

3. [x] **Schema Update**
   - Change `notesMarkdown: string` to `notesJson: string` (serialized Slate JSON)
   - Store Plate's native JSON format directly in database

4. [x] **Integration**
   - Replace textarea in TaskItemExpanded with PlateEditor
   - Debounce saves (500ms) to avoid excessive API calls
   - Parse/stringify JSON for database storage

5. [x] **Styling**
   - Match editor theme to app theme using Tailwind
   - Toolbar with common formatting options (optional, can use keyboard shortcuts)
   - Ensure proper dark mode support (stretch goal)

#### Testing
- [x] Rich text editing works (bold, italic, lists, code, links)
- [x] Keyboard shortcuts work (Cmd+B for bold, etc.)
- [x] Changes persist to database as JSON
- [x] No SSR errors (use dynamic import if needed)

---

### Phase 7: Subscription & Billing (Clerk)
**Time estimate:** 1–2 days

**Goal:** Implement subscription model with 30-day free trial using Clerk's built-in billing.

#### Subscription Model
- **30-day free trial** from account creation
- **After trial expires:** Read-only mode (no new tasks, no completing, no editing)
- **Subscribed users:** Full access
- **Data export:** Always available, even with expired trial (see Phase 12)

#### Why Clerk Billing?
- Native integration with existing Clerk auth
- No need to manage Stripe webhooks or customer IDs manually
- Subscription status available directly from Clerk user object
- Built-in checkout and customer portal flows
- Simplified architecture: no `convex/subscriptions.ts` needed

#### Deliverables

1. **Clerk Billing Setup**
   - Enable Clerk Billing in dashboard
   - Create plans in Clerk:
     - "Monthly" - $3/month
     - "Yearly" - $30/year
   - Configure Stripe connection through Clerk

2. **Subscription Hooks** (`features/billing/hooks.ts`)
   - `useSubscription()` - reads subscription status from Clerk user metadata
   - `useCanEdit()` - returns true if trial active OR subscribed
   - `useTrialStatus()` - returns trial days remaining, expired status
   - `useBillingPortal()` - opens Clerk's billing portal

3. **Trial Tracking**
   - Store `trialStartedAt` timestamp on user creation (Clerk metadata or Convex)
   - Calculate trial expiration: 30 days from account creation
   - Check trial/subscription status in all mutation functions

4. **Read-Only Mode**
   - When trial expired and no subscription:
     - Disable task creation
     - Disable task completion/uncomplete
     - Disable task editing (title, notes, dates, tags, priority)
     - Disable task deletion
     - Allow viewing all existing tasks
     - Show banner prompting subscription

5. **Pricing Page** (`app/(marketing)/pricing/page.tsx`)
   - Show both plans with pricing
   - "Start Free Trial" for new users
   - "Subscribe" buttons use Clerk's checkout component

6. **Subscribe Flow**
   - "Subscribe" button in TopNav when trial expired
   - Subscription banner in app when trial expiring soon or expired
   - Clerk handles checkout and success/cancel redirects

7. **Billing Management**
   - Use Clerk's `<UserButton />` with billing portal integration
   - Show subscription status and trial days remaining in Settings

#### Testing
- New users get 30-day free trial with full access
- After 30 days, app becomes read-only
- Can complete checkout flow via Clerk
- Subscription restores full access immediately
- Subscription management via Clerk portal works
- Read-only users can still view all their tasks

---

### Phase 8: Client-Side Encryption
**Time estimate:** 1–2 days

**Goal:** Enable end-to-end encryption so sensitive data is never readable on the server.

#### Why SubtleCrypto?
- Built into all modern browsers (Web Crypto API)
- No external dependencies needed
- Hardware-accelerated where available
- Well-audited, standardized implementation

#### Deliverables

1. **Crypto Utilities** (`lib/crypto.ts`)
   - Use browser's `SubtleCrypto` API (https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
   - All encryption/decryption happens client-side only
   - No crypto libraries to install

2. **Key Derivation Options**
   Users can choose one of two methods to derive their encryption key:
   
   **Option A: Passphrase (fallback)**
   - Derive encryption key from user passphrase using PBKDF2 (`crypto.subtle.deriveKey`)
   - Generate random salt per user, store in Convex (salt is not secret)
   - PBKDF2 iterations: minimum 100,000
   
   **Option B: Passkey with PRF extension (preferred)**
   - Use WebAuthn PRF (Pseudo-Random Function) extension to derive encryption key
   - Key derived directly from passkey during authentication
   - No passphrase to remember - encryption tied to passkey
   - Requires browser + authenticator support for PRF extension
   - Supported: Chrome/Edge (hardware keys like YubiKey), expanding to platform authenticators
   - Reference: https://developers.yubico.com/WebAuthn/Concepts/PRF_Extension/

3. **Key Storage**
   - Store derived key in memory only (re-derive on page load/login)
   - **Important:** Key and passphrase never leave the browser

4. **Encryption Implementation**
   - Use AES-GCM for authenticated encryption (`crypto.subtle.encrypt`)
   - Generate random IV (12 bytes) per encryption operation
   - Store IV alongside ciphertext (prepend or separate field)
   - Encode ciphertext as base64 for database storage

5. **Encrypted Fields**
   - `title` - encrypted
   - `notesJson` - encrypted
   - `tags` - encrypted (prevents tag-based analysis)
   - Metadata (dates, status, priority) - unencrypted (for queries)

6. **Schema Updates** (`convex/schema.ts`)
   ```typescript
   tasks: defineTable({
     // Encrypted fields stored as base64 strings (IV + ciphertext)
     encryptedTitle: v.optional(v.string()),
     encryptedNotes: v.optional(v.string()),
     encryptedTags: v.optional(v.string()),
     // Keep unencrypted for queries
     title: v.optional(v.string()), // Empty when encrypted
     // ... rest unchanged
   })
   ```

7. **Encryption Toggle**
   - Setting in user preferences to enable/disable
   - Migration flow: encrypt existing tasks on enable
   - Warning: losing passphrase/passkey = losing data

8. **UI Indicators**
   - Lock icon when encryption is enabled
   - Clear messaging about encryption status
   - Key derivation method selector (passkey vs passphrase)
   - Passphrase entry on login (if using passphrase method)

#### Security Considerations
- AES-GCM provides authenticated encryption (integrity + confidentiality)
- Unique IV per encryption operation (never reuse)
- Zero-knowledge: server never sees plaintext
- Search disabled for encrypted content (trade-off for privacy)
- PBKDF2 iterations: minimum 100,000 for passphrase derivation
- PRF extension provides hardware-backed key derivation when using passkeys

#### Testing
- Data unreadable in Convex dashboard when encrypted
- Decryption works correctly after page refresh
- Wrong passphrase shows clear error
- Passkey PRF derivation works (where supported)
- Encryption/decryption performance acceptable
- Works in all major browsers (Chrome, Firefox, Safari, Edge)

---

### Phase 9: Admin Area
**Time estimate:** 1–2 days

**Goal:** Minimal admin interface for account and application management.

#### Design Principles
- **Minimal data exposure:** Show only what's needed for support
- **Privacy-first:** No ability to read user task content
- **Audit logging:** Deferred to a later phase using a dedicated logging service

#### Deliverables

1. **Clerk RBAC Setup** (using [Clerk's basic RBAC pattern](https://clerk.com/docs/guides/secure/basic-rbac))
   - **Configure session token** in Clerk Dashboard → Sessions → Customize session token:
     ```json
     { "metadata": "{{user.public_metadata}}" }
     ```
   - **Create TypeScript definitions** (`types/globals.d.ts`):
     ```typescript
     export type Roles = "admin" | "user";
     
     declare global {
       interface CustomJwtSessionClaims {
         metadata: {
           role?: Roles;
         };
       }
     }
     ```
   - **Create role helper** (`lib/roles.ts`):
     ```typescript
     import { auth } from "@clerk/nextjs/server";
     import { Roles } from "@/types/globals";
     
     export async function checkRole(role: Roles): Promise<boolean> {
       const { sessionClaims } = await auth();
       return sessionClaims?.metadata?.role === role;
     }
     ```
   - **Set admin role** via Clerk Dashboard → Users → [user] → Public metadata:
     ```json
     { "role": "admin" }
     ```

2. **Admin Routes** (`app/(admin)/`)
   - Protected via middleware using `checkRole("admin")`
   - Redirect non-admins to home page
   - Separate layout from main app

3. **Admin Dashboard** (`app/(admin)/dashboard/page.tsx`)
   - Total users (active, churned)
   - Subscription breakdown (free, monthly, yearly)
   - Tasks created (aggregate, no content)
   - Error rates / health metrics

4. **User Management** (`app/(admin)/users/page.tsx`)
   - Search users by email using Clerk Backend SDK
   - Display: email, signup date, plan, task count
   - **Never display:** task titles, notes, tags
   - Actions:
     - Grant free access / extend trial
     - Apply discount to subscription
     - Delete account and all data
     - Trigger full data export (sends to user's email)
   - **Server actions** (`app/(admin)/_actions.ts`) to update user roles via `clerkClient.users.updateUser()`

5. **Convex Functions**
   - `convex/admin.ts` - queries and internal mutations (Convex runtime)
     - `getDashboardStats` - aggregate stats only
     - `deleteUserData` - internal mutation to cascade delete user data
   - `convex/adminActions.ts` - actions using Clerk SDK (Node.js runtime)
     - `searchUsers` - search via Clerk Backend SDK
     - `setUserRole` - update user publicMetadata
     - `deleteUserAndData` - delete user from Convex and Clerk

#### Testing
- Non-admins cannot access admin routes (middleware redirect)
- `checkRole()` returns correct boolean for each role
- Convex functions verify admin role before executing
- User deletion removes all associated data
- Cannot see user task content from admin

---

### Phase 10: Telemetry (PostHog)
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

### Phase 11: Launch Prep
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

### Phase 12: Data Export (Post-Launch)
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

We are currently at **Phase 8: Client-Side Encryption**.

Phases 0–7 are complete.

### Remaining Phases

| Phase | Name | Status | Time Estimate |
|-------|------|--------|---------------|
| 7 | Billing (Clerk) | ✅ Complete | 1–2 days |
| 8 | Client-Side Encryption | Todo | 1–2 days |
| 9 | Admin Area | Todo | 1–2 days |
| 10 | Telemetry (PostHog) | Todo | 1–2 hours |
| 11 | Launch Prep | Todo | 1–2 days |

### Post-Launch Phases

| Phase | Name | Status | Time Estimate |
|-------|------|--------|---------------|
| 12 | Data Export | Todo | 2–4 hours |

### Critical Path to Launch
1. **Phase 3** - Auth (required for multi-user) ✅
2. **Phase 7** - Billing (required for revenue) ✅
3. **Phase 11** - Launch prep (legal, landing page)

### Nice-to-Have Before Launch
- Phase 8 (Telemetry) - helps understand usage
- Phase 9 (Encryption) - differentiator for privacy-conscious users
