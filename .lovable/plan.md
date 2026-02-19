

# Implementation Plan: Missing Admin Pages, Security Hardening, and Audit Logging

This plan addresses all gaps found in the system audit, organized into 3 sequential steps.

---

## Step 1: Security Hardening (Critical Priority)

### 1A. Lock Down Public Admin Routes

The routes `/create-admin` and `/admin-setup` are currently accessible to anyone. They will be wrapped in `SuperAdminGuard` so only authenticated super admins can reach them.

**Files changed:**
- `src/components/app/routes/publicRoutes.tsx` -- move `/create-admin` and `/admin-setup` routes out of public routes
- `src/components/app/routes/adminRoutes.tsx` -- add them here, wrapped in `SuperAdminGuard`

### 1B. Create a Secure Admin Actions Edge Function

Currently admin write operations (delete user, unblock, etc.) use the anon client which relies solely on RLS. A new edge function `admin-actions` will:
- Verify the caller's JWT via `getClaims()`
- Confirm the caller has `super_admin` role using a service-role query
- Execute the requested action with the service-role client
- Write an entry to `admin_audit_log` for every mutation

**Files created:**
- `supabase/functions/admin-actions/index.ts`

**Supported actions (initial set):** `delete_user`, `unblock_user`, `update_profile`, `toggle_flag`, `delete_content`

### 1C. Add Consistent Audit Logging

A helper utility will be added so every admin page that performs a mutation logs it via the new edge function.

**Files created:**
- `src/utils/admin/auditLogger.ts` -- a thin wrapper: `logAdminAction(actionType, tableName, recordId, changes)`

---

## Step 2: Missing Admin Management Pages (7 New Pages)

Each page follows the existing pattern (see `BlockedUsersPage.tsx`): dark theme Card layout, search, table with actions, `useTranslations()` for all strings.

| Page | Route | DB Table | Key Features |
|------|-------|----------|--------------|
| **StoriesPage** | `/super-admin/stories` | `stories` | View/delete stories, filter by user, see media preview |
| **CallsPage** | `/super-admin/calls` | `calls` | View call logs, filter by type/status, duration stats |
| **DateProposalsPage** | `/super-admin/date-proposals` | `date_proposals` | View proposals, filter by status, admin can cancel |
| **MarriageIntentionsPage** | `/super-admin/marriage-intentions` | `marriage_intentions` | View intentions, filter by timeline, toggle visibility |
| **SafetyFlagsPage** | `/super-admin/safety-flags` | `message_safety_flags` | HIGH PRIORITY -- review flagged messages, mark reviewed, take action |
| **ScheduledContentPage** | `/super-admin/scheduled-content` | `scheduled_content` | View/delete scheduled posts, filter by published status |
| **ProfileViewsPage** | `/super-admin/profile-views` | `profile_section_views` | Analytics view of profile engagement, top viewed sections |

**Files created (7):**
- `src/pages/SuperAdmin/pages/StoriesPage.tsx`
- `src/pages/SuperAdmin/pages/CallsPage.tsx`
- `src/pages/SuperAdmin/pages/DateProposalsPage.tsx`
- `src/pages/SuperAdmin/pages/MarriageIntentionsPage.tsx`
- `src/pages/SuperAdmin/pages/SafetyFlagsPage.tsx`
- `src/pages/SuperAdmin/pages/ScheduledContentPage.tsx`
- `src/pages/SuperAdmin/pages/ProfileViewsPage.tsx`

**Files modified:**
- `src/pages/SuperAdmin/index.tsx` -- add 7 new route entries
- `src/pages/SuperAdmin/SuperAdminLayout.tsx` -- add 7 new sidebar nav items

**Database migration:**
- INSERT ~70 translation keys (7 pages x ~10 keys x 1 row per language, 5 languages = ~350 rows) into `translations` table

---

## Step 3: Admin Profile Editor and Wiring Everything Together

### 3A. Admin Profile Editor

Add a detailed profile editing capability to the existing `UsersPage` -- an "Edit Profile" dialog that lets admins update:
- Bio, occupation, location (from `profiles`)
- Detailed fields from `profile_details` (height, education, religion, etc.)
- Preference fields from `profile_preferences`

All mutations go through the `admin-actions` edge function (Step 1B) with full audit logging.

**Files created:**
- `src/pages/SuperAdmin/components/users/AdminProfileEditor.tsx`

**Files modified:**
- `src/pages/SuperAdmin/pages/UsersPage.tsx` -- add "Edit" button per row that opens the editor

### 3B. Wire All Existing Admin Pages to Use Audit Logging

Update the following existing pages to route their mutations through `admin-actions` (or at minimum call `logAdminAction`):
- `BlockedUsersPage.tsx` (unblock)
- `GroupsManagementPage.tsx` (delete group)
- `VirtualGiftsPage.tsx` (toggle gift)
- `GhostUsersPage.tsx` (create/delete ghost)
- `ModerationPage.tsx` (approve/reject)

### 3C. Deploy and Insert Translations

- Deploy the `admin-actions` edge function
- Insert all translation entries for the 7 new pages + profile editor strings

---

## Technical Details

### Edge Function: `admin-actions` (Step 1B)

```text
POST /admin-actions
Body: { action, table, recordId, data }

Flow:
  1. Verify JWT via getClaims()
  2. Query user_roles with service-role client to confirm super_admin
  3. Execute the action (delete/update/insert) with service-role client
  4. Insert row into admin_audit_log
  5. Return result
```

### Config update: `supabase/config.toml`
```text
[functions.admin-actions]
verify_jwt = false
```

### New Sidebar Items (added to menuItems array)

```text
Stories         -> /super-admin/stories         (BookOpen icon)
Calls           -> /super-admin/calls           (Phone icon)
Date Proposals  -> /super-admin/date-proposals  (CalendarHeart icon)
Marriage Intent -> /super-admin/marriage-intentions (Heart icon)
Safety Flags    -> /super-admin/safety-flags    (AlertTriangle icon)
Scheduled       -> /super-admin/scheduled-content (Clock icon)
Profile Views   -> /super-admin/profile-views   (Eye icon)
```

### Estimated scope
- Step 1: ~4 files created/modified (security-critical, do first)
- Step 2: ~10 files created/modified + 1 DB migration
- Step 3: ~7 files created/modified + 1 DB migration

