# New UX Specification

This document specifies a foundational UX change: replacing the sidebar navigation with a command bar and streamlining the task UI.

---

## Phase 1: Command Bar

### Overview

Replace the sidebar and top bar actions with a command bar triggered by `Cmd+K` or clicking an input in the top bar.

### Command Bar Trigger

- **Top bar**: Contains only a single input that triggers the command bar when clicked
- **Input appearance**: Styled to look like the command bar, displays `⌘K` hint
- **No border**: Remove visual separation between top bar and task list
- **Height**: Keep current top bar height; input should be prominent for discoverability

### Command Bar Behavior

| Behavior | Specification |
|----------|---------------|
| Trigger | `Cmd+K` globally, or click top bar input |
| Initial state | Always starts fresh (no remembered query) |
| Fuzzy matching | Not implemented in initial version |
| Backdrop | Float without dimming/blocking underlying content |
| Width | Full viewport on mobile, max-width 500px centered on desktop |
| Position on mobile | Top of viewport to leave room for commands below virtual keyboard |
| Close | `Escape` closes command bar entirely |

### Available Commands

**Navigation:**
- Go to tasks
- Go to completed tasks
- Go to settings

**Actions:**
- Create task
- Search (transforms command bar into search input)
- Clear search / Stop filtering (only visible when search is active)
- Filter by tag (shows submenu of available tags)
- Reschedule to tomorrow (only when a task is focused)
- Logout

**Keybindings shown in command list** for discoverability.

### Search Mode

| Behavior | Specification |
|----------|---------------|
| Activation | Select "Search" command |
| Input | Command bar transforms into search input |
| Filtering | Debounced live search (no backdrop blur so results visible while typing) |
| Scope | Searches plaintext title and notes fields (not tags) |
| Persistence | Search persists across navigation via URL query parameter |
| Exit search mode | Press `Enter` closes command bar; search remains active |
| Re-entering search | Selecting "Search" again shows previous search query |
| Clearing | Use "Clear search" command to remove active search |
| Empty results | Show empty list (no message) |

### Global Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command bar |
| `g t` | Go to tasks |
| `g c` | Go to completed tasks |
| `g s` | Go to settings |

### Migrated Sidebar Content

All existing sidebar functionality moves to command bar:
- Navigation links → Navigation commands
- Settings link → "Go to settings" command
- User info/logout → "Logout" command

---

## Phase 2: Streamlined Task UX

### Task List Display

#### Desktop Layout (single line, ~65-70% for title)

```
[checkbox] [title...........................] [tags] [quick actions]
```

- Title gets ~65-70% of row width
- Long titles wrap to new line (row grows)
- Many tags wrap to multiple lines
- Checkbox in top-left, just left of title

#### Mobile Layout (multi-line)

```
[checkbox] [title...........................]
[tags.......................................]
[quick actions..............................]
```

#### Quick Actions (always visible)

- Reschedule to tomorrow
- Reschedule (calendar picker, existing approach)
- Filter by tag (click a tag)

### Task List Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` / `k` | Move focus to previous task |
| `↓` / `j` | Move focus to next task |
| `Enter` / `e` | Open task detail page |
| `c` | Complete/uncomplete task |
| `r` | Open reschedule calendar picker |
| `p` | Open priority picker (reuse command bar UI) |

**Focus behavior:**
- Visual indicator: Outline
- Only active when focus is on task list (not when typing in inputs)
- Focus persists when returning from task detail page

### Priority Levels

Highest → High → Medium → Normal → Low → Lowest

### Task Detail Page

#### Route

- Real URL: `/tasks/[id]` (shareable, bookmarkable)
- 404 page if task doesn't exist or was deleted

#### Layout

- Constrained max-width for readability (prose width, ~700-800px)
- Close button to return to task list

#### Editable Fields

- Title
- Tags (new pill-based UI)
- Scheduled date (date picker)
- Notes (existing markdown editor, unchanged)

#### Navigation

- Previous/Next task buttons based on task list order
- Cross-day and cross-week navigation allowed
- Buttons disabled at list boundaries (no wrapping)
- Browser back button works (no animation required for browser back)

#### Auto-save

- All changes auto-saved via Convex with debounce
- No save indicator; everything considered saved

### Tags UI (Detail Page)

#### Display
- Tags shown as pills with `×` remove button

#### Adding Tags
- Input with autocomplete for existing tags
- Autocomplete source: All tags ever used (extracted client-side from current week's tasks when encryption enabled)
- Tag format: Comma-separated string field, commas not allowed in tag names, whitespace trimmed
- Press `Enter` to create tag (transforms to pill, clears input)
- Case-sensitive matching

### Animations / View Transitions

| Transition | Specification |
|------------|---------------|
| Open task detail | Task appears to expand to fill page |
| Close task detail | Task appears to contract back to list item |
| Direct URL navigation | Same animation (no special case) |
| Duration | 150-200ms (snappy) |
| Fallback | CSS/JS animation if View Transitions API unsupported |
| Reduced motion | Skip animations if `prefers-reduced-motion` enabled |

### Task Creation (via Command Bar)

| Behavior | Specification |
|----------|---------------|
| Placement | Bottom of current day's list |
| Default scheduled date | Today (timezone-aware) |
| Inputs | Title input, then tab to tags input |
| Cancel | Click away or `Escape` without title → auto-delete empty task |
| Alternative | Modal acceptable if inline too complex, but prefer inline |

### Week Navigation

- Existing `< Week 3 >` UI preserved
- Position: Above task list, below command bar input
- Today indicator: Different color on current day's section header (existing behavior)

### Error Handling

- Failed operations show toast notification

---

## Scope Clarifications

### Included
- All changes described above
- Keyboard shortcuts documentation for public help pages

### Explicitly Unchanged
- Completed tasks showing inline with same week's tasks
- Notes markdown editor
- Search functionality (behavior unchanged, only UI trigger changes)
- Dark mode (not supported)

### Deferred / Out of Scope
- Backlog removal (separate work)
- Accessibility audit (separate work)
- Conflict resolution for concurrent edits (Convex handles)
- Loading state indicators (rely on Convex optimistic updates)

---

## Implementation Notes

### Phase Independence

Phases 1 and 2 can be implemented in parallel; no dependencies between them.

### Deployment

Ship directly, no feature flags or transition period.

### Testing Considerations

- Animation duration (150-200ms) may need tweaking during testing
- Command bar max-width (500px) may need adjustment
- Verify timezone handling for new task creation
