

# Fix Photo Upload, Persistence, and Management

## Problems Found

1. **Photos not saved to database**: `uploadProfilePhoto()` uploads the file to Supabase Storage and returns the URL, but never inserts a row into the `photos` table. The photo URL is only held in local React state and lost on refresh.

2. **Photos not loaded from database**: `galleryImages` only initializes from `profileData.profileImage` (a single field on the `profiles` table). It never queries the `photos` table, so previously uploaded photos don't appear.

3. **No "Set as First Photo" option**: Users cannot pick which photo becomes their primary/profile photo.

4. **No "Remove Photo" option**: Users cannot delete photos from their gallery.

5. **`getProfileById` missing photos join**: The function queries `profiles` only -- it never fetches from the `photos` table, so `profile.photos` is always empty.

## Changes

### 1. Fix `uploadProfilePhoto` to save in the `photos` table

After uploading the file to storage, insert a record into the `photos` table with `profile_id`, `url`, and `is_primary`. If it's the first photo, also update `profiles.profile_image`.

**File**: `src/api/profiles.ts`

### 2. Add `getUserPhotos`, `deletePhoto`, `setPhotoPrimary` API functions

- `getUserPhotos(userId)` -- fetches all photos from the `photos` table ordered by `is_primary DESC, created_at ASC`
- `deletePhoto(photoId)` -- deletes the photo record and removes the file from storage
- `setPhotoPrimary(photoId)` -- sets `is_primary = false` on all user photos, then sets the selected one to `is_primary = true`, and updates `profiles.profile_image` to that URL

**File**: `src/api/profiles.ts`

### 3. Fix `getProfileById` to include photos

Change the query from `select('*')` to also fetch from the `photos` table using a join: `select('*, photos(*)')`.

**File**: `src/api/profiles.ts`

### 4. Load gallery from `photos` table in MyProfile

Replace the `useEffect` that only reads `profileData.profileImage` with a proper fetch from the `photos` table on mount. This ensures all previously uploaded photos appear in the grid.

**File**: `src/pages/MyProfile.tsx`

### 5. Add photo management UI to the gallery grid

Each photo in the grid gets:
- **Long press / tap**: Opens a small action menu with:
  - "Set as Profile Photo" (star icon) -- calls `setPhotoPrimary`
  - "Remove" (trash icon) -- calls `deletePhoto`
- The primary photo shows a filled star badge (already exists visually)
- After any action, the gallery refreshes from the database

**File**: `src/pages/MyProfile.tsx`

### 6. Update `handleImageUpload` to refresh gallery

After a successful upload, re-fetch all photos from the `photos` table rather than just prepending to local state. This ensures consistency.

**File**: `src/pages/MyProfile.tsx`

## Technical Summary

| File | Changes |
|------|---------|
| `src/api/profiles.ts` | Add `getUserPhotos`, `deletePhoto`, `setPhotoPrimary` functions. Fix `uploadProfilePhoto` to insert into `photos` table. Fix `getProfileById` to join photos. |
| `src/pages/MyProfile.tsx` | Load photos from DB on mount. Add action menu (set primary / remove) on each photo tile. Refresh gallery after upload/delete/reorder. |

