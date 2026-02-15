

# Final Pre-Launch Audit -- Comprehensive Plan

## Overview

A line-by-line audit of the entire app has been completed. Below are all remaining issues grouped by severity, followed by the implementation steps.

---

## Category 1: Critical -- Broken Pages & Dead Code

### 1.1 `UserProfile.tsx` is a Hardcoded Mock Page
- **Route**: `/user/:id`
- **Problem**: This page contains entirely fake hardcoded data (name "Alex", location "San Francisco"), uses `tinder-rose` / `tinder-orange` / `bg-gray-50` colors (completely off-brand), and says "Dating Profile App" in the footer. It is NOT connected to any database.
- **Impact**: If any user ever lands on this URL, they see a fake profile with Tinder branding. No code currently links to it, but it is still a live route.
- **Fix**: Delete `UserProfile.tsx` and remove the `/user/:id` route from `protectedRoutes.tsx`.

### 1.2 `Discovery.tsx` Has Dead Navigation Links
- **Route**: Not actively routed (replaced by `DiscoveryFeed.tsx`)
- **Problem**: The tabs inside navigate to `/discovery/hashtags`, `/discovery/trending`, `/discovery/groups` -- none of which exist. This page also imports ~15 components.
- **Impact**: Dead code bloat. If imported elsewhere by mistake, users hit 404.
- **Fix**: Delete `Discovery.tsx` (it is not imported anywhere).

### 1.3 `AdminDashboard.tsx` is Unused
- **Problem**: Not imported or routed anywhere. Admin uses the SuperAdmin system.
- **Fix**: Delete `AdminDashboard.tsx`.

---

## Category 2: Broken Links & Wrong Routes

### 2.1 `Footer.tsx` Links to `/privacy` Instead of `/privacy-policy`
- **File**: `src/components/landing/Footer.tsx` line 32
- **Problem**: Links to `/privacy` which does not exist. The correct route is `/privacy-policy`.
- **Fix**: Change `to="/privacy"` to `to="/privacy-policy"`.

### 2.2 `Footer.tsx` Uses Raw Gray Colors
- **File**: `src/components/landing/Footer.tsx`
- **Problem**: Uses `text-gray-500`, `text-gray-800`, `bg-black/60` instead of theme variables.
- **Fix**: Update to use `text-muted-foreground`, `border-border`, `bg-card/30`.

---

## Category 3: Security -- Console Logging Sensitive Data

### 3.1 `Auth.tsx` Logs User Email to Console
- **File**: `src/pages/Auth.tsx` line 62
- **Code**: `console.log('Attempting to sign in with: ${email}')`
- **Problem**: Logs the user's email address in production (even though `main.tsx` suppresses `console.log` in prod, this is still bad practice and a security risk if the suppression is ever removed).
- **Fix**: Remove this log and the other debug console.logs in Auth.tsx.

### 3.2 `HashtagFeed.tsx` Has Placeholder Like/Comment Handlers
- **File**: `src/pages/HashtagFeed.tsx` lines 35-43
- **Problem**: `handleLike` and `handleComment` just do `console.log` and don't actually work. Users tapping Like on a hashtag feed post see nothing happen.
- **Fix**: Implement proper like/comment handlers (reuse `likePost`/`unlikePost` from the API and navigate to post detail for comments).

---

## Category 4: Design Inconsistencies (Off-Theme Pages)

### 4.1 `EventDetail.tsx` Uses Raw White Classes
- Uses `bg-white/10`, `border-white/20`, `text-white` in header/cards instead of theme variables.
- **Fix**: Replace with `bg-card/50`, `border-border/20`, `text-foreground`.

### 4.2 `Messages.tsx` Uses Raw Colors Extensively
- Uses `bg-white/10`, `bg-white/15`, `bg-blue-500`, `text-blue-300` throughout.
- This is a large file (1000+ lines) and is the most complex page. These are functional but aesthetically inconsistent.
- **Fix**: Update key color classes to theme variables in Messages.tsx.

### 4.3 `ErrorBoundary.tsx` Uses Non-Existent Custom Classes
- Uses `bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary` -- `primary-dark` likely does not exist in the theme.
- **Fix**: Replace with `bg-background`.

---

## Category 5: Console Logs Cleanup

Multiple pages have `console.log` statements that leak in development and clutter debugging:
- `Profile.tsx`: 3 console.logs about location state
- `ViewedMe.tsx`: console.log for plan selection  
- `Messages.tsx`: console.logs for realtime events
- `Auth.tsx`: 5 console.logs

**Fix**: Remove all non-error console statements from user-facing pages. Keep `console.error` only.

---

## Category 6: Minor Functional Issues

### 6.1 `main.tsx` Has Duplicate QueryClient + Unused Import
- `main.tsx` creates a `QueryClient` but `App.tsx` also creates one. Double wrapping.
- `main.tsx` imports `useSupabaseAuth` but never uses it.
- **Fix**: Remove `QueryClient` and the unused import from `main.tsx` (App.tsx already handles both).

---

## Implementation Plan (Ordered by Priority)

### Step 1: Delete Dead Pages & Routes
- Delete `src/pages/UserProfile.tsx`
- Delete `src/pages/Discovery.tsx`  
- Delete `src/pages/AdminDashboard.tsx`
- Remove `/user/:id` route from `protectedRoutes.tsx`

### Step 2: Fix Footer.tsx
- Change `/privacy` link to `/privacy-policy`
- Replace raw gray/black colors with theme variables

### Step 3: Fix HashtagFeed.tsx Like/Comment
- Replace `console.log` stubs with real `likePost`/`unlikePost` calls
- Navigate to `/post/:id` on comment click

### Step 4: Fix ErrorBoundary.tsx
- Replace `from-primary-dark` with `bg-background`

### Step 5: Fix Auth.tsx Security
- Remove `console.log` that exposes user email
- Remove other debug console.logs

### Step 6: Clean Up Console Logs
- Remove all `console.log` from `Profile.tsx`, `ViewedMe.tsx`, `Messages.tsx`

### Step 7: Fix main.tsx Duplicate Provider
- Remove `QueryClient`, `QueryClientProvider`, and unused `useSupabaseAuth` import from `main.tsx`

### Step 8: Design Touch-Up on EventDetail.tsx
- Replace `bg-white/10` and `text-white` in header with theme variables

### Step 9: Design Touch-Up on Messages.tsx
- Replace key `bg-white/*` and `text-blue-*` classes with theme equivalents

---

## Technical Details

### Files to delete (3):
- `src/pages/UserProfile.tsx`
- `src/pages/Discovery.tsx`
- `src/pages/AdminDashboard.tsx`

### Files to modify (8):
1. `src/components/app/routes/protectedRoutes.tsx` -- remove UserProfile route + import
2. `src/components/landing/Footer.tsx` -- fix link + theme colors
3. `src/pages/HashtagFeed.tsx` -- implement real like/comment
4. `src/components/ErrorBoundary.tsx` -- fix background class
5. `src/pages/Auth.tsx` -- remove sensitive console.logs
6. `src/pages/Profile.tsx` -- remove debug console.logs
7. `src/main.tsx` -- remove duplicate QueryClient + unused import
8. `src/pages/EventDetail.tsx` -- theme consistency
9. `src/pages/Messages.tsx` -- theme consistency (key areas only)
10. `src/pages/ViewedMe.tsx` -- remove console.log

### Estimated scope: ~10 files modified, 3 files deleted

