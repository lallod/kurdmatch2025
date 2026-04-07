
# Final Fix-All Plan: KurdMatch

Everything that remains, in one batch. After this, there should be nothing left to fix.

---

## What This Covers

All remaining issues from security scans, linter warnings, design inconsistencies, dead code, placeholder admin features, missing empty states, and console.log cleanup. Organized into 8 work blocks.

---

## Block 1: Security — Profile Visibility Enforcement
**Issue**: `profile_details` and `profile_preferences` RLS policies ignore `profile_visibility_settings`. Any authenticated user can read all fields.

**Fix**: Create a database migration that:
- Adds a SECURITY DEFINER function `get_visible_profile_details(target_user_id UUID)` that joins `profile_details` with `profile_visibility_settings` and returns only visible fields
- Updates the SELECT policy on `profile_details` to restrict non-owner reads through this function, or keeps the policy but documents that the frontend already filters visibility (lower risk approach)

**Realistic approach**: Since RLS can't conditionally hide columns, add a database view `public.visible_profile_details` with `security_invoker = true` that joins the two tables and nulls hidden fields. Frontend queries the view instead of the raw table.

---

## Block 2: Security — Extension in Public Schema
**Issue**: Linter warns about extensions in `public` schema.

**Fix**: Migration to move extensions to `extensions` schema:
```sql
ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
ALTER EXTENSION "postgis" SET SCHEMA extensions;
```

---

## Block 3: SuperAdmin Layout — Design System Migration
**Issue**: `SuperAdminLayout.tsx` uses 12 hardcoded colors (`bg-[#0a0a0a]`, `bg-[#0f0f0f]`, `text-white/60`, `from-red-500 to-orange-500`, etc.) instead of design system variables.

**Fix**: Replace all hardcoded colors:
- `bg-[#0a0a0a]` → `bg-background`
- `bg-[#0f0f0f]` → `bg-card`
- `text-white/60` → `text-muted-foreground`
- `text-white` → `text-foreground`
- `border-white/5` → `border-border`
- `from-red-500 to-orange-500` → `from-primary to-accent`
- `bg-white/5` → `bg-muted`
- `text-red-500` (active) → `text-primary`
- Loading screen: `from-gray-50 to-gray-100` → `from-background to-card`

---

## Block 4: Console.log Cleanup
**Issue**: 542 instances of `console.log` across 33 files. While suppressed in production via `main.tsx`, this is dead code weight.

**Fix**: Remove all `console.log` statements from these non-utility files:
- `src/hooks/useEmailValidation.ts` (7 instances)
- `src/utils/valueMapping.ts` (5 instances)
- `src/components/stories/StoryViewer.tsx` (1 instance)
- `src/components/language-selector/LanguageTabPanel.tsx` (1 instance)
- `src/pages/SuperAdmin/SuperAdminLayout.tsx` (1 instance)
- `src/pages/SuperAdmin/hooks/useAdminPhotos.ts` (1 instance)

Leave `console.error` statements intact (those are useful). Leave generator files as-is (admin-only code).

---

## Block 5: Empty States for Key Pages
**Issue**: Matches, Messages, and LikedMe pages show only loading spinners for new users with zero data. No call-to-action.

**Fix**: Add empty state UI to:
- `Matches.tsx` — "No matches yet. Start swiping to find your match!" with a button to `/swipe`
- `Messages.tsx` — "No conversations yet. Match with someone to start chatting!" with a button to `/swipe`
- `LikedMe.tsx` — "No one has liked you yet. Complete your profile to get noticed!" with a button to `/my-profile`

Use existing `EmptyState.tsx` component or inline with Lucide icons + CTA button.

---

## Block 6: BulkActions Download Template Button
**Issue**: Line 712 in `BulkActionsPage.tsx` — "Download Template" button has no `onClick`.

**Fix**: Add onClick handler that generates and downloads a CSV template:
```typescript
onClick={() => {
  const csv = "email,name,age,gender,location,kurdistan_region\n";
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'user_import_template.csv';
  a.click(); URL.revokeObjectURL(url);
}}
```

---

## Block 7: Ghost User Generator — Lazy Import
**Issue**: `ghostUserGenerator.ts` (332 lines) bundled for all users. Only used by `GhostUsersPage.tsx`.

**Fix**: Change the import in `GhostUsersPage.tsx` to dynamic:
```typescript
const { generateGhostUsers, deleteAllGhostUsers, ... } = await import('@/utils/ghostUserGenerator');
```
This code-splits the generator so it's only loaded when an admin visits that page.

---

## Block 8: Dashboard Manual Tasks (Documentation Only)
These cannot be fixed via code — they require Supabase Dashboard action:

1. **Enable Leaked Password Protection**: Auth → Settings → Password Security → Enable
2. **Upgrade Postgres**: Infrastructure → Upgrade available
3. **Revoke `spatial_ref_sys` public access** (or accept as PostGIS system table)

These will be documented as a checklist in the PR description.

---

## Implementation Order
1. Block 3 (SuperAdmin design) + Block 4 (console.log) + Block 6 (template button) — parallel, independent files
2. Block 5 (empty states) — 3 page files
3. Block 7 (lazy import ghost generator) — 1 file
4. Block 1 (profile visibility view) — migration + frontend change
5. Block 2 (extension schema) — migration
6. Block 8 — document in commit message

**Estimated time**: ~45 minutes total. After this, all code-fixable issues are resolved.
