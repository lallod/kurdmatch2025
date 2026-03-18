

# Full System Scan: What Remains Before Launch

## Executive Summary
The app is feature-rich with 50+ user pages, 48 admin pages, 28 edge functions, and full i18n support. However, several areas need attention across design consistency, incomplete admin features, security remnants, and UX polish. This plan covers everything found from scanning all angles.

---

## A. CRITICAL FIXES (Must do)

### 1. Admin Bottom Nav Still Replaces Profile
**Problem**: In `BottomNavigation.tsx` line 33, admins get Shield icon → `/super-admin` instead of Profile. Admins cannot access their own profile from the nav.
**Fix**: Add a 6th nav item for admin (Shield icon) only when `isAdmin=true`, keep Profile as the 5th item always.

### 2. Ghost User Generator Still in Client Bundle
**Problem**: `src/utils/ghostUserGenerator.ts` (332 lines) with fake names, bios, photos is bundled in production. Only used by `GhostUsersPage.tsx` (admin-only) but the code is in the client bundle for all users.
**Fix**: Move ghost generation logic to an edge function. The admin page should call the edge function instead of client-side generation with service role access.

### 3. Remaining `select('*')` in API Files
**Problem**: 80 instances across `api/` files — `hashtags.ts`, `notifications.ts`, `dashboard.ts`, `reactions.ts`, `gifts.ts`, `moderation.ts`, `swipes.ts`. Non-profile tables but bad practice.
**Fix**: Replace with explicit columns in each file.

### 4. `getMatches()` Has No Pagination
**Problem**: `api/matches.ts` fetches ALL matches with no `.limit()`. Will break at scale.
**Fix**: Add `.limit(50)` and pagination support.

---

## B. INCOMPLETE ADMIN FEATURES (Placeholder content found)

### 5. Email Campaigns Tabs Are Empty Placeholders
**Problem**: `EmailCampaignsPage.tsx` lines 437-474 — Active, Scheduled, Paused, Draft tabs all show placeholder text like "Active campaigns content will appear here." No actual campaign data is loaded.
**Fix**: Either implement the campaign list with real data from a `campaigns` table, or remove the tabs and show a "Coming Soon" card to avoid appearing broken.

### 6. Bulk Actions Download Template Button Does Nothing
**Problem**: `BulkActionsPage.tsx` line 712 — "Download Template" button has no `onClick` handler.
**Fix**: Generate and download a CSV template, or disable the button with a tooltip.

### 7. Social Login Page Stores Secrets in DB
**Problem**: `SocialLoginPage.tsx` stores OAuth client_id/client_secret in a `social_login_providers` table. This doesn't actually configure Supabase Auth providers — it's a UI-only feature that gives a false sense of control.
**Fix**: Add a clear note explaining these settings must be configured in Supabase Dashboard, or connect to Supabase Management API.

---

## C. DESIGN & UX IMPROVEMENTS

### 8. Inconsistent Header Heights Across Pages
**Problem**: Headers vary: DiscoverHub uses `h-14`, Settings uses `h-11`, DiscoveryFeed uses custom padding. This creates visual jumps during navigation.
**Fix**: Standardize all page headers to `h-12` or `h-14` with consistent padding.

### 9. Discover Hub