

# Fix Profile Data Saving Issues

## Problem Summary
Profile edits from the My Profile page are not reliably saving to the database due to **value format mismatches** in the data conversion pipeline. The data goes through multiple transformation layers (field name mapping, value mapping, random filling) that conflict with each other.

## Root Causes

1. **Value format mismatch on save**: When you edit a field (e.g., Drinking), the select shows options like "Never", "Socially". But the save pipeline tries to convert these using a mapping that expects lowercase keys like "never", "socially" -- so the conversion silently fails and inconsistent values get saved.

2. **Double field-name conversion**: `handleProfileUpdate` in MyProfile.tsx already converts field names from camelCase to snake_case. Then `updateProfileData` does the same conversion again -- redundant and error-prone.

3. **Displayed values are converted UI keys**: The load pipeline converts database values like "Non-drinker" into UI keys like "never", which is what gets displayed. But the edit select options show human-readable labels like "Never" -- these don't match, so the select can't show the current value.

4. **Random filler values interfere**: Empty fields get filled with random values before display, making it unclear what's real data vs. generated data, and these random values go through additional format conversions.

## Solution

### Step 1: Simplify the save path in `handleProfileUpdate` (MyProfile.tsx)
- Send values directly to the database without going through `convertUiToDbValues`, since the inline editor select options already use human-readable values the DB can store directly.
- Keep the camelCase-to-snake_case field name mapping (which works correctly).

### Step 2: Fix `updateProfileData` in `useRealProfileData.ts`
- Remove the redundant `convertUiToDbProfile` call since the caller already provides snake_case keys.
- Remove the `convertUiToDbValues` call since values from inline editors are already in DB-compatible format.
- Save the raw values directly to the database.

### Step 3: Fix value display consistency
- Update `convertDbToUiValues` usage: stop converting DB values to UI keys for display purposes. The inline editors expect human-readable values that match their select options.
- Alternatively, make the DetailItem component aware of the value mapping so it can properly translate between display values and stored values.

### Step 4: Fix optimistic state update
- After saving, merge the new values into the local state correctly so the UI updates immediately without needing a full reload.

## Technical Details

### Files to modify:

**`src/hooks/useRealProfileData.ts`**
- In `updateProfileData`: remove `convertUiToDbProfile` and `convertUiToDbValues` calls. Pass values directly to `updateProfile()`.
- Fix the optimistic state merge to work with the simplified format.

**`src/pages/MyProfile.tsx`**
- In `handleProfileUpdate`: keep the camelCase-to-snake_case field map but ensure values pass through unchanged to the DB.

**`src/utils/valueMapping.ts`**
- Either remove value mapping from the load path, or make the DetailItem select options use the same format as the mapped values. The simpler fix: stop value-mapping on load so displayed values match DB values and select options.

**`src/components/profile/DetailItem.tsx`**
- Ensure `tempValue` initialization correctly matches one of the select options so the current value is shown when editing begins.

### Expected behavior after fix:
- Editing any field saves the selected value directly to the database
- The displayed value matches the select options (no format mismatch)
- Saves persist across page reloads
- No double-conversion of field names or values

