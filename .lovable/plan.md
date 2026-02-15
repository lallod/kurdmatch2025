

# Fix White Cards and Add Per-Field Inline Editing on My Profile

## Problem 1: White Quick Stats Cards
The `ProfileQuickStats` component uses hardcoded light colors (`from-gray-50/90 to-white/95`, `border-gray-100/80`, `text-gray-600`) which appear as bright white cards in the dark theme. These need to use theme-aware CSS variables instead.

## Problem 2: Edit Icon on Category Header Instead of Per-Field
Currently, the edit pencil icon sits next to the category name (e.g., "Basics" pencil icon). Clicking it replaces the entire section content with a form editor. The user wants each individual data value to have its own edit icon, allowing inline editing of that specific field with instant save.

## Solution

### 1. Fix White Cards in `ProfileQuickStats.tsx`
Replace hardcoded light colors with theme-aware classes:
- `from-gray-50/90 to-white/95` becomes `from-card to-card`
- `border-gray-100/80` becomes `border-border/20`
- `text-gray-600` becomes `text-muted-foreground`
- Remove tinder-specific hover shadows, use theme colors

### 2. Create Inline Editable Field Component
Build a new `InlineEditableField` component that:
- Shows the current value with a small pencil icon next to it
- On tap, transforms into an input/select field inline (no modal, no section swap)
- Auto-saves on blur or Enter key press
- Calls `handleProfileUpdate` with just that single field
- Shows a brief checkmark animation on successful save

### 3. Update Profile Section Components for Per-Field Editing
Modify the `DetailItem` component and the profile section components (`ProfileBasics`, `ProfileLifestyle`, etc.) to accept an optional `onEdit` callback per field. When on the MyProfile page, each value gets the inline edit pencil; when viewing someone else's profile, no edit icons appear.

### 4. Remove Category-Level Edit Button
Update `EditableAccordionSection` or the MyProfile page to stop showing the pencil icon next to category names. The per-field edit replaces this pattern entirely.

## Technical Details

### New File: `src/components/my-profile/InlineEditableField.tsx`
- Props: `value`, `fieldKey`, `onSave`, `type` (text/select/badges), `options` (for selects)
- States: `isEditing`, `tempValue`, `saving`
- On blur/Enter: calls `onSave({ [fieldKey]: tempValue })`, shows success indicator
- Pencil icon size: `h-3 w-3`, subtle, appears on the right side of each value

### Modified: `src/components/profile/DetailItem.tsx`
- Add optional `onEdit` and `editConfig` props
- When `onEdit` is provided, render pencil icon next to each value badge/text
- Clicking pencil opens inline edit for that specific value

### Modified: `src/components/profile/ProfileBasics.tsx` (and other section files)
- Accept optional `onFieldEdit` callback
- Pass it through to each `DetailItem` with field-specific config

### Modified: `src/components/profile/ProfileQuickStats.tsx`
- Fix card colors to use theme variables
- Add per-field edit icons (pencil next to each value like Education, Work, etc.)
- Each field saves independently on edit

### Modified: `src/pages/MyProfile.tsx`
- Remove `editorContent` prop from `EditableAccordionSection` calls (no more category-level editors)
- Pass `onFieldEdit={handleProfileUpdate}` to each profile section component
- The `EditableAccordionSection` can be simplified or replaced with plain accordion items since editing now happens per-field

### Data Flow (Real-Time)
The existing `handleProfileUpdate` -> `updateProfileData` flow already does optimistic local updates (from the previous fix). Each field edit will:
1. User taps pencil next to "Height: 175 cm"
2. Value transforms to a select dropdown inline
3. User picks new value, taps away or presses done
4. `handleProfileUpdate({ height: '180 cm' })` is called
5. DB updates, local state merges optimistically -- no page refresh, no loading spinner

## Files Changed

| File | Change |
|------|--------|
| `src/components/my-profile/InlineEditableField.tsx` | New -- reusable inline edit component |
| `src/components/profile/ProfileQuickStats.tsx` | Fix white card colors, add per-field edit |
| `src/components/profile/DetailItem.tsx` | Add optional inline edit support |
| `src/components/profile/ProfileBasics.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfileLifestyle.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfileInterests.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfileCommunication.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfilePersonality.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfileCreative.tsx` | Pass edit callbacks per field |
| `src/components/profile/ProfileTravel.tsx` | Pass edit callbacks per field |
| `src/pages/MyProfile.tsx` | Remove category editors, pass field edit callbacks to sections |

