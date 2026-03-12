

# P1 Security Fixes - Continued Hardening

## Remaining Vulnerabilities Found

### 1. Remaining `profiles.select('*')` - PII Leakage (3 locations)

| File | Line | Risk |
|------|------|------|
| `src/pages/Profile.tsx` | 49 | Exposes phone/GPS of **other users** to any visitor |
| `src/components/settings/PushNotificationPreferences.tsx` | 39 | Own profile - acceptable but should use `ALL_OWN_PROFILE_COLUMNS` |
| `src/api/accountActions.ts` | 9 | Own profile data export - acceptable but should use `ALL_OWN_PROFILE_COLUMNS` |

**Profile.tsx is critical** - it fetches another user's profile with `select('*')`, leaking PII.

### 2. Remaining `getSession()` instead of `getUser()` (8 locations)

These use cached session data instead of server-verified tokens:

| File | Function |
|------|----------|
| `src/hooks/useSwipeHistory.ts` | rewind logic |
| `src/contexts/SubscriptionContext.tsx` | checkSubscription |
| `src/hooks/useProfileAccess.ts` | checkMatch |
| `src/hooks/useProfileVisibility.ts` | 4 functions (fetch, toggle, blur, share) |
| `src/components/my-profile/PrivacySettings.tsx` | 2 functions |
| `src/api/reports.ts` | createReport |
| `src/pages/SuperAdmin/components/users/hooks/useUserDelete.ts` | confirmDeleteUser |
| `src/pages/SuperAdmin/components/users/hooks/useBulkUserDelete.ts` | confirmDeleteAllUsers |

### 3. Input Validation Missing

- **`src/api/reports.ts`**: `reason` and `details` fields have no length validation or sanitization - potential XSS/injection via report content.
- **`src/api/accountActions.ts`**: `downloadUserData` uses `select('*')` on messages, matches, likes - could return massive datasets with no pagination.

## Implementation Plan

### Step 1: Fix Profile.tsx PII Leak
Replace `select('*')` with `select(SAFE_PROFILE_COLUMNS)` for viewing other users' profiles. Use `ALL_OWN_PROFILE_COLUMNS` for own-profile queries.

### Step 2: Replace all remaining `getSession()` with `getUser()`
Systematically update all 8 files to use `supabase.auth.getUser()` for server-side token verification.

### Step 3: Add input validation to reports API
Add length limits and sanitization to `createReport` (reason max 200 chars, details max 2000 chars).

### Step 4: Fix accountActions data export
- Use `ALL_OWN_PROFILE_COLUMNS` for own profile export
- Add row limits to messages/matches/likes queries to prevent memory exhaustion

**Files to modify**: 10 files across API layer, hooks, and components.

