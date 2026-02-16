
# QA Report: KurdMatch -- Release Readiness Assessment

## A) Release Readiness: NOT READY

The app has several P0/P1 issues that must be fixed before App Store submission. The most critical are: unprotected admin routes, excessive debug logging in production, security policy weaknesses, and inconsistent error handling.

---

## B) Critical Technical Issues (P0/P1)

### P0-1: Super Admin Routes Have No Authentication Guard
The `/super-admin/*` route in `adminRoutes.tsx` has NO `ProtectedRoute` wrapper and NO role check. Any user (or unauthenticated visitor) can navigate to `/super-admin` and access the full admin panel with 40+ admin pages (users, payments, moderation, API keys, etc.). This is a severe security vulnerability.
- **File**: `src/components/app/routes/adminRoutes.tsx`
- **Fix**: Wrap the super-admin route in a dedicated `SuperAdminGuard` component that checks both authentication and `user_roles` for `super_admin` role.

### P0-2: RLS Disabled on Public Tables
The Supabase linter reports `ERROR: RLS Disabled in Public` -- at least one table has no Row Level Security enabled. This means any user with the anon key can read/write all data in that table.
- **Fix**: Identify the table(s) and enable RLS + create appropriate policies.

### P0-3: Overly Permissive RLS Policies (USING true)
The linter flags two `RLS Policy Always True` warnings for UPDATE/DELETE/INSERT operations. This effectively bypasses access control.
- **Fix**: Audit and tighten these policies to scope operations to the authenticated user.

### P1-1: Story Reactions Fail for Non-Owners
In `StoriesView.tsx`, `handleReaction()` calls `.update({ reactions })` on the `stories` table. Only the owner has UPDATE permission (via the "Users can update their own stories" policy). Non-owner reactions will silently fail.
- **Fix**: Use a separate `story_reactions` table or an RPC function with `SECURITY DEFINER`.

### P1-2: Admin Navigation Link Goes to Non-Existent Route
In `BottomNavigation.tsx`, the admin nav item links to `/admin/dashboard`, but `adminRoutes.tsx` redirects `/admin/*` to `/super-admin`. The super admin layout then has its own routing starting at `/super-admin/` (root = Dashboard). The user will land on the dashboard, but via a redirect chain -- this is fragile and could flash a 404.
- **Fix**: Link directly to `/super-admin`.

### P1-3: `handleNext` Closure Bug in Story Timer
In `StoriesView.tsx`, the `useEffect` timer (line 72-82) calls `handleNext` inside `setProgress`. But `handleNext` is in the dependency array of the effect and is recreated on every render due to its `useCallback` dependencies (`currentIndex`, `stories`, `user`). This creates a new interval every time state changes, causing potential double-advances and flickering.
- **Fix**: Use a ref for `handleNext` or restructure the timer to avoid this dependency cycle.

---

## C) UX Problems

### P2-1: Debug Logging Visible to Users
Over 100 `console.log` statements exist in auth/registration code (e.g., "Form values changed", "Submit button clicked", step completion details). Users opening DevTools will see form data, emails, and internal state printed to the console. This is unprofessional and a minor privacy concern.
- **Fix**: Remove all debug `console.log` statements or gate them behind a `DEV` flag.

### P2-2: Hardcoded English Strings
Multiple pages have hardcoded English text not wrapped in `t()`:
- `NotFound.tsx`: "This page doesn't exist", "Back to Home"
- `StoriesView.tsx`: "No stories available", "Go Back", "Reply to story...", "Story deleted", "Reply sent!", "Failed to load stories"
- `Subscription.tsx`: "Current Plan", "Refresh", "Manage"
- `ErrorBoundary.tsx`: "Something went wrong", "Refresh Page"
- **Impact**: Kurdish/RTL users see English fragments.

### P2-3: No Confirmation Dialog for Story Deletion
`handleDelete` in `StoriesView.tsx` deletes immediately on button press with no confirmation. A misclick permanently removes content.

### P2-4: "Forgot Password" Without Email Shows Generic Error
On the Auth page, clicking "Forgot password?" with an empty email field shows a toast error, but it could be more helpful (e.g., highlight the email input).

### P3-1: Register Page Back Button Uses `absolute` Positioning
The "Back to Home" button in `Register.tsx` (line 16) uses `absolute top-4 left-4` which can overlap with content or be cut off by safe-area insets, since it's outside the safe-area padding flow.

---

## D) Architecture/Code Problems

### D-1: Massive Use of `as any` Type Assertions (303 matches in 34 files)
The codebase heavily bypasses TypeScript's type system. This indicates the Supabase types are out of sync with the actual schema (tables like `stories`, `story_views`, `reports` not in generated types). This makes refactoring dangerous and hides real bugs.
- **Fix**: Regenerate Supabase types and reduce `as any` usage.

### D-2: Duplicated `PageLoader` Component
The same `PageLoader` component (Loader2 spinner centered on screen) is defined identically in 5 separate route files. Should be a shared component.

### D-3: `ProfileCompletionGuard` is Defined But Never Used
`src/components/app/ProfileCompletionGuard.tsx` and `RegisterProtection.tsx` exist but are not referenced in any route. Users with incomplete profiles can access all protected routes.

### D-4: Inconsistent Auth Hook Usage
Both `useSupabaseAuth` and `useAuth` are exported from `auth.tsx` as aliases. Some files use one, some the other (e.g., `Swipe.tsx` imports `useSupabaseAuth as useAuth`). This creates confusion.

### D-5: `DiscoveryFeed.tsx` Fetches User ID Separately
Line 72-78 calls `supabase.auth.getUser()` to get `currentUserId`, even though `useSupabaseAuth()` is available and already used elsewhere. Redundant API call.

### D-6: Story Reply Bypasses Messaging Architecture
`handleReply` in `StoriesView.tsx` directly inserts into the `messages` table, which may not trigger realtime updates or respect any message validation/filtering logic that the main chat system uses.

---

## E) Potential Future Risks

### E-1: No Rate Limiting on Client-Side Actions
Likes, reactions, story views, replies -- all fire directly from the client with no throttling. A user could spam reactions or likes rapidly.

### E-2: No Pagination on Posts Feed
`getPosts()` fetches all posts. As the user base grows, this will hit the 1000-row Supabase limit and become slow.

### E-3: WebRTC Call Infrastructure
`useWebRTC` is integrated in Messages but there is no TURN/STUN server configuration visible. Video calls will fail behind NATs/firewalls in production.

### E-4: Story Timer Memory Leak Risk
The `setInterval` in `StoriesView.tsx` clears on unmount, but if `handleNext` navigates away before cleanup, there could be a state update on an unmounted component.

### E-5: OAuth Registration Flow Relies on `sessionStorage`
The `oauth_registration_flow` flag in `sessionStorage` is fragile -- it won't survive browser crashes or tab closures, potentially leaving OAuth users in a broken state.

---

## F) Recommended Fixes (Priority Order)

1. **Immediately secure admin routes** -- add auth + role guard to `/super-admin/*` (P0)
2. **Enable RLS on all public tables** and tighten permissive policies (P0)
3. **Fix story reaction permissions** -- move to separate table or use RPC (P1)
4. **Remove all debug console.log** from auth/registration code (P2)
5. **Fix story timer closure bug** to prevent double-advance (P1)
6. **Wrap all user-facing strings** in `t()` translation function (P2)
7. **Add delete confirmation** for stories (P2)
8. **Regenerate Supabase types** and reduce `as any` usage (ongoing)
9. **Extract shared `PageLoader`** component (P3)
10. **Add pagination** to post feeds (future risk)

---

## Technical Details Summary

| Category | Count |
|----------|-------|
| Total pages | 50 |
| Total route files | 5 |
| Protected routes | 30+ |
| Unprotected admin routes | 1 (critical) |
| `as any` type assertions | 303 |
| Debug console.log in auth | 118 |
| Hardcoded English strings | 20+ |
| Unused guard components | 2 |
| RLS issues (linter) | 3 |
