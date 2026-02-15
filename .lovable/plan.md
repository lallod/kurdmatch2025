
# Fix Profile Editing -- Data Not Persisting

## Root Causes Found

### Bug 1: `updateProfile` returns void but result is used as data
In `useRealProfileData.ts` (line 157), `updateProfile()` returns `void`, but the hook does:
```
const updated = await updateProfile(...);  // returns undefined
setProfileData(updated as any);            // sets profileData to undefined!
```
This **wipes out the local profile state** immediately after every save. The UI briefly shows empty/default data until `refreshData()` re-fetches.

### Bug 2: Triple success toast
Three separate toasts fire on every save:
1. Editor component (e.g., BasicInfoEditor line 49): `toast.success('Basic info updated successfully!')`
2. Hook (`useRealProfileData.ts` line 172): `toast.success('Profile updated successfully')`
3. `handleProfileUpdate` in MyProfile.tsx (line 215): `toast.success('Profile updated successfully')`

### Bug 3: `refreshData()` not awaited
In `handleProfileUpdate` (MyProfile.tsx line 216), `refreshData()` is called but not awaited, so the component may re-render before the fresh data arrives.

### Bug 4: Missing `kurdistanRegion` in fieldMap
The `handleProfileUpdate` fieldMap is missing `kurdistanRegion -> 'kurdistan_region'`, so Kurdistan region changes from BasicInfoEditor are silently dropped.

### Bug 5: No `onSaveComplete`/`onCancel` callbacks passed to editors
The `EditableAccordionSection` components pass editors without `onSaveComplete` or `onCancel`, so the section never switches back to view mode after saving.

---

## Fixes

### 1. Fix `updateProfile` to return fresh data (`src/api/profiles.ts`)
Change `updateProfile` to use `.select().single()` and return the updated row so the hook gets real data back.

### 2. Fix `useRealProfileData.ts` -- remove duplicate toast, handle returned data
- Use the returned data from `updateProfile` properly.
- Remove the `toast.success` call (let only the caller show toasts).
- After updating local state, call `loadRealProfileData()` to fully refresh (awaited).

### 3. Fix `handleProfileUpdate` in `MyProfile.tsx`
- Await `refreshData()` so the UI updates before the toast.
- Add missing `kurdistanRegion: 'kurdistan_region'` to the fieldMap.
- Keep only one toast (remove the one in `handleProfileUpdate` since each editor already shows its own).

### 4. Pass `onSaveComplete` and `onCancel` to all editors via `EditableAccordionSection`
- `EditableAccordionSection` will clone the `editorContent` element and inject `onSaveComplete` (sets `isEditing=false`) and `onCancel` (sets `isEditing=false`) callbacks automatically.
- This way every editor auto-closes after save or cancel.

### 5. Remove duplicate toasts from editors
Keep only the editor-level toast (one per editor). Remove toasts from `handleProfileUpdate` and `updateProfileData` in the hook.

---

## Files Changed

| File | Change |
|------|--------|
| `src/api/profiles.ts` | `updateProfile` returns updated row via `.select().single()` |
| `src/hooks/useRealProfileData.ts` | Fix `setProfileData` usage, remove duplicate toast, await refresh |
| `src/pages/MyProfile.tsx` | Await `refreshData`, add `kurdistanRegion` to fieldMap, remove duplicate toast |
| `src/components/my-profile/EditableAccordionSection.tsx` | Auto-inject `onSaveComplete`/`onCancel` into editor content |

All six editor components already have `onSaveComplete` and `onCancel` props -- they just need to receive them, which the updated `EditableAccordionSection` will handle.
