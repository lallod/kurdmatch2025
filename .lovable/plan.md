

# MyProfile Page Redesign

## Overview
Redesign the MyProfile page so it shows your profile exactly as other users see it (using the same visual components), with inline edit buttons on each section. Add a dedicated Privacy and Visibility panel with field toggles and blur photos control.

## What Changes

### 1. New Layout Structure
The page will be reorganized into three main areas:

- **Profile Preview** -- Your profile rendered using the same `ProfileDetails`, `ProfileBio`, `ProfileQuickStats`, and accordion sections that other users see when viewing your profile. This gives you a true "what others see" preview.
- **Inline Edit Buttons** -- Each section (Basics, Lifestyle, Interests, etc.) gets a small pencil/edit icon in its header. Tapping it opens the existing bottom-sheet editor for that section, saving directly to the database.
- **Privacy and Visibility Panel** -- Placed below the profile preview, containing the existing `PrivacySettings` component (field visibility toggles, blur photos switch, and share-with-matches).

### 2. Profile Preview Section
- Reuse the existing `MobileProfileDetails` / `DesktopProfileDetails` components (the same ones used on `/profile/:id`) to render your own data.
- Map your profile data from `useRealProfileData` into the `details` prop format these components expect (about, height, bodyType, interests, etc.).
- Add a floating "Edit" icon overlay on each accordion section header so you can tap to open the corresponding editor sheet.

### 3. Header Area (Kept Simplified)
- Profile photo with camera upload button (existing).
- Name, age, verified badge, occupation, location, Kurdistan region badge.
- Stats bar (Views, Likes, Matches).
- Completion banner (if < 100%).
- "Share Profile" button.

### 4. Photo Grid
- Keep the existing photo grid with upload capability.

### 5. Privacy and Visibility Section
- Render the existing `PrivacySettings` component as-is (it already handles blur photos, field visibility toggles by category, and share-with-matches).
- Add a section header "Privacy & Visibility" with a Shield icon.

## Technical Details

### Files Modified
- **`src/pages/MyProfile.tsx`** -- Major rewrite:
  - Remove the current "profile sections list" (the cards with completion % that just link to editors).
  - Instead, render profile data through the viewer components (`ProfileBio`, `ProfileQuickStats`, `ProfileBasics`, `ProfileLifestyle`, `ProfileInterests`, `ProfileCommunication`, `ProfilePersonality`, `ProfileCreative`, `ProfileTravel`) wrapped in accordion sections.
  - Add an edit button overlay on each accordion section that opens the corresponding editor sheet.
  - Keep the bottom-sheet editors (already working, save directly to DB).
  - Keep `PrivacySettings` at the bottom.

### Data Mapping
The `useRealProfileData` hook returns database-format fields. A mapping object will convert these to the `details` prop shape expected by the profile viewer components:

```text
profileData.bio         -> details.about
profileData.height      -> details.height
profileData.body_type   -> details.bodyType
profileData.interests   -> details.interests
... etc
```

### Edit Flow
Each section header gets an edit button. When clicked, it opens the same bottom-sheet editor that exists today (BasicInfoEditor, LifestyleEditor, etc.). These editors already save directly to the database via `updateProfileData`.

### No New Dependencies
All existing components and hooks are reused. No new packages needed.

