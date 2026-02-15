

# Convert Free-Text Fields to Select Dropdowns, Simplify Languages, Move Photos

## Changes Overview

### 1. Convert fields from free-text to select/dropdown editing

The following fields currently use `fieldType="text"` (free-text input) but should use `fieldType="select"` with predefined options:

| Field | Component | Options |
|-------|-----------|---------|
| Height | ProfileBasics | 145 cm - 210 cm (generated range) |
| Ethnicity | ProfileBasics | Kurdish, Middle Eastern, European, Asian, African, Latin American, Mixed, Other |
| Political Views | ProfileBasics | Liberal, Conservative, Moderate, Progressive, Libertarian, Apolitical, Other |
| Work-Life Balance | ProfileLifestyle | Work-focused, Balanced, Life-focused, Flexible, Struggling |
| Dietary Preferences | ProfileLifestyle | No restrictions, Vegetarian, Vegan, Halal, Kosher, Pescatarian, Gluten-free, Other |
| Morning Routine | ProfileLifestyle | Early riser & active, Slow & relaxed, Coffee then go, Exercise first, Meditation/mindfulness |
| Evening Routine | ProfileLifestyle | Early to bed, Night owl, Reading/relaxing, Socializing, TV/streaming, Exercise |
| Ideal Date | ProfileInterests | Dinner & conversation, Outdoor adventure, Coffee shop, Movie night, Cooking together, Cultural event, Picnic, Surprise me |
| Career Ambitions | ProfileInterests | Climbing the ladder, Entrepreneurial, Content where I am, Career change, Creative pursuit, Work to live |
| Decision Making | ProfilePersonality | Already a select -- keep as is |
| Communication Style | ProfileCommunication | Direct, Diplomatic, Expressive, Reserved, Humorous, Analytical |

### 2. Fix Communication section -- remove Sheet popups, use inline editing

`ProfileCommunication.tsx` currently opens Sheet sidebars for editing languages and communication style. This needs to be refactored to:
- Use `DetailItem` with `onFieldEdit` for Communication Style (select dropdown inline)
- Remove the Sheet/sidebar editing pattern entirely
- Accept `onFieldEdit` prop like other sections

### 3. Simplify Languages section -- remove "Add new language"

- Remove the "Add new language" text input and button from LanguageEditor
- Remove the Sheet-based language editor entirely
- Replace with a simple inline badge-toggle list using the predefined `allLanguages` list
- Users can only toggle languages on/off from the predefined list (admin manages the list)
- Save happens automatically when toggling

### 4. Move Photos section above the accordion sections

In `MyProfile.tsx`, move the Photos grid (lines 396-418) to appear right after the Bio section and before the Quick Stats / Accordion sections.

## Technical Details

### Files Modified

| File | Change |
|------|--------|
| `src/components/profile/ProfileBasics.tsx` | Change Height to select (145-210 cm range), Ethnicity to select, Political Views to select |
| `src/components/profile/ProfileLifestyle.tsx` | Change Work-Life Balance, Dietary Preferences, Morning Routine, Evening Routine to select; add editable+onFieldEdit to Morning/Evening Routine |
| `src/components/profile/ProfileInterests.tsx` | Change Ideal Date and Career Ambitions to select |
| `src/components/profile/ProfileCommunication.tsx` | Remove all Sheet/sidebar editing; accept `onFieldEdit` prop; use DetailItem with select for Communication Style; simplify Languages to inline badge toggles (no add-new) |
| `src/pages/MyProfile.tsx` | Move Photos grid above Quick Stats; pass `onFieldEdit` to ProfileCommunication |

### Languages Redesign

The language section will show all predefined languages as toggleable badges inline (similar to how BasicInfoEditor already does it). Tapping a badge toggles it on/off and auto-saves via `onFieldEdit({ languages: updatedArray })`. No sidebar, no "Add new language" input.

### Height Select

Since there are many height options (145-210 cm), the `DetailItem` select dropdown will display them. The `fieldOptions` array will be generated as `["145 cm", "146 cm", ..., "210 cm"]`.

