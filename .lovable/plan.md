

## Final Pre-Publication Fix: Swipe Filter Values Mismatch

### Problem Found
The **Swipe page filters are completely broken** -- the dropdown values in `SwipeFilters.tsx` do not match the actual values stored in the database. When a user selects a filter, zero results will be returned because the filter values don't exist in the database.

### Mismatches to Fix

**1. Kurdistan Region** (most critical)
- SwipeFilters: `Bakur, Bashur, Rojava, Rojhelat, Diaspora`
- Database: `South-Kurdistan, North-Kurdistan, East-Kurdistan, West-Kurdistan, Diaspora`
- Fix: Change SwipeFilters to use DB values with Kurdish names as display labels

**2. Religion**
- SwipeFilters: `Muslim, Christian, Jewish, Yazidi, Spiritual, Agnostic, Atheist`
- Database: `Islam, Christianity, Judaism, Yazidism, Yarsanism, Secular, Spiritual`
- Fix: Update to match DB values (Islam, Christianity, Judaism, Yazidism, Yarsanism, Secular, Spiritual)

**3. Body Type**
- SwipeFilters: `Slim, Athletic, Average, Curvy, Plus Size`
- Database: `Slim, Athletic, Average, Curvy, Muscular`
- Fix: Replace `Plus Size` with `Muscular`

**4. Smoking**
- SwipeFilters: `Never, Socially, Regularly`
- Database: `Non-smoker, Rarely` (very few records, but values must match what users save)
- Fix: Update to match the values users can select in their profile settings

**5. Drinking**
- SwipeFilters: `Never, Socially, Regularly`
- Database: `Social, Never`
- Fix: Same approach -- match profile settings values

**6. Exercise Habits**
- SwipeFilters: `Daily, 3-4 times a week, Occasionally, Rarely, Never`
- Database: `Daily fitness routine, Regular exercise, Occasional exercise, Sometimes, Often, Rarely`
- Fix: Update to match DB values

**7. Education**
- SwipeFilters: `High School, Bachelor's, Master's, PhD, Trade School`
- Database: `High School, Bachelor's Degree, Master's Degree, PhD, Some College`
- Fix: Update to match DB values

### Implementation

**File to modify: `src/components/swipe/SwipeFilters.tsx`**

Update all Select dropdown options to use the exact values stored in the database. For Kurdistan Region specifically, use the DB value as the `SelectItem value` with Kurdish names in the display label, e.g.:
```
<SelectItem value="South-Kurdistan">South Kurdistan (Bashur)</SelectItem>
<SelectItem value="North-Kurdistan">North Kurdistan (Bakur)</SelectItem>
```

### Also verify
- `src/components/discovery/AdvancedSearchFilters.tsx` -- already uses correct `South-Kurdistan` values (confirmed OK)
- `src/pages/AdvancedSearch.tsx` -- uses correct values (confirmed OK)
- `src/hooks/useDiscoveryProfiles.ts` -- passes values directly, no mismatch (confirmed OK)
- `src/api/profiles.ts` -- filter pipeline is correct, just receives wrong values from UI (confirmed OK)

### Technical Details

Only **one file** needs changes: `src/components/swipe/SwipeFilters.tsx`

All 7 filter dropdowns need their `<SelectItem>` values updated to match actual database values. The filter logic in `src/api/profiles.ts` is correct -- it passes these values directly to Supabase `.eq()` queries, so the values just need to match what's in the DB.

No database changes needed. No other files need modification.

