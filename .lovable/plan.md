
# Add "See more" Button for Long Badge Lists (Languages & All Arrays)

## Problem

Languages (and other array fields like Interests, Hobbies, etc.) can have many items, making the badge lists very long. Users need a "See more" / "See less" toggle to collapse long lists.

## Solution

Add a collapsible display to badge arrays in **three locations**:

1. **`LanguageDisplay.tsx`** (swipe page) -- Show first 3 languages, then a "See more" button to expand
2. **`ProfileAbout.tsx`** (Instagram profile) -- Apply the same truncation to all array badge sections (Languages, Interests, Growth Goals, etc.), showing first 3 with "See more"
3. Both use the same pattern: show N items by default, a subtle text button to expand, and "See less" to collapse

## Technical Details

### File: `src/components/profile/LanguageDisplay.tsx`
- Add `useState` for `expanded` (default false)
- Show only first 3 badges when collapsed
- After the 3rd badge, show a "+X more" text button
- Clicking it expands to show all; shows "See less" to collapse

### File: `src/components/instagram/ProfileAbout.tsx`
- In the arrays rendering section (lines 205-222), add the same truncation logic
- Show first 3 badges per array field when collapsed
- Add a small "See more" / "See less" toggle per array group
- Use local state keyed by array label to track which are expanded

### Default visible count: 3 badges
This keeps the UI compact while still giving a preview of the data.
