

# Inline Editing -- Remove Popups

## Overview
Replace the bottom-sheet popup editors with inline editing directly inside each accordion section. When you tap the edit pencil icon, the section content switches from the read-only profile view to the editable form -- right in place, no popup.

## What Changes

### 1. EditableAccordionSection -- Toggle between View and Edit mode
- Add an `isEditing` state toggled by the pencil button.
- When `isEditing` is false, show the existing read-only profile viewer (ProfileBasics, ProfileLifestyle, etc.).
- When `isEditing` is true, show the editor component (BasicInfoEditor, LifestyleEditor, etc.) inline.
- The pencil icon changes to an X (close) icon when editing, so users can cancel.

### 2. MyProfile.tsx -- Remove all Sheet/popup code
- Remove the `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` imports and the bottom sheet rendering loop (lines 542-560).
- Remove the `openSheet` state entirely.
- Remove the "Edit Profile" button that opens a sheet.
- Each `EditableAccordionSection` now receives both its viewer child AND its editor component as props.
- When saving inside an editor, it calls `onUpdate` (same as before, saves directly to DB), then switches back to view mode.

### 3. Editor components -- Theme and auto-close fixes
- Update editor styling from hardcoded dark (`bg-gray-800`, `text-white`, `text-purple-200`) to use CSS variables (`bg-card`, `text-foreground`, `text-muted-foreground`) so they blend with the page instead of looking like a popup.
- After a successful save, signal the parent to exit edit mode (via a new `onSaveComplete` callback).
- Files affected:
  - `BasicInfoEditor.tsx`
  - `LifestyleEditor.tsx`
  - `ValuesPersonalityEditor.tsx`
  - `InterestsHobbiesEditor.tsx`
  - `EducationCareerEditor.tsx`
  - `RelationshipPreferencesEditor.tsx`

### 4. Section mapping
Each accordion section will pair its viewer and editor:

```text
Basics           -> ProfileBasics (view)         + BasicInfoEditor (edit)
Lifestyle        -> ProfileLifestyle (view)      + LifestyleEditor (edit)
Communication    -> ProfileCommunication (view)  + RelationshipPreferencesEditor (edit)
Personality      -> ProfilePersonality (view)    + ValuesPersonalityEditor (edit)
Creative         -> ProfileCreative (view)       + InterestsHobbiesEditor (edit)
Travel           -> ProfileTravel (view)         + LifestyleEditor (edit)
```

### 5. Database-first save
Each editor's save handler already calls `handleProfileUpdate` which maps camelCase fields to snake_case DB columns and calls `updateProfileData`. This flow remains unchanged -- edits save directly to the database via Supabase.

## Technical Details

### EditableAccordionSection changes
- New props: `editorContent` (ReactNode) -- the editor form to show when editing.
- Internal `isEditing` state, toggled by pencil/X button.
- When `isEditing=true`, render `editorContent` instead of `children`.

### Editor onSaveComplete callback
- Each editor receives a new optional `onSaveComplete?: () => void` prop.
- Called after successful save so the accordion section can switch back to view mode.
- Cancel button also exits edit mode.

### No new dependencies
All existing components reused. No new packages.

