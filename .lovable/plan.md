

## Profile Update Issues - Deep Scan & Fix Plan

### Problems Found

**1. Random fake data overwrites real database values on every page load**
- `fillEmptyProfileFields()` and `assignRandomValues()` run on every load in `useRealProfileData.ts`
- They fill "empty" fields with random values, but their `isEmpty()` check treats legitimate values like "Not specified" or "Prefer not to say" as empty, replacing them with random data
- This means: after a user saves a value, if they reload the page, random values may overwrite their saved data in the UI (though the DB is correct, the UI shows wrong data)

**2. Optimistic update merges into randomly-filled enhanced data, not raw DB data**
- When a user edits a field, `updateProfileData()` merges into `enhancedData` which already contains random values
- The DB update succeeds, but the local state still has random values for other fields
- On next reload, random values are regenerated (different ones), making the profile look inconsistent

**3. `DetailItem` select values don't match DB values after save**
- The `DetailItem` component passes the human-readable select option (e.g., "Socially") directly via `handleProfileUpdate`
- `handleProfileUpdate` correctly maps camelCase keys to snake_case DB columns
- However, `valueMapping.ts` has a separate mapping system (`dbToUiValueMapping`) that converts DB values to different UI keys -- but this mapping is **skipped** in `useRealProfileData` (line 122: "Skip value conversion")
- This creates a mismatch: the select options use human-readable values like "Socially" but the value mapping system expects keys like "socially"

**4. Missing fields in `fieldNameMapping.ts`**
- Several fields used in the profile are missing from `dbToUiFieldMapping`: `morning_routine`, `evening_routine`, `decision_making_style`, `growth_goals`, `hidden_talents`, `stress_relievers`, `charity_involvement`, `music_instruments`, `favorite_games`, `tech_skills`, `dream_home`, `transportation_preference`, `work_environment`, `ideal_weather`, `dream_vacation`, `favorite_memory`
- These fields fall through to raw `(realProfileData as any)` casts in `MyProfile.tsx`

**5. Profile data not shared across pages (Swipe/Instagram)**
- `MyProfile.tsx` is the only page using `useRealProfileData` hook
- Swipe page fetches profiles via `getProfileSuggestions` which reads directly from DB -- this works correctly
- Instagram profile page (`ProfileAbout.tsx`) fetches via `getProfileById` -- also reads from DB directly
- So updates DO reflect on other pages after DB save, but only after a page reload/refetch

### Fix Plan

#### Step 1: Stop filling empty fields with random fake data
- Remove `fillEmptyProfileFields()` call from `useRealProfileData.ts`
- Remove `assignRandomValues()` call from `useRealProfileData.ts`
- Instead, let empty fields display as empty/null -- the UI already handles "Not specified" display
- This is the **root cause** of most update issues -- random data masks real data

#### Step 2: Simplify the data loading pipeline in `useRealProfileData.ts`
- Load profile from DB -> convert field names to camelCase -> set as profile data
- No random filling, no value conversion, no enhancement layers
- Keep `fieldSources` tracking but mark all fields as `'user'` since they come from the real DB

#### Step 3: Fix `updateProfileData` to properly merge state
- After successful DB update, merge the snake_case updates into raw `profileData`
- Also merge camelCase equivalents so UI components see the change immediately
- Remove dependency on `enhancedData` wrapper

#### Step 4: Add all missing fields to `fieldNameMapping.ts`
- Add the 16+ missing field mappings (morning_routine, evening_routine, dream_home, etc.)
- This ensures `convertDbToUiProfile` handles all fields consistently

#### Step 5: Ensure profile completion calculation works without random data
- Update `getUserOnboardingProgress` to calculate based on actual DB values only
- Empty fields correctly count as incomplete (which is the desired behavior)

#### Step 6: Verify the swipe and Instagram pages read fresh data
- These pages already read directly from the DB, so they will show correct data once the profile update actually saves correctly
- No changes needed for these pages -- the issue was that the MyProfile page was showing random data, not the saved data

### Technical Details

Files to modify:
- `src/hooks/useRealProfileData.ts` -- Remove random data filling, simplify pipeline
- `src/utils/fieldNameMapping.ts` -- Add 16+ missing field mappings
- `src/pages/MyProfile.tsx` -- Clean up `as any` casts since field mappings will be complete
- `src/utils/directProfileFiller.ts` -- Keep file but stop calling it from the main flow
- `src/utils/profileEnhancement.ts` -- Keep file but stop calling it from the main flow

Files that work correctly (no changes needed):
- `src/api/profiles.ts` -- `updateProfile()` correctly saves to DB
- `src/components/profile/DetailItem.tsx` -- Correctly sends field edits
- `src/pages/MyProfile.tsx` `handleProfileUpdate()` -- Correctly maps camelCase to snake_case

