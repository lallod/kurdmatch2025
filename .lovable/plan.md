

# Settings Page + Full Route Audit Fix

## Problem 1: Settings icon leads nowhere
The MyProfile page has a Settings (gear) icon in the header that navigates to `/settings`, but there is **no `/settings` route** in AppRoutes.tsx. The `AccountSettings` component exists at `src/components/my-profile/AccountSettings.tsx` but is never mounted on a route. Same issue from PhoneVerification page ("Back to Settings" button).

## Problem 2: Missing routes for existing pages
A full scan reveals these pages exist as files but have **no routes** registered:

| Page file | Expected route | Who links to it |
|-----------|---------------|-----------------|
| `Matches.tsx` | `/matches` | `ProfileSwipeActions` ("View matches") |
| `Events.tsx` | `/events` | (accessible but no route) |
| `Subscription.tsx` | `/subscription` | Already has route |

## Fix

### 1. Create a Settings page (`src/pages/Settings.tsx`)
- A simple wrapper page that renders the existing `AccountSettings` component
- Include a frosted-glass header with back button and "Settings" title (matching native design system)
- Scrollable content with bottom nav padding

### 2. Register missing routes in `AppRoutes.tsx`
Add these protected routes:
- `/settings` -- renders new Settings page
- `/matches` -- renders existing Matches page
- `/events` -- renders existing Events page

Also add the missing imports for `Matches`, `Events`, and the new `Settings` page.

### 3. Add `/settings` to AppLayout hidden nav list
The Settings page should NOT show in `HIDDEN_NAV_ROUTES` -- it should keep the bottom nav visible since users need to navigate back.

---

## Technical Details

### New file: `src/pages/Settings.tsx`
- Import and render `AccountSettings` from `@/components/my-profile/AccountSettings`
- Add a sticky header with back arrow and "Settings" title
- Use `pb-24` for bottom nav spacing

### Edit: `src/components/app/AppRoutes.tsx`
- Add imports: `Matches`, `Events`, `Settings`
- Add 3 new `<Route>` entries inside the protected routes section:
  - `path="/settings"` -> `<Settings />`
  - `path="/matches"` -> `<Matches />`  
  - `path="/events"` -> `<Events />`

### No other changes needed
- The Settings icon on MyProfile already navigates to `/settings` (line 211)
- PhoneVerification "Back to Settings" already navigates to `/settings` (line 64)
- Both will work once the route exists

