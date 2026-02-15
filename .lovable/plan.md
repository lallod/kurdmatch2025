

# Optimistic Local Update Instead of Full Page Refresh

## Problem
After saving an edit, `updateProfileData` calls `loadRealProfileData()` which re-fetches the entire profile from the database, recalculates onboarding progress, re-fetches engagement metrics, and re-runs all enhancement/filling logic. This causes the whole page to flicker/reload unnecessarily.

## Solution
Replace the full `loadRealProfileData()` call with an optimistic local state update -- merge only the changed fields into the existing state so the UI updates instantly without any visible refresh.

## Changes (1 file)

### `src/hooks/useRealProfileData.ts` -- `updateProfileData` function

Replace the current approach:
```
await updateProfile(profileData.id, dbValueUpdates);
await loadRealProfileData(); // <-- full refresh, causes flicker
```

With optimistic local merge:
1. Save to database via `updateProfile` (keeps the returned data)
2. Merge the updates into the existing `profileData` state locally
3. Merge the updates into the existing `enhancedData` state locally, marking changed fields as user-set via `updateFieldWithSource`
4. Recalculate onboarding progress using the locally-updated data (lightweight, no network call)
5. Skip re-fetching engagement metrics (likes/views/matches don't change on profile edit)

This means only the edited fields update in the UI -- no loading spinner, no flicker, no full re-render.

