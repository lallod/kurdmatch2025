
# Fix Profile Editing Not Saving to Database

## Root Cause

There is a database trigger `update_profiles_updated_at` on the `profiles` table that runs `NEW.updated_at = NOW()` on every UPDATE. However, the `profiles` table does **not** have an `updated_at` column. This causes every single profile update to fail with:

```
record "new" has no field "updated_at"
```

No data is ever saved -- the error silently prevents the write.

## Fix

### 1. Drop the broken trigger (Database Migration)
Remove the `update_profiles_updated_at` trigger from the `profiles` table since the table has no `updated_at` column and doesn't need one.

```sql
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
```

That single SQL statement fixes all profile editing. No code changes are needed -- the existing `DetailItem` inline editing, `useRealProfileData.updateProfileData`, and `updateProfile` API all work correctly once the database stops rejecting updates.

## Files Changed

| File | Change |
|------|--------|
| Database migration | Drop the `update_profiles_updated_at` trigger |

No application code changes required.
